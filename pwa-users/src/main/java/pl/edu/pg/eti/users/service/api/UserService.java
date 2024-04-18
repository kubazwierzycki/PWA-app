package pl.edu.pg.eti.users.service.api;

import pl.edu.pg.eti.users.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The service used for the {@link User} entity
 */
public interface UserService {

    /**
     * Find a user by ID
     * @param uuid - user ID
     * @return a user with specified ID (if exists)
     */
    Optional<User> find(UUID uuid);

    /**
     * Find a user by email address
     * @param email - user email address
     * @return a user with specified email address (if exists)
     */
    Optional<User> findByEmail(String email);

    /**
     * Find a user by username
     * @param username - username
     * @return a user with specified username (if exists)
     */
    Optional<User> findByUsername(String username);

    /**
     * Find users by username pattern
     * @param pattern - username pattern
     * @return a list of users with a specific username pattern
     */
    List<User> findByUsernamePattern(String pattern);

    /**
     * Find all users
     * @return a list of all users
     */
    List<User> findAll();

    /**
     * Create a new user
     * @param user - user details
     */
    void create(User user);

    /**
     * Update user details
     * @param user - user details
     */
    void update(User user);

    /**
     * Delete user
     * @param uuid - user ID
     */
    void delete(UUID uuid);

}
