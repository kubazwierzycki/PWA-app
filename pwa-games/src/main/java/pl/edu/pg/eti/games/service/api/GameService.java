package pl.edu.pg.eti.games.service.api;

import pl.edu.pg.eti.games.entity.Game;

import java.util.List;
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
     * Find a game by name
     * @param name - game name
     * @return a game with a specific name (if exists)
     */
    Optional<Game> findByName(String name);

    /**
     * Find all games by name pattern
     * @param pattern - game name pattern
     * @return a list of games with a specific name pattern
     */
    List<Game> findByNamePattern(String pattern);

    /**
     * Find all games
     * @return a list of all users
     */
    List<Game> findAll();

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
