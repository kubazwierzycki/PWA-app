package pl.edu.pg.eti.games.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.games.dto.PutGame;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.event.api.GameEventRepository;
import pl.edu.pg.eti.games.repository.api.GameReporitory;
import pl.edu.pg.eti.games.service.api.GameService;

import java.util.List;
import java.util.Optional;

@Service
public class GameDefaultService implements GameService {

    private final GameReporitory gameReporitory;
    private final GameEventRepository gameEventRepository;

    @Autowired
    public GameDefaultService(GameReporitory gameReporitory, GameEventRepository gameEventRepository) {
        this.gameReporitory = gameReporitory;
        this.gameEventRepository = gameEventRepository;
    }

    @Override
    public Optional<Game> findById(String id) {
        return gameReporitory.findById(id);
    }

    @Override
    public Optional<Game> findByName(String name) {
        return gameReporitory.findByName(name);
    }

    @Override
    public List<Game> findByNamePattern(String pattern) {
        return gameReporitory.findByNameContainingIgnoreCase(pattern);
    }

    @Override
    public List<Game> findAll() {
        return gameReporitory.findAll();
    }

    @Override
    public void create(Game game) {
        gameReporitory.save(game);
        gameEventRepository.create(game.getId(),
                PutGame.builder()
                        .name(game.getName())
                        .build());
    }

    @Override
    public void update(Game game) {
        gameReporitory.save(game);
        gameEventRepository.create(game.getId(),
                PutGame.builder()
                        .name(game.getName())
                        .build());
    }

    @Override
    public void delete(String id) {
        gameReporitory.findById(id).ifPresent(gameReporitory::delete);
        gameEventRepository.delete(id);
    }
}
