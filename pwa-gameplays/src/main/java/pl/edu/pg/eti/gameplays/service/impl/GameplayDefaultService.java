package pl.edu.pg.eti.gameplays.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.gameplays.entity.Gameplay;
import pl.edu.pg.eti.gameplays.repository.api.GameplayRepository;
import pl.edu.pg.eti.gameplays.service.api.GameplayService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class GameplayDefaultService implements GameplayService {

    private final GameplayRepository gameplayRepository;

    @Autowired
    public GameplayDefaultService(GameplayRepository gameplayRepository) {
        this.gameplayRepository = gameplayRepository;
    }

    @Override
    public Optional<Gameplay> find(UUID uuid) {
        return gameplayRepository.findById(uuid);
    }

    @Override
    public List<Gameplay> findAll() {
        return gameplayRepository.findAll();
    }

    @Override
    public void create(Gameplay gameplay) {
        gameplayRepository.save(gameplay);
    }

    @Override
    public void update(Gameplay gameplay) {
        gameplayRepository.save(gameplay);
    }

    @Override
    public void delete(UUID uuid) {
        gameplayRepository.findById(uuid).ifPresent(gameplayRepository::delete);
    }
}
