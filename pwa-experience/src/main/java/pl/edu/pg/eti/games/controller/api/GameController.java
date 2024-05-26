package pl.edu.pg.eti.games.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.games.dto.PutGame;
import pl.edu.pg.eti.games.entity.Game;

/**
 * The controller used for the {@link Game} entity
 */
public interface GameController {

    /**
     * PUT request to create or update game details
     * @param id - game ID
     * @param request - game details
     */
    @PutMapping("/api/games/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    void putGame(
            @PathVariable("id") String id,
            @RequestBody PutGame request
    );

    /**
     * DELETE request to delete game
     * @param id - game ID
     */
    @DeleteMapping("/api/games/{id}")
    void deleteGame(
            @PathVariable("id") String id
    );
}
