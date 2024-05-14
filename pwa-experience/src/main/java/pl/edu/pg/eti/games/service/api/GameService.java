package pl.edu.pg.eti.games.service.api;

import pl.edu.pg.eti.games.entity.Game;

import java.util.Optional;

/**
 * The service used for the {@link Game} entity
 */
public interface GameService {

    /**
     * Find a game by ID
     * @param id - game ID
     * @return a game with specified ID (if exists)
     */
    Optional<Game> findById(String id);

    /**
     * Create a new game
     * @param game - game details
     */
    void create(Game game);

    /**
     * Update game details
     * @param game - game details
     */
    void update(Game game);

    /**
     * Delete game
     * @param id - game ID
     */
    void delete(String id);

}
