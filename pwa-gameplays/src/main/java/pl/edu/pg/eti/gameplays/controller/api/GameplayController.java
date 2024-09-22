package pl.edu.pg.eti.gameplays.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.gameplays.dto.GetGameplay;
import pl.edu.pg.eti.gameplays.dto.GetGameplays;
import pl.edu.pg.eti.gameplays.dto.PutGameplay;
import pl.edu.pg.eti.gameplays.entity.Gameplay;

import java.util.UUID;

/**
 * The controller used for the {@link Gameplay} entity
 */
public interface GameplayController {

    /**
     * GET request for all gameplays
     * @return list of all gameplays
     */
    @GetMapping("/api/gameplay")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetGameplays getAllGameplays();

    /**
     * GET request for user's gameplays
     * @param uuid - user UUID
     * @return list of gameplays
     */
    @GetMapping("/api/gameplay/player/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetGameplays getGameplays(
            @PathVariable("uuid") String uuid)
    ;

    /**
     * GET request for specific gameplay
     * @param uuid - gameplay ID
     * @return specific gameplay
     */
    @GetMapping("/api/gameplay/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetGameplay getGameplay(
            @PathVariable("uuid") String uuid
    );


    /**
     * PUT request to change gameplay details
     * @param uuid - gameplay ID
     * @param request - gameplay details {@link PutGameplay}
     */
    @PutMapping("/api/gameplay/{uuid}")
    @ResponseStatus(HttpStatus.CREATED)
    void putGameplay(
            @PathVariable("uuid") String uuid,
            @RequestBody PutGameplay request
    );

    /**
     * DELETE request to delete gameplay
     * @param uuid - gameplay ID
     */
    @DeleteMapping("/api/gameplay/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteGameplay(
            @PathVariable("uuid") String uuid
    );

}
