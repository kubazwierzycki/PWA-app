package pl.edu.pg.eti.players.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.players.entity.Player;
import pl.edu.pg.eti.players.repository.api.PlayerRepository;
import pl.edu.pg.eti.players.service.api.PlayerService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlayerDefaultService implements PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerDefaultService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public Optional<Player> find(UUID uuid) {
        return playerRepository.findById(uuid);
    }

    @Override
    public List<Player> findAll() {
        return playerRepository.findAll();
    }

    @Override
    public void create(Player player) {
        playerRepository.save(player);
    }

    @Override
    public void update(Player player) {
        playerRepository.save(player);
    }

    @Override
    public void delete(UUID uuid) {
        playerRepository.findById(uuid).ifPresent(playerRepository::delete);
    }
}
