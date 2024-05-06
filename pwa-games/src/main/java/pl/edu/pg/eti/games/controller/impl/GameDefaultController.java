package pl.edu.pg.eti.games.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.games.controller.api.GameController;
import pl.edu.pg.eti.games.dto.GetGame;
import pl.edu.pg.eti.games.dto.GetGames;
import pl.edu.pg.eti.games.dto.PutGame;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.service.api.GameService;

import java.util.ArrayList;
import java.util.List;

@RestController
public class GameDefaultController implements GameController {

    private final GameService gameService;

    @Autowired
    public GameDefaultController(GameService gameService) {
        this.gameService = gameService;
    }

    @Override
    public GetGames getGames(String pattern) {
        List<Game> games;
        if (pattern == null) {
            games = gameService.findAll();
        }
        else {
            games = gameService.findByNamePattern(pattern);
        }

        return GetGames.builder()
                .games(games.stream()
                        .map(game -> GetGames.Game.builder()
                                .id(game.getId())
                                .name(game.getName())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public GetGame getGame(String value, String type) {
        Game game;
        if ("id".equals(type)) {
            game = gameService.findById(value).orElse(null);
        }
        else if ("name".equals(type)) {
            game = gameService.findByName(value).orElse(null);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        if (game == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Game.TimerSettings timerSettings;
        try {
            timerSettings = game.getMostPopularTimers().get(0);
        }
        catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return GetGame.builder()
                .id(game.getId())
                .name(game.getName())
                .isTurnBased(timerSettings.isTimeTurnBased())
                .time(timerSettings.getTime())
                .build();
    }

    @Override
    public void putGame(String id, PutGame request) {
        Game game = gameService.findById(id).orElse(null);

        if (game == null) {
            game = Game.builder()
                    .id(id)
                    .name(request.getName())
                    .mostPopularTimers(new ArrayList<>())
                    .build();
        }
        else {
            if (!game.getName().equals(request.getName())) {
                game.setName(request.getName());
            }
        }

        Game.TimerSettings timerSettings = new Game.TimerSettings(request.isTurnBased(), request.getTime());
        game.addTimerSettings(timerSettings);

        gameService.update(game);

    }

    @Override
    public void deleteGame(String id) {
        gameService.delete(id);
    }
}
