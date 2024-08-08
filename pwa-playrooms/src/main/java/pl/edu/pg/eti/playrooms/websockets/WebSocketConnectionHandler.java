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

        switch (messageJSON.get("operation").toString()) {
            case "endTurn":
                playroomController.endTurn(session.getId(), messageJSON);
                break;
            case "pause":
                playroomController.pause(session.getId(), messageJSON);
                break;
            case "joinPlayroom":
                playroomController.joinPlayroom(session, messageJSON);
                break;
            case "quitPlayroom":
                playroomController.quitPlayroom(session.getId(), messageJSON);
                break;
            case "status":
                playroomController.status(session.getId(), messageJSON);
                break;
            case "start":
                playroomController.start(session.getId(), messageJSON);
                break;
            case "win":
                playroomController.win(session.getId(), messageJSON);
                break;
            case "endGame":
                playroomController.endGame(session.getId(), messageJSON);
                break;
            case "joinWaitingRoom":
                playroomController.joinWaitingRoom(session, messageJSON);
                break;
            case "finishWaitingRoom":
                playroomController.finishWaitingRoom(session.getId(), messageJSON);
                break;
            case "closeWaitingRoom":
                playroomController.closeWaitingRoom(session.getId(), messageJSON);
                break;
            default:
                System.err.println("Unhandled type of message: \n" + message.getPayload());
        }
    }

}
