package pl.edu.pg.eti.players.service.api;

import pl.edu.pg.eti.players.entity.Player;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The service used for the {@link Player} entity
 */
public interface PlayerService {

    /**
     * Find a player by ID
     * @param uuid - player ID
     * @return a player with specified ID (if exists)
     */
    Optional<Player> find(UUID uuid);

    /**
     * Find all players
     * @return a list with all players
     */
    List<Player> findAll();

    /**
     * Create a new player
     * @param player - player details
     */
    void create(Player player);

    /**
     * Update player details
     * @param player - player details
     */
    void update(Player player);

    /**
     * Delete player
     * @param uuid - player ID
     */
    void delete(UUID uuid);

}
