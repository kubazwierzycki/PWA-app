package pl.edu.pg.eti.users.service.api;

import pl.edu.pg.eti.users.entity.User;

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
