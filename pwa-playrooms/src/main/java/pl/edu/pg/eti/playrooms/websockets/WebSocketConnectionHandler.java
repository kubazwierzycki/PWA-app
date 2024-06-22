package pl.edu.pg.eti.playrooms.websockets;

import org.springframework.lang.NonNull;
import org.springframework.web.socket.CloseStatus;
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

        webSocketSessions.remove(sessionId);
    }

}
