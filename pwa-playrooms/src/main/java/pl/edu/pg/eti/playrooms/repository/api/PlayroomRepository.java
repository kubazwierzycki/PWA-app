package pl.edu.pg.eti.playrooms.repository.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pg.eti.playrooms.entity.Playroom;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The repository used for the {@link Playroom} entity
 */
@Repository
public interface PlayroomRepository extends JpaRepository<Playroom, UUID> {

    Optional<Playroom> findByUuid(UUID uuid);
    List<Playroom> findByPaused(boolean paused);
    List<Playroom> findByStartDateBefore(LocalDate date);
    List<Playroom> findAll();
}
