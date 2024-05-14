package pl.edu.pg.eti.experience.service.api;

import pl.edu.pg.eti.experience.entity.Experience;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.users.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The service used for the {@link Experience} entity
 */
public interface ExperienceService {

    /**
     * Find a statistic by ID
     * @param uuid - experience ID
     * @return a statistic with specified ID (if exists)
     */
    Optional<Experience> find(UUID uuid);

    /**
     * Find a statistic by user and game
     * @param user - user
     * @param game - game
     * @return a statistic with specified user and game (if exists)
     */
    Optional<Experience> findByUserAndGame(User user, Game game);

    /**
     * Find statistics by user
     * @param user - user
     * @return a list of statistics with specified user
     */
    List<Experience> findByUser(User user);

    /**
     * Find statistics by game
     * @param game - game
     * @return a list of statistics with specified game
     */
    List<Experience> findByGame(Game game);

    /**
     * Find all statistics
     * @return a list of all statistics
     */
    List<Experience> findAll();

    /**
     * Create a new statistic
     * @param experience - statistic
     */
    void create(Experience experience);

    /**
     * Update statistic
     * @param experience - statistic
     */
    void update(Experience experience);

    /**
     * Delete statistic
     * @param uuid - experience ID
     */
    void delete(UUID uuid);

}
