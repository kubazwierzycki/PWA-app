package pl.edu.pg.eti.gameplays.repository.api;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pg.eti.gameplays.entity.Gameplay;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The repository used for the {@link Gameplay} entity
 */
public interface GameplayRepository extends JpaRepository<Gameplay, UUID> {
    Optional<Gameplay> findById(UUID uuid);
    List<Gameplay> findAll();
}
