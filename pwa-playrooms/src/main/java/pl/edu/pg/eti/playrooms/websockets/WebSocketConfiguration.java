package pl.edu.pg.eti.playrooms.websockets;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocket Configuration for playroom functionality
 */
@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    private final WebSocketConnectionHandler webSocketConnectionHandler;

    public WebSocketConfiguration(WebSocketConnectionHandler webSocketConnectionHandler) {
        this.webSocketConnectionHandler = webSocketConnectionHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketConnectionHandler, "/ws-playrooms").setAllowedOrigins("*");
    }
}
