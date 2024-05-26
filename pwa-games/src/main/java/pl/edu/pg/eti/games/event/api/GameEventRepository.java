package pl.edu.pg.eti.games.event.api;

import pl.edu.pg.eti.games.dto.PutGame;

/**
 * Event repository used to synchronize all services data
 */
public interface GameEventRepository {

    /**
     * Create user data in other services
     * @param id - game ID
     * @param request - user details
     */
    void create(String id, PutGame request);

    /**
     * Remove game data from other services
     * @param id - game ID
     */
    void delete(String id);

}
