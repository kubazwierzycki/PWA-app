package pl.edu.pg.eti.games.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.games.dto.GetGame;
import pl.edu.pg.eti.games.dto.GetGames;
import pl.edu.pg.eti.games.dto.PutGame;
import pl.edu.pg.eti.games.entity.Game;

/**
 * The controller used for the {@link Game} entity
 */
public interface GameController {

    @GetMapping("/api/games")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetGames getGames(
            @RequestParam(value="pattern", required=false) String pattern
    );

    @GetMapping("/api/games/{value}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetGame getGame(
            @PathVariable("value") String value,
            @RequestParam("type") String type
    );

    @PutMapping("/api/games/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    void putGame(
            @PathVariable("id") String id,
            @RequestBody PutGame request
    );

    @DeleteMapping("/api/games/{id}")
    void deleteGame(
            @PathVariable("id") String id
    );

}
