package pl.edu.pg.eti.playrooms.controller.api;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.socket.WebSocketSession;
import pl.edu.pg.eti.playrooms.entity.Playroom;

/**
 * The controller used for the {@link Playroom} entity
 */
public interface PlayroomController {

    @PostMapping("/api/playrooms")
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    void createNewPlayroom();

    void joinPlayroom(WebSocketSession webSocketSession, JSONObject message);

    void quitPlayroom(String sessionId, JSONObject message);

    void endTurn(String sessionId, JSONObject message);

    void pause(String sessionId, JSONObject message);

}
