package pl.edu.pg.eti.playrooms.controller.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pl.edu.pg.eti.playrooms.controller.api.PlayroomController;
import pl.edu.pg.eti.playrooms.dto.PlayroomInfo;
import pl.edu.pg.eti.playrooms.dto.PostPlayroom;
import pl.edu.pg.eti.playrooms.entity.Playroom;
import pl.edu.pg.eti.playrooms.service.api.PlayroomService;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
public class PlayroomDefaultController implements PlayroomController {

    private final PlayroomService playroomService;
    private final Map<String, WebSocketSession> webSocketSessions;

    @Autowired
    public PlayroomDefaultController(PlayroomService playroomService) {
        this.playroomService = playroomService;
        webSocketSessions = Collections.synchronizedMap(new HashMap<>());
    }

    @Override
    public ResponseEntity<PlayroomInfo> createNewPlayroom(PostPlayroom request) {
        return null;
    }

    @Override
    public void joinPlayroom(WebSocketSession webSocketSession, JSONObject message) {

    }

    @Override
    public void quitPlayroom(String sessionId, JSONObject message) {

    }

    @Override
    public void endTurn(String sessionId, JSONObject message) {

    }

    @Override
    public void pause(String sessionId, JSONObject message) {

    }

    @Override
    public void status(String sessionId, JSONObject message) {
        String playroomId = getStringValue("playroomId", message);
        if (playroomId != null) {
            Playroom playroom = playroomService.find(UUID.fromString(playroomId)).orElse(null);
            if (playroom != null) {
                for (int playerNumber: playroom.getPlayers().keySet()) {
                    WebSocketSession webSocketSession = webSocketSessions.get(
                            playroom.getPlayers().get(playerNumber).getWebSocketSessionId());
                    JSONObject gameStatus = getGameStatus(playroomId);
                    sendMessageJSON(webSocketSession, gameStatus);
                }
            }
        }
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

    private void sendMessageJSON(WebSocketSession webSocketSession, JSONObject message) {
        try {
            webSocketSession.sendMessage(new TextMessage(message.toString()));
        }
        catch (IOException ex) {
            System.err.println("Cannot send message: " + message + "\nWebSocketSession: " + webSocketSession.getId());
        }
    }

    /**
     * Get information about playroom with specific ID
     * @param uuid - playroom ID
     * @return JSON Object represents playroom (empty object if not exists)
     * {
     *     "timer": --timer-- (null if timer is local),
     *     "paused": --true/false--,
     *     "currentPlayer": --playerNumber--,
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
                gameStatus.put("timer", playroom.getGlobalTimer());
            }
            else {
                gameStatus.put("timer", JSONObject.NULL);
            }
            gameStatus.put("paused", playroom.isPaused());
            gameStatus.put("currentPlayer", playroom.getCurrentPlayer());

            JSONObject game = new JSONObject();
            game.put("gameID", playroom.getGame().getId());
            game.put("name", playroom.getGame().getName());
            gameStatus.put("game", game);

            JSONObject players = new JSONObject();
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
            }
            gameStatus.put("players", players);
        }

        return gameStatus;
    }

}
