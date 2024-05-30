package pl.edu.pg.eti.games.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
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
        gameService.update(Game.builder()
                .id(id)
                .name(request.getName())
                .build());
    }

    @Override
    public void deleteGame(String id) {
        gameService.delete(id);
    }
}
