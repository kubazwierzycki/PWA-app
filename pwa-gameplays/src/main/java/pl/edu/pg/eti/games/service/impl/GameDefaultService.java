package pl.edu.pg.eti.games.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.repository.api.GameRepository;
import pl.edu.pg.eti.games.service.api.GameService;

import java.util.List;
import java.util.Optional;

@Service
public class GameDefaultService implements GameService {

    private final GameRepository gameRepository;

    @Autowired
    public GameDefaultService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public Optional<Game> find(String id) {
        return gameRepository.findById(id);
    }

    @Override
    public List<Game> findAll() {
        return gameRepository.findAll();
    }

    @Override
    public void create(Game game) {
        gameRepository.save(game);
    }

    @Override
    public void update(Game game) {
        gameRepository.save(game);
    }

    @Override
    public void delete(String id) {
        gameRepository.findById(id).ifPresent(gameRepository::delete);
    }
}
