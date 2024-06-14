package pl.edu.pg.eti.playrooms.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.playrooms.entity.Playroom;

/**
 * The controller used for the {@link Playroom} entity
 */
public interface PlayroomController {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    void createNewPlayroom();

}
