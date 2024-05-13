package pl.edu.pg.eti.games.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.repository.api.GameReporitory;
import pl.edu.pg.eti.games.service.api.GameService;

@Service
public class GameDefaultService implements GameService {

    private final GameReporitory gameReporitory;

    @Autowired
    public GameDefaultService(GameReporitory gameReporitory) {
        this.gameReporitory = gameReporitory;
    }

    @Override
    public void create(Game game) {
        gameReporitory.save(game);
    }

    @Override
    public void update(Game game) {
        gameReporitory.save(game);
    }

    @Override
    public void delete(String id) {
        gameReporitory.findById(id).ifPresent(gameReporitory::delete);
    }
}
