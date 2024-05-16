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

    @GetMapping("/api/experience")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetExperiences getAllExperiences();

    @GetMapping("/api/experience/{value}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetExperiences getExperiences(
            @PathVariable("value") String value,
            @RequestParam("type") String type
    );

    @GetMapping("api/experience/{userUUID}/{gameID}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetExperience getExperience(
            @PathVariable("userUUID") String userUUID,
            @PathVariable("gameID") String gameID
    );

    @PutMapping("api/experience/{userUUID}/{gameID}")
    @ResponseStatus(HttpStatus.CREATED)
    void putExperience(
            @PathVariable("userUUID") String userUUID,
            @PathVariable("gameID") String gameID,
            @RequestParam(value="win", required=false) String win,
            @RequestParam(value="rating", required=false) String rating
    );

    @PatchMapping("api/experience/{userUUID}/{gameID}")
    @ResponseStatus(HttpStatus.CREATED)
    void updateExperience(
            @PathVariable("userUUID") String userUUID,
            @PathVariable("gameID") String gameID,
            @RequestParam(value="win", required=false) String win,
            @RequestParam(value="rating", required=false) String rating
    );

    @DeleteMapping("api/experience/{uuid}")
    void deleteExperience(
            @PathVariable("uuid") String uuid
    );
}
