package pl.edu.pg.eti.playrooms.event.api;

import pl.edu.pg.eti.playrooms.entity.Playroom;

/**
 * Event repository used to synchronize all services data
 */
public interface PlayroomEventRepository {

    /**
     * Add new statistics in experience service
     * @param userId - user UUID
     * @param gameId - game ID
     */
    void createExperience(String userId, String gameId);

    /**
     * Update statistics (without creating new record)
     * @param userId - user UUID
     * @param gameId - game ID
     * @param win - if the user won
     */
    void putExperience(String userId, String gameId, boolean win);

    /**
     * Update statistics (without creating new record)
     * @param userId - user UUID
     * @param gameId - game ID
     * @param win - if the user won
     * @param rating - user opinion about played game
     */
    void putExperience(String userId, String gameId, boolean win, int rating);

    /**
     * Create or update game details in games service
     * @param gameId - game ID
     * @param gameName - game name
     * @param isTurnBased - if game is turn based
     * @param time - game timer
     */
    void updateGame(String gameId, String gameName, boolean isTurnBased, int time);

    /**
     * Create or update gameplay details in gameplays service
     * @param playroom - playroom details
     */
    void putGameplay(Playroom playroom);

    /**
     * Create or update gameplay details in gameplays service
     * @param playroom - playroom details
     * @param winner - winner username
     */
    void putGameplay(Playroom playroom, String winner);

}
