package pl.edu.pg.eti.users.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.users.controller.api.UserController;
import pl.edu.pg.eti.users.dto.GetUser;
import pl.edu.pg.eti.users.dto.GetUsers;
import pl.edu.pg.eti.users.dto.PostLogin;
import pl.edu.pg.eti.users.dto.PostUser;
import pl.edu.pg.eti.users.dto.PutPassword;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.service.api.UserService;

import java.util.List;
import java.util.UUID;

@RestController
public class UserDefaultController implements UserController {

    private final UserService userService;

    @Autowired
    public UserDefaultController(UserService userService) {
        this.userService = userService;
    }

    @Override
    public GetUsers getUsers(String pattern) {
        List<User> users;
        if (pattern == null) {
            users = userService.findAll();
        }
        else {
            users = userService.findByUsernamePattern(pattern);
        }

        return GetUsers.builder()
                .users(users.stream()
                        .map(user -> GetUsers.User.builder()
                                .uuid(user.getUuid())
                                .username(user.getUsername())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public GetUser getUser(String value, String type) {
        User user;
        if ("uuid".equals(type)) {
            try {
                user = userService.find(UUID.fromString(value)).orElse(null);
            }
            catch (Exception ex) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        }
        else if ("email".equals(type)) {
            user = userService.findByEmail(value).orElse(null);
        }
        else if ("username".equals(type)) {
            user = userService.findByUsername(value).orElse(null);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY);
        }

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return GetUser.builder()
                .uuid(user.getUuid())
                .username(user.getUsername())
                .email(user.getEmail())
                .bggUsername(user.getBggUsername())
                .build();
    }

    @Override
    public void putUser(UUID uuid, PutUser request) {

    }

    @Override
    public ResponseEntity<String> postUser(PostUser request) {
        return null;
    }

    @Override
    public ResponseEntity<String> loginUser(PostLogin request) {
        return null;
    }

    @Override
    public void putPassword(UUID uuid, PutPassword request) {

    }

    @Override
    public void deleteUser(UUID uuid) {

    }
}
