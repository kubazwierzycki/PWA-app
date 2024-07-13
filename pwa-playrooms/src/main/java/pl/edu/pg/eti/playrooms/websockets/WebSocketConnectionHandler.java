package pl.edu.pg.eti.playrooms.websockets;

import org.json.JSONObject;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pl.edu.pg.eti.playrooms.controller.api.PlayroomController;

/**
 * WebSocket Handler for playroom functionality
 */
@Component
public class WebSocketConnectionHandler extends TextWebSocketHandler {

    private final PlayroomController playroomController;

    public WebSocketConnectionHandler(PlayroomController playroomController) {
        this.playroomController = playroomController;
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) {
        try {
            super.afterConnectionEstablished(session);
        } catch (Exception e) {
            System.err.println("Error after WebSocket connection established: " + session.getId());
            return;
        }
        System.out.println("Connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        String sessionId = session.getId();
        try {
            super.afterConnectionClosed(session, status);
        } catch (Exception e) {
            System.err.println("Error after WebSocket connection closed: " + session.getId() + " status: " + status);
            return;
        }
        playroomController.quitPlayroom(session.getId(), null);
        System.out.println("Disconnected: " + sessionId);
    }

    @Override
    public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message)
    {
        try {
            super.handleMessage(session, message);
        } catch (Exception e) {
            System.err.println("Error handling websocket message: " + e.getMessage());
            return;
        }

        JSONObject messageJSON = new JSONObject(message.getPayload().toString());

        if ("endTurn".equals(messageJSON.get("operation"))) {
            playroomController.endTurn(session.getId(), messageJSON);
        }
        else if ("pause".equals(messageJSON.get("operation"))) {
            playroomController.pause(session.getId(), messageJSON);
        }
        else if ("joinPlayroom".equals(messageJSON.get("operation"))) {
            playroomController.joinPlayroom(session, messageJSON);
        }
        else if ("quitPlayroom".equals(messageJSON.get("operation"))) {
            playroomController.quitPlayroom(session.getId(), messageJSON);
        }
        else if ("status".equals(messageJSON.get("operation"))) {
            playroomController.status(session.getId(), messageJSON);
        }
        else if ("start".equals(messageJSON.get("operation"))) {
            playroomController.start(session.getId(), messageJSON);
        }
        else if ("win".equals(messageJSON.get("operation"))) {
            playroomController.win(session.getId(), messageJSON);
        }
        else if ("endGame".equals(messageJSON.get("operation"))) {
            playroomController.endGame(session.getId(), messageJSON);
        }
        else if ("joinWaitingRoom".equals(messageJSON.get("operation"))) {
            playroomController.joinWaitingRoom(session, messageJSON);
        }
        else if ("finishWaitingRoom".equals(messageJSON.get("operation"))) {
            playroomController.finishWaitingRoom(session.getId(), messageJSON);
        }
        else {
            System.err.println("Unhandled type of message: \n" + message.getPayload());
        }

    }

}
