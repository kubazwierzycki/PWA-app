package pl.edu.pg.eti.gameplays.service.api;

import pl.edu.pg.eti.gameplays.entity.Gameplay;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The service used for the {@link Gameplay} entity
 */
public interface GameplayService {

    /**
     * Find a gameplay by ID
     * @param uuid - gameplay ID
     * @return a gameplay with specified ID (if exists)
     */
    Optional<Gameplay> find(UUID uuid);

    /**
     * Find all gameplays
     * @return a list with all gameplays
     */
    List<Gameplay> findAll();

    /**
     * Create a new gameplay
     * @param gameplay - gameplay details
     */
    void create(Gameplay gameplay);

    /**
     * Update game details
     * @param gameplay - gameplay details
     */
    void update(Gameplay gameplay);

    /**
     * Delete gameplay
     * @param uuid - gameplay ID
     */
    void delete(UUID uuid);

}
