package pl.edu.pg.eti.users.controller.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import pl.edu.pg.eti.users.dto.GetRanking;
import pl.edu.pg.eti.users.dto.GetUser;
import pl.edu.pg.eti.users.dto.GetUsers;
import pl.edu.pg.eti.users.dto.PostLogin;
import pl.edu.pg.eti.users.dto.PostUser;
import pl.edu.pg.eti.users.dto.PutPassword;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.dto.Token;
import pl.edu.pg.eti.users.entity.User;

import java.util.UUID;

/**
 * The controller used for the {@link User} entity
 */
public interface UserController {

    /**
     * GET request for all users or users with a specific username pattern
     * @param pattern (optional) - username pattern
     * @return a list of users
     */
    @GetMapping("/api/users")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetUsers getUsers(
            @RequestParam(value="pattern", required=false) String pattern
    );

    /**
     * GET request for the user with a specific uuid/username/email
     * @param value - uuid/username/email value
     * @param type - enum: uuid/username/email
     * @return specific user (if exists)
     */
    @GetMapping("/api/users/{value}")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetUser getUser(
            @PathVariable("value") String value,
            @RequestParam("type")String type
    );

    /**
     * PUT request to change user details
     * @param uuid - user ID
     * @param request - user details {@link PutUser}
     * @param option (optional) - enum: email/bgg
     * @param token - authorization token
     */
    @PutMapping("/api/users/{uuid}")
    @ResponseStatus(HttpStatus.CREATED)
    void putUser(
            @PathVariable("uuid") UUID uuid,
            @RequestBody PutUser request,
            @RequestParam(value="option", required=false) String option,
            @RequestHeader("Authorization") String token
    );

    /**
     * POST request to create a new user
     * @param request - user details {@link PostUser}
     * @return user session token
     */
    @PostMapping("/api/users")
    @ResponseStatus(HttpStatus.CREATED)
    ResponseEntity<Token> postUser (
            @RequestBody PostUser request
    );

    /**
     * POST request to login
     * @param request - login credentials {@link PostLogin}
     * @return user session token
     */
    @PostMapping("/api/users/login")
    @ResponseStatus(HttpStatus.CREATED)
    ResponseEntity<Token> loginUser (
            @RequestBody PostLogin request
    );

    /**
     * PUT request to change user password
     * @param uuid - user ID
     * @param request - hashed password details
     * @param token - authorization token
     */
    @PutMapping("/api/users/{uuid}/password")
    @ResponseStatus(HttpStatus.CREATED)
    void putPassword (
            @PathVariable("uuid") UUID uuid,
            @RequestBody PutPassword request,
            @RequestHeader("Authorization") String token
    );

    /**
     * DELETE request to delete user
     * @param uuid - user ID
     * @param token - authorization token
     */
    @DeleteMapping("/api/users/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteUser(
            @PathVariable("uuid") UUID uuid,
            @RequestHeader("Authorization") String token
    );

    /**
     * POST request to logout
     * @param uuid - user ID
     * @param token - authorization token
     */
    @PostMapping("/api/users/{uuid}/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void logoutUser(
            @PathVariable("uuid") UUID uuid,
            @RequestHeader("Authorization") String token
    );

    /**
     * GET request for user ranking
     * @param uuid - user ID
     * @return ranking dictionary
     */
    @GetMapping("/api/users/{uuid}/ranking")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetRanking getRanking(
            @PathVariable("uuid") UUID uuid
    );

    /**
     * PUT request to update user ranking
     * @param uuid - user ID
     */
    @PutMapping("/api/users/{uuid}/ranking")
    @ResponseStatus(HttpStatus.CREATED)
    void putRanking(
            @PathVariable("uuid") UUID uuid
    );

}
