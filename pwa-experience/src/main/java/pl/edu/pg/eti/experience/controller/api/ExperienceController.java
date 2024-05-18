package pl.edu.pg.eti.experience.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.experience.dto.GetExperience;
import pl.edu.pg.eti.experience.dto.GetExperiences;
import pl.edu.pg.eti.experience.entity.Experience;

/**
 * The controller used for the {@link Experience} entity
 */
public interface ExperienceController {

    /**
     * GET request for all statistics
     * @return list of all statistics
     */
    @GetMapping("/api/experience")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetExperiences getAllExperiences();

    /**
     * GET request for user's or game's statistics
     * @param value - user UUID / game ID
     * @param type - enum user/game
     * @return list of statistics
     */
    @GetMapping("/api/experience/{value}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetExperiences getExperiences(
            @PathVariable("value") String value,
            @RequestParam("type") String type
    );

    /**
     * GET request for statistic related to specific user and game
     * @param userUUID - user UUID
     * @param gameID - game ID
     * @return specific statistic (if exists)
     */
    @GetMapping("api/experience/{userUUID}/{gameID}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetExperience getExperience(
            @PathVariable("userUUID") String userUUID,
            @PathVariable("gameID") String gameID
    );

    /**
     * PUT request to create or update statistics
     * (increment number of plays and update dates)
     * @param userUUID - user UUID
     * @param gameID - game ID
     * @param win (optional) - 1 if player won
     * @param rating (optional) - 1-10 play rating
     */
    @PutMapping("api/experience/{userUUID}/{gameID}")
    @ResponseStatus(HttpStatus.CREATED)
    void putExperience(
            @PathVariable("userUUID") String userUUID,
            @PathVariable("gameID") String gameID,
            @RequestParam(value="win", required=false) String win,
            @RequestParam(value="rating", required=false) String rating
    );

    /**
     * PATCH request to update statistics
     * (update a statistic only with param values -
     * dont update number of plays or play dates,
     * should be used after the above PUT request)
     * @param userUUID - user UUID
     * @param gameID - game ID
     * @param win (optional) - 1 if player won
     * @param rating (optional) - 1-10 play rating
     */
    @PatchMapping("api/experience/{userUUID}/{gameID}")
    @ResponseStatus(HttpStatus.CREATED)
    void updateExperience(
            @PathVariable("userUUID") String userUUID,
            @PathVariable("gameID") String gameID,
            @RequestParam(value="win", required=false) String win,
            @RequestParam(value="rating", required=false) String rating
    );

    /**
     * DELETE request to delete statistic
     * @param uuid - statistic UUID
     */
    @DeleteMapping("api/experience/{uuid}")
    void deleteExperience(
            @PathVariable("uuid") String uuid
    );
}
