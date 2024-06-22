package pl.edu.pg.eti.playrooms.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.playrooms.entity.Playroom;

/**
 * The controller used for the {@link Playroom} entity
 */
public interface PlayroomController {

    @PostMapping("/api/playrooms")
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    void createNewPlayroom();

    @MessageMapping("/ws-playrooms")
    void handleWebSocketMessage(String message, SimpMessageHeaderAccessor headerAccessor);

}
