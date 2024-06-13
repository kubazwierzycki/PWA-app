package pl.edu.pg.eti.playrooms.websockets;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * WebSocket Handler for playroom functionality
 */
public class WebSocketConnectionHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> webSocketSessions;

    public WebSocketConnectionHandler() {
        webSocketSessions = Collections.synchronizedList(new ArrayList<>());
    }

    @Override
    public void
    afterConnectionEstablished(WebSocketSession session) {
        try {
            super.afterConnectionEstablished(session);
        } catch (Exception e) {
            System.err.println("Error after WebSocket connection established: " + session.getId());
            return;
        }

        webSocketSessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        try {
            super.afterConnectionClosed(session, status);
        } catch (Exception e) {
            System.err.println("Error after WebSocket connection closed: " + session.getId() + " status: " + status);
            return;
        }

        webSocketSessions.remove(session);
    }

    public WebSocketSession getSessionById(String id) {
        for (WebSocketSession webSocketSession : webSocketSessions) {
            if (id.equals(webSocketSession.getId())) {
                return webSocketSession;
            }
        }
        return null;
    }

}
