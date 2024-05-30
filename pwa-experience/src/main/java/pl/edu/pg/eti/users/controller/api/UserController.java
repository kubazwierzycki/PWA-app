package pl.edu.pg.eti.users.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.entity.User;

import java.util.UUID;

/**
 * The controller used for the {@link User} entity
 */
public interface UserController {

    /**
     * PUT request to change user details
     * @param uuid - user ID
     * @param request - user details {@link PutUser}
     */
    @PutMapping("/api/users/{uuid}")
    @ResponseStatus(HttpStatus.CREATED)
    void putUser(
            @PathVariable("uuid") UUID uuid,
            @RequestBody PutUser request
    );

    /**
     * DELETE request to delete user
     * @param uuid - user ID
     */
    @DeleteMapping("/api/users/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteUser(
            @PathVariable("uuid") UUID uuid
    );
}
