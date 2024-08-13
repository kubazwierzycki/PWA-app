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
    private final Map<UUID, String> operationsToConfirm;

    @Autowired
    public PlayroomDefaultController(PlayroomService playroomService,
                                     PlayroomEventRepository playroomEventRepository) {
        this.playroomService = playroomService;
        this.webSocketSessions = Collections.synchronizedMap(new HashMap<>());
        this.playroomEventRepository = playroomEventRepository;
        this.operationsToConfirm = Collections.synchronizedMap(new HashMap<>());
    }

    @Override
    public ResponseEntity<PlayroomInfo> createNewPlayroom() {
        UUID playroomId = UUID.randomUUID();
        playroomService.create(Playroom.builder()
                .uuid(playroomId)
                .paused(true)
                .ended(false)
                .currentPlayer(1)
                .hostId(null)
                .isWaitingRoomClosed(false)
                .lastOperationTime(LocalTime.now())
                .globalTimerValue(null)
                .game(null)
                .players(new HashMap<>())
                .playersWaitingRoom(new HashMap<>())
                .build());

        return ResponseEntity.ok(PlayroomInfo.builder()
                .uuid(playroomId.toString())
                .build());
    }

    @Override
    public void updatePlayroom(String playroomId, PutPlayroom request) {
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null) {
            playroom.setGlobalTimer(request.getIsGlobalTimer());
            playroom.setGame(new Playroom.Game(request.getGameId(), request.getGame()));
            playroom.setGlobalTimerValue(request.getTimer());

            playroom.setLastOperationTime(LocalTime.now());
            playroomService.update(playroom);

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
    public void joinWaitingRoom(WebSocketSession webSocketSession, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && !playroom.isWaitingRoomClosed()) {
            UUID uuid;
            boolean guest;
            String uuidValue = getStringValue("id", message.getJSONObject("player"));
            if (uuidValue == null || "null".equals(uuidValue)) {
                uuid = null;
                guest = true;
            } else {
                uuid = UUID.fromString(uuidValue);
                guest = false;
            }
            Playroom.Player newPlayer = new Playroom.Player(
                    UUID.randomUUID(), uuid, message.getJSONObject("player").getString("username"),
                    null, false, guest, webSocketSession.getId());

            Map<String, Playroom.Player> updatedPlayers = playroom.getPlayersWaitingRoom();
            if (!guest && playroom.getPlayersWaitingRoom().isEmpty()) {
                playroom.setHostId(newPlayer.getUuid());
            }
            updatedPlayers.put(webSocketSession.getId(), newPlayer);
            playroom.setPlayersWaitingRoom(updatedPlayers);
            playroomService.update(playroom);
            webSocketSessions.put(newPlayer.getWebSocketSessionId(), webSocketSession);

            JSONObject status = getWaitingRoomStatus(playroom);
            for (String sessionId : playroom.getPlayersWaitingRoom().keySet()) {
                sendMessageJSON(webSocketSessions.get(sessionId), status);
            }
        }
    }

    @Override
    public void finishWaitingRoom(String sessionId, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && playroom.getGame() != null && sessionId.equals(playroom.getHostId().toString())) {
            playroom.setWaitingRoomClosed(true);
            Map<String, Playroom.Player> waitingRoomPlayers = playroom.getPlayersWaitingRoom();
            Map<Integer, Playroom.Player> players = new HashMap<>();

            int k = 1;
            for (Playroom.Player player: waitingRoomPlayers.values()) {
                players.put(k, player);
                k++;

                if (player.getUuid() != null) {
                    playroomEventRepository.createExperience(player.getUuid().toString(), playroom.getGame().getId());
                }
            }
            playroom.setPlayers(players);
            this.playroomService.update(playroom);

            sendMessagesWithUpdate(players, playroom.getUuid().toString());
        }
    }

    @Override
    public void closeWaitingRoom(String sessionId, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && sessionId.equals(playroom.getHostId().toString())) {
            playroom.setWaitingRoomClosed(true);

            this.playroomService.update(playroom);

            JSONObject status = getWaitingRoomStatus(playroom);

            for (String session : playroom.getPlayersWaitingRoom().keySet()) {
                sendMessageJSON(webSocketSessions.get(session), status);
            }
        }
    }

    @Override
    public void joinPlayroom(WebSocketSession webSocketSession, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && playroom.isWaitingRoomClosed()) {
            // TODO reconnect playroom (only registered users) - unique user ID
        }
    }

    @Override
    public void quitPlayroom(String sessionId, JSONObject message) {
        Playroom playroom;
        if (message == null) {
            playroom = getPlayroomByPlayerSession(sessionId);
        }
        else {
            playroom = this.getPlayroom(getStringValue("playroomId", message));
        }

        if (playroom != null) {
            if (sessionId.equals(playroom.getHostId().toString())) {
                endGame(sessionId, message);
                return;
            }

            if (playroom.isWaitingRoomClosed()) {
                Map<Integer, Playroom.Player> players = playroom.getPlayers();
                List<Integer> playerNumbers = players.keySet().stream().sorted().toList();

                int k = 1;
                int playersSize = players.size();
                for (int i = 0; i < playersSize; i++) {
                    Playroom.Player player = players.get(playerNumbers.get(i));
                    if (player.getWebSocketSessionId().equals(sessionId)) {
                        if (playroom.getCurrentPlayer() > k) {
                            playroom.setCurrentPlayer(playroom.getCurrentPlayer() - 1);
                        }
                        players.remove(playerNumbers.get(i));
                    } else {
                        players.put(k, player);
                    }
                    k++;
                }
                playroom.setPlayers(players);

                if (!players.isEmpty()) {
                    playroom.setCurrentPlayer((playroom.getCurrentPlayer() % players.size()) + 1);
                }
            }
            else {
                Map<String, Playroom.Player> playersWaitingRoom = playroom.getPlayersWaitingRoom();
                playersWaitingRoom.remove(sessionId);
                playroom.setPlayersWaitingRoom(playersWaitingRoom);
            }

            playroomService.update(playroom);
            if (!playroom.isWaitingRoomClosed()) {
                for (String session: playroom.getPlayersWaitingRoom().keySet()) {
                    sendMessageJSON(webSocketSessions.get(session), getWaitingRoomStatus(playroom));
                }
            }
            else {
                sendMessagesWithUpdate(playroom.getPlayers(), playroom.getUuid().toString());
            }
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
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && isPlayerInPlayroom(sessionId, playroom) &&
                playroom.getPlayers().get(playroom.getCurrentPlayer()).getWebSocketSessionId().equals(sessionId)) {
            updateLastModDate(playroom);
            do {
                playroom.setCurrentPlayer((playroom.getCurrentPlayer() % playroom.getPlayers().size()) + 1);
            } while (playroom.getPlayers().get(playroom.getCurrentPlayer()).isSkip());

            updateLastModDate(playroom);
            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
        }
    }

    @Override
    public void pause(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && isPlayerInPlayroom(sessionId, playroom)) {
            updateLastModDate(playroom);
            playroom.setPaused(true);

            updateLastModDate(playroom);
            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
        }
    }

    @Override
    public void start(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && isPlayerInPlayroom(sessionId, playroom)) {
            updateLastModDate(playroom);
            playroom.setPaused(false);

            updateLastModDate(playroom);
            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
        }
    }

    @Override
    public void win(String sessionId, JSONObject message) {
        // TODO implement ending game as winner
    }

    @Override
    public void endGame(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && isPlayerInPlayroom(sessionId, playroom)) {
            endGameRequest(playroom);
        }
    }

    @Override
    public void status(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null) {
            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
            updateLastModDate(playroom);
        }
    }

    private void endGameRequest(Playroom playroom) {
        playroom.setEnded(true);
        updateLastModDate(playroom);
        sendMessagesWithUpdate(playroom.getPlayers(), playroom.getUuid().toString());

        for (Playroom.Player player : playroom.getPlayers().values()) {
            quitPlayroom(player.getWebSocketSessionId(), new JSONObject()
                    .put("operation", "quitPlayroom")
                    .put("playroomId", playroom.getUuid().toString()));
        }
        playroomService.delete(UUID.fromString(playroom.getUuid().toString()));
    }

    private Playroom getPlayroom(String playroomId) {
        if (playroomId == null) {
            return null;
        }
        return playroomService.find(UUID.fromString(playroomId)).orElse(null);
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
            for (Playroom.Player player : playroom.getPlayersWaitingRoom().values()) {
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
                if (playroom.getGlobalTimerValue() <= 0.0) {
                    playroomService.update(playroom);
                    endGameRequest(playroom);
                    return;
                }
            }
            else {
                Map<Integer, Playroom.Player> players = playroom.getPlayers();
                Playroom.Player player = players.get(playroom.getCurrentPlayer());
                player.setTimer(player.getTimer() +
                        (Duration.between(LocalTime.now(), playroom.getLastOperationTime()).toMillis() / 1000.0));
                if (player.getTimer() <= 0.0) {
                    player.setSkip(true);
                }
                players.put(playroom.getCurrentPlayer(), player);
                playroom.setPlayers(players);
            }
        }
        playroom.setLastOperationTime(LocalTime.now());
        playroomService.update(playroom);
    }

    /**
     * Get information about waiting room with specific ID
     * @param playroom - playroom
     * @return JSON Object represents waiting room
     * {
     *     "type": "waitingRoom",
     *     "playroomId": --playroomId--,
     *     "isClosed": --true/false--,
     *     "hostId": --userID--,
     *     "players": [
     *          {
     *              "playerId": --playerId--,
     *              "username": --username--,
     *              "userId": --userID-- (null if guests)
     *          },
     *          {
     *              "playerId": --playerId--,
     *              "username": --username--,
     *              "userId": --userID-- (null if guests)
     *          },
     *          ...
     *     ]
     * }
     */
    private JSONObject getWaitingRoomStatus(Playroom playroom) {
        JSONObject status = new JSONObject();
        status.put("type", "waitingRoom");
        status.put("playroomId", playroom.getUuid());
        status.put("isClosed", playroom.isWaitingRoomClosed());
        if (playroom.getPlayersWaitingRoom().containsKey(playroom.getHostId().toString())) {
            status.put("hostId", playroom.getPlayersWaitingRoom().get(playroom.getHostId().toString()).getPlayerId());
        }
        else {
            status.put("hostID", "null");
        }
        JSONArray players = new JSONArray();
        for (Playroom.Player player: playroom.getPlayersWaitingRoom().values()) {
            JSONObject player1 = new JSONObject();
            player1.put("playerId", player.getPlayerId());
            player1.put("username", player.getUsername());
            player1.put("userId", player.getUuid());
            players.put(player1);
        }
        status.put("players", players);

        return status;
    }

    /**
     * Get general information about playroom
     * @param playroom - playroom
     * @param requiredAction - information why message is sent
     * @return JSON Object represents playroom
     * {
     *      "type": "requiredAction",
     *      "requiredAction": --requiredAction--,
     *      "playroomId": --playroomId--,
     *      "timer": {
     *          "type": --global/local--,
     *          "time": --time-- (in seconds)
     *      },
     *      "game": {
     *          "gameId": --gameId--,
     *          "name": --game name--
     *      }
     * }
     */
    private JSONObject getGeneralPlayroomData(Playroom playroom, String requiredAction) {
        JSONObject status = new JSONObject();
        status.put("type", "requiredAction");
        status.put("requiredAction", requiredAction);
        status.put("playroomId", playroom.getUuid());

        JSONObject timer = new JSONObject();
        if (playroom.isGlobalTimer()) {
            timer.put("type", "global");
        }
        else {
            timer.put("type", "local");
        }
        timer.put("time", playroom.getGlobalTimerValue());
        status.put("timer", timer);

        JSONObject game = new JSONObject();
        game.put("gameId", playroom.getGame().getId());
        game.put("name", playroom.getGame().getName());
        status.put("game", game);

        return status;
    }

    /**
     * Get information about playroom with specific ID
     * @param uuid - playroom ID
     * @return JSON Object represents playroom (empty object if not exists)
     * {
     *     "type": "playroom",
     *     "timer": --timer-- (null if timer is local),
     *     "paused": --true/false--,
     *     "currentPlayer": --playerNumber--,
     *     "hostId": --hostId--,
     *     "ended": --true/false--,
     *     "game": {
     *         "gameID": --gameID--,
     *         "name": --gameName--
     *     },
     *     "players": [
     *         {
     *             "queueNumber": 1,
     *             "playerId": --playerId--,
     *             "name": --playerName--,
     *             "timer": --playerTimer-- (null if timer is global),
     *             "skipped": --true/false--
     *         },
     *         {
     *             "queueNumber": 2,
     *             "playerId": --playerId--,
     *             "name": --playerName--,
     *             "timer": --playerTimer-- (null if timer is global),
     *             "skipped": --true/false--
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
            gameStatus.put("type", "playroom");
            gameStatus.put("paused", playroom.isPaused());
            gameStatus.put("ended", playroom.isEnded());
            gameStatus.put("currentPlayer", playroom.getCurrentPlayer());

            if (playroom.getPlayersWaitingRoom().containsKey(playroom.getHostId().toString())) {
                gameStatus.put("hostId", playroom.getPlayersWaitingRoom().get(playroom.getHostId().toString()).getPlayerId());
            }
            else {
                gameStatus.put("hostID", "null");
            }

            JSONObject game = new JSONObject();
            game.put("gameID", playroom.getGame().getId());
            game.put("name", playroom.getGame().getName());
            gameStatus.put("game", game);

            JSONArray players = new JSONArray();
            for (int playerNumber: playroom.getPlayers().keySet()) {
                JSONObject player = new JSONObject();
                player.put("queueNumber", playerNumber);
                player.put("playerId", playroom.getPlayers().get(playerNumber).getPlayerId());
                player.put("name", playroom.getPlayers().get(playerNumber).getUsername());
                if (!playroom.isGlobalTimer()) {
                    player.put("timer", playroom.getPlayers().get(playerNumber).getTimer());
                }
                else {
                    player.put("timer", JSONObject.NULL);
                }
                player.put("skipped", playroom.getPlayers().get(playerNumber).isSkip());
                players.put(player);
            }
            gameStatus.put("players", players);
        }

        return gameStatus;
    }

}
