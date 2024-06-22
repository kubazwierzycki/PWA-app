package pl.edu.pg.eti.playrooms.websockets;

import org.springframework.lang.NonNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * WebSocket Handler for playroom functionality
 */
public class WebSocketConnectionHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> webSocketSessions;

    public WebSocketConnectionHandler() {
        webSocketSessions = Collections.synchronizedMap(new HashMap<>());
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

        webSocketSessions.put(session.getId(), session);
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
        System.out.println("Disconnected: " + sessionId);

        webSocketSessions.remove(sessionId);
    }

    @Override
    public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message)
    {
        try {
            super.handleMessage(session, message);
        } catch (Exception e) {
            System.err.println("Error handling websocket message: " + e.getMessage());
        }

        System.out.println(message.getPayload());
    }

    public WebSocketSession getWebSocketSession(String id) {
        return webSocketSessions.get(id);
    }

}
