package pl.edu.pg.eti.playrooms.controller.impl;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pl.edu.pg.eti.playrooms.controller.api.PlayroomController;
import pl.edu.pg.eti.playrooms.dto.GetPlayrooms;
import pl.edu.pg.eti.playrooms.dto.PlayroomInfo;
import pl.edu.pg.eti.playrooms.dto.PutPlayroom;
import pl.edu.pg.eti.playrooms.entity.Playroom;
import pl.edu.pg.eti.playrooms.event.api.PlayroomEventRepository;
import pl.edu.pg.eti.playrooms.service.api.PlayroomService;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
public class PlayroomDefaultController implements PlayroomController {

    private final PlayroomService playroomService;
    private final Map<String, WebSocketSession> webSocketSessions;
    private final PlayroomEventRepository playroomEventRepository;

    @Autowired
    public PlayroomDefaultController(PlayroomService playroomService,
                                     PlayroomEventRepository playroomEventRepository) {
        this.playroomService = playroomService;
        this.webSocketSessions = Collections.synchronizedMap(new HashMap<>());
        this.playroomEventRepository = playroomEventRepository;
    }

    @Override
    public ResponseEntity<PlayroomInfo> createNewPlayroom() {
        UUID playroomId = UUID.randomUUID();
        playroomService.create(Playroom.builder()
                .uuid(playroomId)
                .build());

        return ResponseEntity.ok(PlayroomInfo.builder()
                .uuid(playroomId.toString())
                .build());
    }

    @Override
    public void updatePlayroom(String playroomId, PutPlayroom request) {
        Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
        if (playroom != null) {
            playroomService.update(Playroom.builder()
                    .uuid(UUID.fromString(playroomId))
                    .isGlobalTimer(request.getIsGlobalTimer())
                    .paused(true)
                    .ended(false)
                    .currentPlayer(1)
                    .lastOperationTime(LocalTime.now())
                    .globalTimerValue(request.getTimer())
                    .game(new Playroom.Game(request.getGameId(), request.getGame()))
                    .players(new HashMap<>())
                    .build());

            playroomEventRepository.updateGame(request.getGameId(), request.getGame(),
                    !request.getIsGlobalTimer(), request.getTimer().intValue());
        }
    }

    @Override
    public GetPlayrooms getPlayrooms() {
        List<Playroom> playrooms = playroomService.findAll();
        return GetPlayrooms.builder()
                .playrooms(playrooms.stream()
                        .map(playroom -> GetPlayrooms.Playroom.builder()
                                .id(playroom.getUuid().toString())
                                .game(playroom.getGame().getName())
                                .numOfPlayers(playroom.getPlayers().size())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public void joinPlayroom(WebSocketSession webSocketSession, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        if (playroomId != null) {
            Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            if (playroom != null) {
                UUID uuid;
                String uuidValue = getStringValue("id", message.getJSONObject("player"));
                if (uuidValue == null || "null".equals(uuidValue)) uuid = null;
                else uuid = UUID.fromString(uuidValue);
                Playroom.Player newPlayer = new Playroom.Player(
                        uuid, message.getJSONObject("player").getString("username"),
                        playroom.getGlobalTimerValue(), false, false, webSocketSession.getId());

                Map<Integer, Playroom.Player> updatedPlayers = playroom.getPlayers();
                updatedPlayers.put(updatedPlayers.size() + 1, newPlayer);
                playroom.setPlayers(updatedPlayers);
                playroomService.update(playroom);
                webSocketSessions.put(newPlayer.getWebSocketSessionId(), webSocketSession);

                updateLastModDate(playroom);
                sendMessagesWithUpdate(playroom.getPlayers(), playroomId);

                if (newPlayer.getUuid() != null) {
                    playroomEventRepository.createExperience(newPlayer.getUuid().toString(), playroom.getGame().getId());
                }
            }
        }
    }

    @Override
    public void quitPlayroom(String sessionId, JSONObject message) {
        Playroom playroom = null;
        if (message == null) {
            playroom = getPlayroomByPlayerSession(sessionId);
        }
        else {
            String playroomId = getStringValue("playroomId", message);
            if (playroomId != null) {
                playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            }
        }

        if (playroom != null) {
            Map<Integer, Playroom.Player> players = playroom.getPlayers();
            List<Integer> playerNumbers = players.keySet().stream().sorted().toList();
            int k = 1;
            for (int i = 0; i < players.size(); i++) {
                Playroom.Player player = players.get(playerNumbers.get(i));
                if (player.getWebSocketSessionId().equals(sessionId)) {
                    players.remove(playerNumbers.get(i));
                } else {
                    players.put(k, player);
                }
                k++;
            }
            if (!players.isEmpty()) {
                playroom.setCurrentPlayer((playroom.getCurrentPlayer() % players.size()) + 1);
                playroom.setPlayers(players);
            }
            playroomService.update(playroom);
            sendMessagesWithUpdate(playroom.getPlayers(), playroom.getUuid().toString());
            updateLastModDate(playroom);

        }
        if (webSocketSessions.get(sessionId).isOpen()) {
            try {
                webSocketSessions.get(sessionId).close();
            }
            catch (IOException ex) {
                System.err.println("Cannot close websocket: " + sessionId);
            }
        }
        webSocketSessions.remove(sessionId);
    }

    @Override
    public void endTurn(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        if (playroomId != null) {
            Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            if (playroom != null && isPlayerInPlayroom(sessionId, playroom) &&
                    playroom.getPlayers().get(playroom.getCurrentPlayer()).getWebSocketSessionId().equals(sessionId)) {
                updateLastModDate(playroom);
                playroom.setCurrentPlayer((playroom.getCurrentPlayer() % playroom.getPlayers().size()) + 1);

                updateLastModDate(playroom);
                sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
            }
        }
    }

    @Override
    public void pause(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        if (playroomId != null) {
            Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            if (playroom != null && isPlayerInPlayroom(sessionId, playroom)) {
                updateLastModDate(playroom);
                playroom.setPaused(true);

                updateLastModDate(playroom);
                sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
            }
        }
    }

    @Override
    public void start(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        if (playroomId != null) {
            Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            if (playroom != null && isPlayerInPlayroom(sessionId, playroom)) {
                updateLastModDate(playroom);
                playroom.setPaused(false);

                updateLastModDate(playroom);
                sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
            }
        }
    }

    @Override
    public void win(String sessionId, JSONObject message) {

    }

    @Override
    public void endGame(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        if (playroomId != null) {
            Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            if (playroom != null && isPlayerInPlayroom(sessionId, playroom)) {
                playroom.setEnded(true);
                updateLastModDate(playroom);
                sendMessagesWithUpdate(playroom.getPlayers(), playroomId);

                for (Playroom.Player player: playroom.getPlayers().values()) {
                    quitPlayroom(player.getWebSocketSessionId(), new JSONObject()
                            .put("operation", "quitPlayroom")
                            .put("playroomId", playroomId));
                }
                playroomService.delete(UUID.fromString(playroomId));
            }
        }
    }

    @Override
    public void status(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        if (playroomId != null) {
            Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            if (playroom != null) {
                sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
                updateLastModDate(playroom);
            }
        }
    }

    private boolean isPlayerInPlayroom(String sessionId, Playroom playroom) {
        for (Playroom.Player player: playroom.getPlayers().values()) {
            if (player.getWebSocketSessionId().equals(sessionId)) {
                return true;
            }
        }
        return false;
    }

    private Playroom getPlayroomByPlayerSession(String sessionId) {
        List<Playroom> playrooms = playroomService.findAll();
        for (Playroom playroom : playrooms) {
            for (Playroom.Player player : playroom.getPlayers().values()) {
                if (player.getWebSocketSessionId().equals(sessionId)) {
                    return playroom;
                }
            }
        }
        return null;
    }

    private String getStringValue(String key, JSONObject json) {
        try {
            return json.get(key).toString();
        }
        catch (Exception ex) {
            System.err.println("Cannot resolve the value for key: " + key);
            return null;
        }
    }

    private void sendMessagesWithUpdate(Map<Integer, Playroom.Player> players, String playroomId) {
        JSONObject gameStatus = getGameStatus(playroomId);
        for (int playerNumber: players.keySet()) {
            WebSocketSession webSocketSession = webSocketSessions.get(
                    players.get(playerNumber).getWebSocketSessionId());
            if (webSocketSession != null) {
                sendMessageJSON(webSocketSession, gameStatus);
            }
            else {
                players.remove(playerNumber);
            }
        }
    }

    private void sendMessageJSON(WebSocketSession webSocketSession, JSONObject message) {
        try {
            webSocketSession.sendMessage(new TextMessage(message.toString()));
        }
        catch (IOException ex) {
            System.err.println("Cannot send message: " + message + "\nWebSocketSession: " + webSocketSession.getId());
        }
    }

    private void updateLastModDate(Playroom playroom) {
        if (!playroom.isPaused()) {
            if (playroom.isGlobalTimer()) {
                playroom.setGlobalTimerValue(playroom.getGlobalTimerValue() +
                        (Duration.between(LocalTime.now(), playroom.getLastOperationTime()).toMillis() / 1000.0));
            }
            else {
                Map<Integer, Playroom.Player> players = playroom.getPlayers();
                Playroom.Player player = players.get(playroom.getCurrentPlayer());
                player.setTimer(player.getTimer() +
                        (Duration.between(LocalTime.now(), playroom.getLastOperationTime()).toMillis() / 1000.0));
                players.put(playroom.getCurrentPlayer(), player);
                playroom.setPlayers(players);
            }
        }
        playroom.setLastOperationTime(LocalTime.now());
        playroomService.update(playroom);
    }

    /**
     * Get information about playroom with specific ID
     * @param uuid - playroom ID
     * @return JSON Object represents playroom (empty object if not exists)
     * {
     *     "timer": --timer-- (null if timer is local),
     *     "paused": --true/false--,
     *     "currentPlayer": --playerNumber--,
     *     "ended": --true/false--,
     *     "game": {
     *         "gameID": --gameID--,
     *         "name": --gameName--
     *     },
     *     "players": [
     *         {
     *             "queueNumber": 1
     *             "name": --playerName--,
     *             "timer": --playerTimer-- (null if timer is global)
     *         },
     *         {
     *             "queueNumber": 2
     *             "name": --playerName--,
     *             "timer": --playerTimer-- (null if timer is global)
     *         },
     *         ...
     *     ]
     * }
     */
    private JSONObject getGameStatus(String uuid) {
        JSONObject gameStatus = new JSONObject();

        Playroom playroom = playroomService.find(UUID.fromString(uuid)).orElse(null);
        if (playroom == null) {
            System.err.println("Wrong playroom ID: " + uuid);
        }
        else {
            if (playroom.isGlobalTimer()) {
                gameStatus.put("timer", playroom.getGlobalTimerValue());
            }
            else {
                gameStatus.put("timer", JSONObject.NULL);
            }
            gameStatus.put("paused", playroom.isPaused());
            gameStatus.put("ended", playroom.isEnded());
            gameStatus.put("currentPlayer", playroom.getCurrentPlayer());

            JSONObject game = new JSONObject();
            game.put("gameID", playroom.getGame().getId());
            game.put("name", playroom.getGame().getName());
            gameStatus.put("game", game);

            JSONArray players = new JSONArray();
            for (int playerNumber: playroom.getPlayers().keySet()) {
                JSONObject player = new JSONObject();
                player.put("queueNumber", playerNumber);
                player.put("name", playroom.getPlayers().get(playerNumber).getUsername());
                if (!playroom.isGlobalTimer()) {
                    player.put("timer", playroom.getPlayers().get(playerNumber).getTimer());
                }
                else {
                    player.put("timer", JSONObject.NULL);
                }
                players.put(player);
            }
            gameStatus.put("players", players);
        }

        return gameStatus;
    }

}
