package pl.edu.pg.eti.playrooms.controller.impl;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pl.edu.pg.eti.playrooms.controller.api.PlayroomController;
import pl.edu.pg.eti.playrooms.dto.GetGames;
import pl.edu.pg.eti.playrooms.dto.GetPlayrooms;
import pl.edu.pg.eti.playrooms.dto.Operation;
import pl.edu.pg.eti.playrooms.dto.PlayroomInfo;
import pl.edu.pg.eti.playrooms.dto.PutPlayroom;
import pl.edu.pg.eti.playrooms.dto.PutPlayroomQueue;
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

import static pl.edu.pg.eti.playrooms.websockets.WebSocketConnectionHandler.END_GAME;
import static pl.edu.pg.eti.playrooms.websockets.WebSocketConnectionHandler.WIN;

@Controller
public class PlayroomDefaultController implements PlayroomController {

    private final PlayroomService playroomService;
    private final Map<String, WebSocketSession> webSocketSessions;
    private final PlayroomEventRepository playroomEventRepository;
    private final Map<UUID, Operation> operationsToConfirm;

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

        if (playroom != null && playroom.getPlayers().isEmpty()) {
            if ("0".equals(request.getGameId())) {
                request.setGameId("custom_" + UUID.randomUUID());
                for (GetGames.Game game : playroomEventRepository.getAllGames().getGames()) {
                    if (game.getName().equals(request.getGame())) {
                        request.setGameId(game.getId());
                        break;
                    }
                }
            }

            playroom.setGlobalTimer(request.getIsGlobalTimer());
            playroom.setGame(new Playroom.Game(request.getGameId(), request.getGame()));
            playroom.setGlobalTimerValue(request.getTimer());

            playroom.setLastOperationTime(LocalTime.now());
            playroomService.update(playroom);

            playroomEventRepository.updateGame(request.getGameId(), request.getGame(),
                    !request.getIsGlobalTimer(), request.getTimer().intValue());
        }
        else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    @Override
    public GetPlayrooms getPlayrooms() {
        List<Playroom> playrooms = playroomService.findAll();
        return GetPlayrooms.builder()
                .playrooms(playrooms.stream()
                        .map(playroom -> GetPlayrooms.Playroom.builder()
                                .id(playroom.getUuid().toString())
                                .game(playroom.getGame() != null ? playroom.getGame().getName() : null)
                                .numOfPlayers(playroom.getPlayers().size())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public void updatePlayroomQueue(String playroomId, PutPlayroomQueue request) {
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && !playroom.getPlayers().isEmpty()) {
            updateLastModDate(playroom);
            PutPlayroomQueue oldPlayersQueue =
                    PutPlayroomQueue.builder()
                            .players(playroom.getPlayers().values().stream()
                                    .map(player -> PutPlayroomQueue.Player.builder()
                                            .playerId(player.getPlayerId())
                                            .build())
                                    .toList())
                            .build();

            if (oldPlayersQueue.getPlayers().size() != request.getPlayers().size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
            }
            for (PutPlayroomQueue.Player player : request.getPlayers()) {
                if (!isPlayerInPlayroomQueue(oldPlayersQueue.getPlayers(), player)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
                }
            }

            Map<Integer, Playroom.Player> newPlayersMap = new HashMap<>();
            for (PutPlayroomQueue.Player player : request.getPlayers()) {
                for (int playerNumber : playroom.getPlayers().keySet()) {
                    if (playroom.getPlayers().get(playerNumber).getPlayerId().equals(player.getPlayerId())) {
                        newPlayersMap.put(newPlayersMap.size() + 1, playroom.getPlayers().get(playerNumber));
                        break;
                    }
                }
            }

            playroom.setPlayers(newPlayersMap);
            playroomService.update(playroom);
            playroom.setCurrentPlayer(1);
            updateLastModDate(playroom);

            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public void joinWaitingRoom(WebSocketSession webSocketSession, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && !playroom.isWaitingRoomClosed() && !playroom.isEnded()) {
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
                    UUID.randomUUID(), uuid,
                    message.getJSONObject("player").getString("username"),
                    message.getJSONObject("player").getInt("age"),
                    null, false, 0, guest, webSocketSession.getId());

            Map<String, Playroom.Player> updatedPlayers = playroom.getPlayersWaitingRoom();
            if (!guest && playroom.getPlayersWaitingRoom().isEmpty()) {
                playroom.setHostId(UUID.fromString(webSocketSession.getId()));
            }
            updatedPlayers.put(webSocketSession.getId(), newPlayer);
            playroom.setPlayersWaitingRoom(updatedPlayers);
            playroomService.update(playroom);
            webSocketSessions.put(newPlayer.getWebSocketSessionId(), webSocketSession);

            JSONObject welcomeInfo = welcomeInfo(newPlayer);
            sendMessageJSON(webSocketSession, welcomeInfo);

            JSONObject status = getWaitingRoomStatus(playroom);
            for (String sessionId : playroom.getPlayersWaitingRoom().keySet()) {
                sendMessageJSON(webSocketSessions.get(sessionId), status);
            }
        }
    }

    @Override
    public void finishWaitingRoom(String sessionId, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && playroom.getGame() != null &&
                UUID.fromString(sessionId).equals(playroom.getHostId())) {
            playroom.setWaitingRoomClosed(true);
            Map<String, Playroom.Player> waitingRoomPlayers = playroom.getPlayersWaitingRoom();
            Map<Integer, Playroom.Player> players = new HashMap<>();

            int k = 1;
            for (Playroom.Player player: waitingRoomPlayers.values()) {
                if (!playroom.isGlobalTimer()) {
                    player.setTimer(playroom.getGlobalTimerValue());
                }
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
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage());
        }
    }

    @Override
    public void closeWaitingRoom(String sessionId, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && sessionId.equals(playroom.getHostId().toString()) && !playroom.isWaitingRoomClosed()) {
            playroom.setWaitingRoomClosed(true);

            this.playroomService.update(playroom);

            JSONObject status = getWaitingRoomStatus(playroom);

            for (String session : playroom.getPlayersWaitingRoom().keySet()) {
                sendMessageJSON(webSocketSessions.get(session), status);
            }
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage());
        }
    }

    @Override
    public void joinPlayroom(WebSocketSession webSocketSession, JSONObject message) {
        Playroom playroom = this.getPlayroom(getStringValue("playroomId", message));

        if (playroom != null && playroom.isWaitingRoomClosed() && !playroom.isEnded()) {
            String userId = getStringValue("id", message.getJSONObject("player"));
            for (Playroom.Player player: playroom.getPlayersWaitingRoom().values()) {
                if (player.getUuid().toString().equals(userId) &&
                        !isPlayerInPlayroomByUuid(player.getUuid(), playroom)) {
                    Map<Integer, Playroom.Player> newPlayersMap = playroom.getPlayers();
                    if (!playroom.isGlobalTimer()) {
                        player.setTimer(playroom.getGlobalTimerValue());
                        // TODO create algorithm to assign player's timer fair enough
                    }
                    newPlayersMap.put(newPlayersMap.size() + 1, player);
                }
            }
        }
        else {
            sendMessageJSON(webSocketSession, errorMessage());
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
            if (!playroom.isEnded() && sessionId.equals(playroom.getHostId().toString())) {
                if (playroom.getPlayers().isEmpty()) {
                    Map<String, Playroom.Player> waitingRoomPlayers = playroom.getPlayersWaitingRoom();
                    waitingRoomPlayers.remove(sessionId);

                    playroom.setPlayersWaitingRoom(waitingRoomPlayers);
                    for (String session : playroom.getPlayersWaitingRoom().keySet()) {
                        sendMessageJSON(webSocketSessions.get(session),
                                getNotificationMessage("The game is ended. The host left the game."));
                        sendMessageJSON(webSocketSessions.get(session), getWaitingRoomStatus(playroom));
                    }
                } else {
                    Map<Integer, Playroom.Player> players = playroom.getPlayers();
                    for (int i : players.keySet()) {
                        if (players.get(i).getWebSocketSessionId().equals(playroom.getHostId().toString())) {
                            players.remove(i);
                        } else {
                            sendMessageJSON(webSocketSessions.get(players.get(i).getWebSocketSessionId()),
                                    getNotificationMessage("The game is ended. The host left the game."));
                        }
                    }
                    playroom.setPlayers(players);
                }
                endGameRequest(playroom);
                return;
            }

            if (playroom.isWaitingRoomClosed()) {
                Map<Integer, Playroom.Player> players = playroom.getPlayers();
                Map<Integer, Playroom.Player> newPlayers = new HashMap<>();
                List<Integer> playerNumbers = players.keySet().stream().sorted().toList();

                int k = 1;
                int playersSize = players.size();
                for (int i = 0; i < playersSize; i++) {
                    Playroom.Player player = players.get(playerNumbers.get(i));
                    if (player.getWebSocketSessionId().equals(sessionId)) {
                        if (playroom.getCurrentPlayer() > k) {
                            playroom.setCurrentPlayer(playroom.getCurrentPlayer() - 1);
                        }
                    } else {
                        newPlayers.put(k, player);
                        k++;
                    }
                }
                playroom.setPlayers(newPlayers);

                if (playroom.getPlayers().isEmpty()) {
                    deletePlayroom(playroom);
                    return;
                }
                else {
                    playroom.setCurrentPlayer((playroom.getCurrentPlayer() % newPlayers.size()) + 1);
                }
            }
            else {
                Map<String, Playroom.Player> playersWaitingRoom = playroom.getPlayersWaitingRoom();
                playersWaitingRoom.remove(sessionId);
                playroom.setPlayersWaitingRoom(playersWaitingRoom);

                if (playroom.getPlayersWaitingRoom().isEmpty()) {
                    deletePlayroom(playroom);
                    return;
                }
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

        if (playroom != null && !playroom.isEnded()) {
            updateLastModDate(playroom);
            endTurnRequest(sessionId, playroom);
            updateLastModDate(playroom);
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage());
        }
    }

    @Override
    public void pause(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && !playroom.isPaused() && !playroom.isEnded() &&
                isPlayerInPlayroomBySession(sessionId, playroom)) {
            updateLastModDate(playroom);
            playroom.setPaused(true);

            updateLastModDate(playroom);
            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage());
        }
    }

    @Override
    public void start(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && playroom.isPaused() && !playroom.isEnded() &&
                isPlayerInPlayroomBySession(sessionId, playroom)) {
            updateLastModDate(playroom);
            playroom.setPaused(false);

            updateLastModDate(playroom);
            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage());
        }
    }

    @Override
    public void win(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && !playroom.isEnded() && isPlayerInPlayroomBySession(sessionId, playroom)) {
            UUID operationId = UUID.randomUUID();
            operationsToConfirm.put(operationId,
                    Operation.builder()
                            .type(WIN)
                            .player(getPlayerBySession(playroom, sessionId))
                            .build()
            );

            askForConfirmation(sessionId,
                    "Please confirm if player: " +
                            getPlayerBySession(playroom, sessionId).getUsername() +
                            " won the game.",
                    playroom, operationId);
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage());
        }
    }

    @Override
    public void endGame(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && !playroom.isEnded() && isPlayerInPlayroomBySession(sessionId, playroom)) {
            if (playroom.getPlayers().size() <= 1) {
                endGameRequest(playroom);
                return;
            }

            UUID operationId = UUID.randomUUID();
            operationsToConfirm.put(operationId,
                    Operation.builder()
                            .type(END_GAME)
                            .player(null).build()
            );

            askForConfirmation(sessionId, "Please confirm if the game is ended.", playroom, operationId);
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage());
        }
    }

    @Override
    public void status(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null) {
            updateLastModDate(playroom);
            sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
            updateLastModDate(playroom);
        }
    }

    @Override
    public void confirm(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);
        String operationId = getStringValue("operationId", message);

        if (playroom != null && !playroom.isEnded() && operationId != null &&
                operationsToConfirm.containsKey(UUID.fromString(operationId)) &&
                isPlayerInPlayroomBySession(sessionId, playroom)) {

            Operation operation = operationsToConfirm.get(UUID.fromString(operationId));
            String function = operation.getType();
            operationsToConfirm.remove(UUID.fromString(operationId));

            switch (function) {
                case END_GAME:
                    endGameRequest(playroom);
                    break;
                case WIN:
                    winGameRequest(playroom, operation.getPlayer());
                    break;
            }
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage("operation does not exist"));
        }
    }

    @Override
    public void reject(String sessionId, JSONObject message) {
        String operationId = getStringValue("operationId", message);

        if (operationId != null) {
            operationsToConfirm.remove(UUID.fromString(operationId));
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage("operation does not exist"));
        }
    }

    @Override
    public void skip(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Integer turnsToSkip;
        Playroom playroom = this.getPlayroom(playroomId);

        turnsToSkip = Integer.valueOf(getStringValue("turnsToSkip", message));

        if (playroom != null && !playroom.isEnded() && isPlayerInPlayroomBySession(sessionId, playroom)) {
            Map<Integer, Playroom.Player> newPlayersMap = playroom.getPlayers();
            for (int index : newPlayersMap.keySet()) {
                if (newPlayersMap.get(index).getWebSocketSessionId().equals(sessionId)) {
                    Playroom.Player updatedPlayer = newPlayersMap.get(index);
                    updatedPlayer.setSkip(true);
                    updatedPlayer.setTurnsToSkip(turnsToSkip != null ? turnsToSkip : 1);
                    newPlayersMap.put(index, updatedPlayer);
                    playroom.setPlayers(newPlayersMap);
                    updateLastModDate(playroom);
                    playroomService.update(playroom);
                    sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
                    break;
                }
            }
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage("operation does not exist"));
        }
    }

    @Override
    public void cancelSkip(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        Playroom playroom = this.getPlayroom(playroomId);

        if (playroom != null && !playroom.isEnded() && isPlayerInPlayroomBySession(sessionId, playroom)) {
            Map<Integer, Playroom.Player> newPlayersMap = playroom.getPlayers();
            for (int index : newPlayersMap.keySet()) {
                if (newPlayersMap.get(index).getWebSocketSessionId().equals(sessionId)) {
                    Playroom.Player updatedPlayer = newPlayersMap.get(index);
                    updatedPlayer.setSkip(false);
                    updatedPlayer.setTurnsToSkip(0);
                    newPlayersMap.put(index, updatedPlayer);
                    playroom.setPlayers(newPlayersMap);
                    updateLastModDate(playroom);
                    playroomService.update(playroom);
                    sendMessagesWithUpdate(playroom.getPlayers(), playroomId);
                    break;
                }
            }
        }
        else {
            sendMessageJSON(webSocketSessions.get(sessionId), errorMessage("operation does not exist"));
        }
    }

    private Playroom.Player getPlayerBySession(Playroom playroom, String sessionId) {
        if (playroom != null && sessionId != null) {
            for (Playroom.Player player : playroom.getPlayers().values()) {
                if (sessionId.equals(player.getWebSocketSessionId())) {
                    return player;
                }
            }
        }
        return null;
    }

    private void winGameRequest(Playroom playroom, Playroom.Player player) {
        if (playroom != null && player != null) {
            if (!player.isGuest()) {
                playroomEventRepository.putExperience(player.getUuid().toString(), playroom.getGame().getId(), true);
            }
            for (Playroom.Player user : playroom.getPlayers().values()) {
                sendMessageJSON(webSocketSessions.get(user.getWebSocketSessionId()),
                        getNotificationMessage("Player: " + player.getUsername() + " has won the game!"));
            }
            endGameRequest(playroom, player.getUsername());
        }
    }

    private void endGameRequest(Playroom playroom) {
        endGameRequest(playroom, null);
    }

    private void endGameRequest(Playroom playroom, String winner) {
        playroom.setEnded(true);
        playroom.setPaused(true);
        playroomService.update(playroom);
        sendMessagesWithUpdate(playroom.getPlayers(), playroom.getUuid().toString());

        playroomEventRepository.putGameplay(playroom, winner);
    }

    private void deletePlayroom(Playroom playroom) {
        for (Playroom.Player player : playroom.getPlayers().values()) {
            quitPlayroom(player.getWebSocketSessionId(), new JSONObject()
                    .put("operation", "quitPlayroom")
                    .put("playroomId", playroom.getUuid().toString()));
        }
        playroomService.delete(UUID.fromString(playroom.getUuid().toString()));
    }

    private void endTurnRequest(String sessionId, Playroom playroom) {
        if (playroom != null && isPlayerInPlayroomBySession(sessionId, playroom) &&
                playroom.getPlayers().get(playroom.getCurrentPlayer()).getWebSocketSessionId().equals(sessionId)) {
            int k = 0;
            do {
                playroom.setCurrentPlayer((playroom.getCurrentPlayer() % playroom.getPlayers().size()) + 1);
                Playroom.Player currentPlayer = playroom.getPlayers().get(playroom.getCurrentPlayer());
                if (currentPlayer.isSkip() && (currentPlayer.getTimer() == null || currentPlayer.getTimer() > 0)) {
                    currentPlayer.setTurnsToSkip(currentPlayer.getTurnsToSkip() - 1);
                    if (currentPlayer.getTurnsToSkip() <= 0) {
                        currentPlayer.setSkip(false);
                    }
                    Map<Integer, Playroom.Player> players = playroom.getPlayers();
                    players.put(playroom.getCurrentPlayer(), currentPlayer);
                    playroom.setPlayers(players);
                    playroom.setCurrentPlayer((playroom.getCurrentPlayer() % playroom.getPlayers().size()) + 1);
                }
                k++;
            } while (k < playroom.getPlayers().size() &&
                    playroom.getPlayers().get(playroom.getCurrentPlayer()).isSkip());

            playroomService.update(playroom);

            sendMessagesWithUpdate(playroom.getPlayers(), playroom.getUuid().toString());
        }
    }

    private Playroom getPlayroom(String playroomId) {
        if (playroomId == null) {
            return null;
        }
        return playroomService.find(UUID.fromString(playroomId)).orElse(null);
    }

    private boolean isPlayerInPlayroomBySession(String sessionId, Playroom playroom) {
        for (Playroom.Player player: playroom.getPlayers().values()) {
            if (player.getWebSocketSessionId().equals(sessionId)) {
                return true;
            }
        }
        return false;
    }

    private boolean isPlayerInPlayroomByUuid(UUID uuid, Playroom playroom) {
        for (Playroom.Player player: playroom.getPlayers().values()) {
            if (player.getUuid().equals(uuid)) {
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

    private boolean isPlayerInPlayroomQueue(List <PutPlayroomQueue.Player> oldQueue,
                                            PutPlayroomQueue.Player player) {
        for (PutPlayroomQueue.Player oldPlayer : oldQueue) {
            if (player.getPlayerId().equals(oldPlayer.getPlayerId())) {
                return true;
            }
        }
        return false;
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
            if (webSocketSession != null && webSocketSession.isOpen()) {
                webSocketSession.sendMessage(new TextMessage(message.toString()));
            }
        }
        catch (IOException ex) {
            System.err.println("Cannot send message: " + message + "\nWebSocketSession: " + webSocketSession.getId());
        }
    }

    private void updateLastModDate(Playroom playroom) {
        if (!playroom.isPaused() && !playroom.getPlayers().isEmpty()) {
            LocalTime lastOperationTime = playroom.getLastOperationTime();
            LocalTime nowTime = LocalTime.now();

            if (playroom.isGlobalTimer()) {
                Double timeDiff = Duration.between(nowTime, lastOperationTime).toMillis() / 1000.0;
                if (nowTime.isBefore(lastOperationTime)) {
                    timeDiff = Duration.between(LocalTime.MAX, lastOperationTime).toMillis() / 1000.0;
                    timeDiff += Duration.between(nowTime, LocalTime.MIN).toMillis() / 1000.0;
                }
                playroom.setGlobalTimerValue(playroom.getGlobalTimerValue() + timeDiff);
                if (playroom.getGlobalTimerValue() <= 0.0) {
                    playroomService.update(playroom);
                    endGameRequest(playroom);
                    return;
                }
            }
            else {
                Map<Integer, Playroom.Player> players = playroom.getPlayers();
                Playroom.Player player = players.get(playroom.getCurrentPlayer());
                Double timeDiff = Duration.between(nowTime, lastOperationTime).toMillis() / 1000.0;
                if (nowTime.isBefore(lastOperationTime)) {
                    timeDiff = Duration.between(LocalTime.MAX, lastOperationTime).toMillis() / 1000.0;
                    timeDiff += Duration.between(nowTime, LocalTime.MIN).toMillis() / 1000.0;
                }
                player.setTimer(player.getTimer() + timeDiff);
                if (player.getTimer() <= 0.0 && !playroom.isEnded()) {
                    player.setSkip(true);
                    players.put(playroom.getCurrentPlayer(), player);
                    endTurnRequest(player.getWebSocketSessionId(), playroom);
                }
                else {
                    players.put(playroom.getCurrentPlayer(), player);
                }
                playroom.setPlayers(players);
                if (!isActivePlayer(playroom) && !playroom.isEnded()) {
                    playroomService.update(playroom);
                    endGameRequest(playroom);
                }
            }
        }
        playroom.setLastOperationTime(LocalTime.now());
        playroomService.update(playroom);
    }

    private boolean isActivePlayer(Playroom playroom) {
        for (Playroom.Player player: playroom.getPlayers().values()) {
            if (!player.isSkip()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get error message if operation cannot be dane
     * @return JSONObject with error
     */
    private JSONObject errorMessage() {
        return errorMessage(null);
    }

    /**
     * Get notification message
     * @param details - notification details
     * @return JSONObject with notification
     */
    private JSONObject getNotificationMessage(String details) {
        JSONObject message = new JSONObject();
        message.put("type", "notification");
        message.put("notification", details);

        return message;
    }

    /**
     * Get error message if operation cannot be dane
     * @param details - error details
     * @return JSONObject with error
     */
    private JSONObject errorMessage(String details) {
        JSONObject message = new JSONObject();
        message.put("type", "error");
        if (details != null) {
            message.put("error", "Invalid operation - " + details);
        }
        else {
            message.put("error", "Invalid operation");
        }

        return message;
    }

    /**
     * Get welcome info for new player
     * @param player - new joined player
     * @return JSONObject with welcome message
     * {
     *     "type": "welcomeInfo",
     *     "playerId": --playerId--
     * }
     */
    private JSONObject welcomeInfo(Playroom.Player player) {
        JSONObject message = new JSONObject();
        message.put("type", "welcomeInfo");
        message.put("playerId", player.getPlayerId().toString());

        return message;
    }

    /**
     *
     * @param sessionId - websocket session ID
     * @param question - question to display
     * @param playroom - playroom
     * @param operationId - operation UUID
     *
     * @implNote - message to send:
     * {
     *      "type": "confirmOperation",
     *      "operationId": --operationUUID--,
     *      "question": --question--
     * }
     */
    private void askForConfirmation(String sessionId, String question, Playroom playroom, UUID operationId) {
        for (Playroom.Player player: playroom.getPlayers().values()) {
            if (!player.getWebSocketSessionId().equals(sessionId)) {
                JSONObject message = new JSONObject();
                message.put("type", "confirmOperation");
                message.put("operationId", operationId.toString());
                message.put("question", question);

                sendMessageJSON(webSocketSessions.get(player.getWebSocketSessionId()), message);
            }
        }
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
     *              "age": --age--,
     *              "userId": --userID-- (null if guests)
     *          },
     *          {
     *              "playerId": --playerId--,
     *              "username": --username--,
     *              "age": --age--,
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
            player1.put("age", player.getAge());
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
     *             "skipped": --true/false--,
     *             "turnsToSkip": --numberOfTurnsToSkip--
     *         },
     *         {
     *             "queueNumber": 2,
     *             "playerId": --playerId--,
     *             "name": --playerName--,
     *             "timer": --playerTimer-- (null if timer is global),
     *             "skipped": --true/false--,
     *             "turnsToSkip": --numberOfTurnsToSkip--
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
            game.put("gameID", playroom.getGame() != null ? playroom.getGame().getId() : null);
            game.put("name", playroom.getGame() != null ? playroom.getGame().getName() : null);
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
                player.put("turnsToSkip", playroom.getPlayers().get(playerNumber).getTurnsToSkip());
                players.put(player);
            }
            gameStatus.put("players", players);
        }

        return gameStatus;
    }

}
