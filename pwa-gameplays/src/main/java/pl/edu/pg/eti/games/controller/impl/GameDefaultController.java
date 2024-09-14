package pl.edu.pg.eti.games.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.games.controller.api.GameController;
import pl.edu.pg.eti.games.dto.PutGame;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.service.api.GameService;

@RestController
public class GameDefaultController implements GameController {

    private final GameService gameService;

    @Autowired
    public GameDefaultController(GameService gameService) {
        this.gameService = gameService;
    }

    @Override
    public void putGame(String id, PutGame request) {
        gameService.update(
                Game.builder()
                        .id(id)
                        .name(request.getName())
                        .build());
    }

    @Override
    public void deleteGame(String id) {
        Game game = gameService.find(id).orElse(null);

        if (game == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else {
            gameService.delete(id);
        }
    }
}
