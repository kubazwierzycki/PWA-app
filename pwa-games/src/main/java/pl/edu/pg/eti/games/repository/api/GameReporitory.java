package pl.edu.pg.eti.games.repository.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pg.eti.games.entity.Game;

import java.util.List;
import java.util.Optional;

/**
 * The repository used for the {@link Game} entity
 */
@Repository
public interface GameReporitory extends JpaRepository<Game, String> {

    Optional<Game> findById(String id);
    Optional<Game> findByName(String name);
    List<Game> findByNameContainingIgnoreCase(String pattern);
    List<Game> findAll();

}
