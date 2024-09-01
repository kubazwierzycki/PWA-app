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

    public static final String END_TURN = "endTurn";
    public static final String PAUSE = "pause";
    public static final String JOIN_PLAYROOM = "joinPlayroom";
    public static final String QUIT_PLAYROOM = "quitPlayroom";
    public static final String STATUS = "status";
    public static final String START = "start";
    public static final String WIN = "win";
    public static final String END_GAME = "endGame";
    public static final String JOIN_WAITING_ROOM = "joinWaitingRoom";
    public static final String FINISH_WAITING_ROOM = "finishWaitingRoom";
    public static final String CLOSE_WAITING_ROOM = "closeWaitingRoom";
    public static final String CONFIRM = "confirm";

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
            case END_TURN:
                playroomController.endTurn(session.getId(), messageJSON);
                break;
            case PAUSE:
                playroomController.pause(session.getId(), messageJSON);
                break;
            case JOIN_PLAYROOM:
                playroomController.joinPlayroom(session, messageJSON);
                break;
            case QUIT_PLAYROOM:
                playroomController.quitPlayroom(session.getId(), messageJSON);
                break;
            case STATUS:
                playroomController.status(session.getId(), messageJSON);
                break;
            case START:
                playroomController.start(session.getId(), messageJSON);
                break;
            case WIN:
                playroomController.win(session.getId(), messageJSON);
                break;
            case END_GAME:
                playroomController.endGame(session.getId(), messageJSON);
                break;
            case JOIN_WAITING_ROOM:
                playroomController.joinWaitingRoom(session, messageJSON);
                break;
            case FINISH_WAITING_ROOM:
                playroomController.finishWaitingRoom(session.getId(), messageJSON);
                break;
            case CLOSE_WAITING_ROOM:
                playroomController.closeWaitingRoom(session.getId(), messageJSON);
                break;
            case CONFIRM:
                playroomController.confirm(session.getId(), messageJSON);
                break;
            default:
                System.err.println("Unhandled type of message: \n" + message.getPayload());
        }
    }

}
