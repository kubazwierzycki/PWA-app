package pl.edu.pg.eti.users.event.api;

import pl.edu.pg.eti.users.dto.PutUser;

import java.util.UUID;

/**
 * Event repository used to synchronize all services data
 */
public interface UserEventRepository {

    /**
     * Create user data in other services
     * @param uuid - user UUID
     * @param request - user details
     */
    void create(UUID uuid, PutUser request);

    /**
     * Remove user data from other services
     * @param uuid - user UUID
     */
    void delete(UUID uuid);

}
