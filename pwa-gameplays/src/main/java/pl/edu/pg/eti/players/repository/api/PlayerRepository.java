package pl.edu.pg.eti.players.repository.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pg.eti.players.entity.Player;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The repository used for the {@link Player} entity
 */
@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {
    Optional<Player> findById(UUID uuid);
    List<Player> findAll();
}
