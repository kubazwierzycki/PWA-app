package pl.edu.pg.eti.users.repository.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pg.eti.users.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * The repository used for the {@link User} entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findById(UUID uuid);
    Optional<User> findByUsername(String username);
    List<User> findByUsernameContainingIgnoreCase(String pattern);
    List<User> findAll();

}
