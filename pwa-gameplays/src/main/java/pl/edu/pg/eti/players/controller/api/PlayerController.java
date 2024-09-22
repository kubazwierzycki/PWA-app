package pl.edu.pg.eti.players.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.players.dto.PutPlayer;
import pl.edu.pg.eti.players.entity.Player;

import java.util.UUID;

/**
 * The controller used for the {@link Player} entity
 */
public interface PlayerController {

    /**
     * PUT request to change player details
     * @param uuid - player ID
     * @param request - player details {@link PutPlayer}
     */
    @PutMapping("/api/players/{uuid}")
    @ResponseStatus(HttpStatus.CREATED)
    void putPlayer(
            @PathVariable("uuid") UUID uuid,
            @RequestBody PutPlayer request
    );

    /**
     * DELETE request to delete player
     * @param uuid - user ID
     */
    @DeleteMapping("/api/players/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deletePlayer(
            @PathVariable("uuid") UUID uuid
    );
}
