package pl.edu.pg.eti.playrooms.service.api;

import pl.edu.pg.eti.playrooms.entity.Playroom;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The service used for the {@link Playroom} entity
 */
public interface PlayroomService {

    /**
     * Find a playroom by ID
     * @param uuid - playroom ID
     * @return a playroom with specified ID (if exists)
     */
    Optional<Playroom> find(UUID uuid);

    /**
     * Find paused playrooms
     * @param paused - true/false (isPaused)
     * @return a list of paused playrooms
     */
    List<Playroom> findByPaused(boolean paused);

    /**
     * Find playrooms created before specific date
     * @param date - specific date
     * @return a list of playrooms
     */
    List<Playroom> findByStartDateBefore(LocalDate date);

    /**
     * Find all playrooms
     * @return a list of all playrooms
     */
    List<Playroom> findAll();

    /**
     * Create a new playroom
     * @param playroom - playroom
     */
    void create(Playroom playroom);

    /**
     * Update playroom
     * @param playroom - playroom
     */
    void update(Playroom playroom);

    /**
     * Delete playroom
     * @param uuid - playroom ID
     */
    void delete(UUID uuid);

}
