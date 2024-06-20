package pl.edu.pg.eti.users.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.users.controller.api.UserController;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.service.api.UserService;

import java.util.UUID;

@RestController
public class UserDefaultController implements UserController {

    private final UserService userService;

    @Autowired
    public UserDefaultController(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void putUser(UUID uuid, PutUser request) {
        userService.update(
                User.builder()
                        .uuid(uuid)
                        .username(request.getUsername())
                        .bggUsername(request.getBggUsername())
                        .build()
        );
    }

    @Override
    public void deleteUser(UUID uuid) {
        User user = userService.find(uuid).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else {
            userService.delete(uuid);
        }
    }
}
