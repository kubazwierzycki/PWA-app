package pl.edu.pg.eti.experience.repository.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pg.eti.experience.entity.Experience;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.users.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The repository used for the {@link Experience} entity
 */
@Repository
public interface ExperienceRepository extends JpaRepository<Experience, UUID> {

    Optional<Experience> findByUuid(UUID uuid);
    Optional<Experience> findByUserAndGame(User user, Game game);
    List<Experience> findByUser(User user);
    List<Experience> findByGame(Game game);
    List<Experience> findAll();

}
