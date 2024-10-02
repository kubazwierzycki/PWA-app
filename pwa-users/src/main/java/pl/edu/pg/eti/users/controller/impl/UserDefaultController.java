package pl.edu.pg.eti.users.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.users.controller.api.UserController;
import pl.edu.pg.eti.users.dto.GetRanking;
import pl.edu.pg.eti.users.dto.GetUser;
import pl.edu.pg.eti.users.dto.GetUsers;
import pl.edu.pg.eti.users.dto.PostLogin;
import pl.edu.pg.eti.users.dto.PostUser;
import pl.edu.pg.eti.users.dto.PutPassword;
import pl.edu.pg.eti.users.dto.PutRanking;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.dto.Token;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.service.api.UserService;
import pl.edu.pg.eti.users.utils.BggRankingManager;
import pl.edu.pg.eti.users.utils.SecurityProvider;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
public class UserDefaultController implements UserController {

    private final UserService userService;
    private final BggRankingManager bggRankingManager;

    @Autowired
    public UserDefaultController(UserService userService, BggRankingManager bggRankingManager) {
        this.userService = userService;
        this.bggRankingManager = bggRankingManager;
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
    public void putUser(UUID uuid, PutUser request, String option, String token) {
        User user = userService.find(uuid).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else if (user.getToken().equals(SecurityProvider.calculateSHA256(token))) {
            if ("bgg".equals(option)) {
                user.setBggUsername(request.getBggUsername());
                userService.update(user);

                Thread createRanking = new Thread(() -> {
                    loadUserRanking(user);
                });
                createRanking.start();
            }
            else if ("email".equals(option)) {
                user.setEmail(request.getEmail());
                userService.update(user);
            }
            else {
                user.setEmail(request.getEmail());
                user.setBggUsername(request.getBggUsername());
                userService.update(user);

                Thread createRanking = new Thread(() -> {
                    loadUserRanking(user);
                });
                createRanking.start();
            }
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<Token> postUser(PostUser request) {
        if (userService.findByUsername(request.getUsername()).isPresent() ||
                userService.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        else {
            String token = UUID.randomUUID().toString();
            UUID uuid = UUID.randomUUID();
            User user = User.builder()
                    .uuid(uuid)
                    .email(request.getEmail())
                    .username(request.getUsername())
                    .password(SecurityProvider.calculateSHA256(request.getPassword()))
                    .token(SecurityProvider.calculateSHA256(token))
                    .bggUsername(request.getBggUsername())
                    .loadRanking(false)
                    .build();
            userService.create(user);

            Thread createRanking = new Thread(() -> {
                loadUserRanking(user);
            });
            createRanking.start();

            return ResponseEntity.ok(Token.builder().token(token).uuid(uuid.toString()).build());
        }
    }

    @Override
    public ResponseEntity<Token> loginUser(PostLogin request) {
        User user = userService.findByUsername(request.getUsername()).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else {
            if (user.getPassword().equals(SecurityProvider.calculateSHA256(request.getPassword()))) {

                String token = UUID.randomUUID().toString();
                user.setToken(SecurityProvider.calculateSHA256(token));
                userService.update(user);

                return ResponseEntity.ok(Token.builder().token(token).uuid(user.getUuid().toString()).build());
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    @Override
    public void putPassword(UUID uuid, PutPassword request, String token) {
        User user = userService.find(uuid).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else if (user.getToken().equals(SecurityProvider.calculateSHA256(token)) &&
                user.getPassword().equals(SecurityProvider.calculateSHA256(request.getOldPassword()))) {

            user.setPassword(SecurityProvider.calculateSHA256(request.getNewPassword()));
            userService.update(user);

            return;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    @Override
    public void deleteUser(UUID uuid, String token) {
        User user = userService.find(uuid).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else if (user.getToken().equals(SecurityProvider.calculateSHA256(token))) {
            userService.delete(uuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public void logoutUser(UUID uuid, String token) {
        User user = userService.find(uuid).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else if (user.getToken().equals(SecurityProvider.calculateSHA256(token))) {

            user.setToken(null);
            userService.update(user);
            return;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    @Override
    public GetRanking getRanking(UUID uuid) {
        User user = userService.find(uuid).orElse(null);

        if (user == null || user.getRanking() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else if (user.isLoadRanking() && user.getRanking().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else {
            return GetRanking.builder()
                    .ranking(user.getRanking().stream()
                            .map(game -> GetRanking.GameRanking.builder()
                                    .gameId(game.getGameId())
                                    .rating(game.getRating())
                                    .numberOfCompares(game.getNumberOfCompares())
                                    .build())
                            .toList())
                    .build();
        }
    }

    @Override
    public void putRanking(UUID uuid, PutRanking request, String token) {
        User user = userService.find(uuid).orElse(null);

        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else if (user.getToken().equals(SecurityProvider.calculateSHA256(token))) {
            List<User.GameRanking> updatedRanking = new ArrayList<>();
            for (PutRanking.GameRanking game : request.getRanking()) {
                updatedRanking.add(new User.GameRanking(game.getGameId(), game.getRating(), game.getNumberOfCompares()));
            }
            user.setRanking(updatedRanking);
            userService.update(user);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        Thread createRanking = new Thread(() -> {
            user.setLoadRanking(true);
            userService.update(user);

            user.setRanking(bggRankingManager.updateGameRanking(user.getUuid().toString()));
            user.setLoadRanking(false);
            userService.update(user);
        });
        createRanking.start();
    }

    private void loadUserRanking(User user) {
        user.setLoadRanking(true);
        userService.update(user);

        user.setRanking(bggRankingManager.getNewGameRanking(user.getUuid().toString()));
        user.setLoadRanking(false);
        userService.update(user);
    }
}
