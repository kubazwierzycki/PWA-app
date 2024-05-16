package pl.edu.pg.eti.experience.initialize;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.edu.pg.eti.experience.entity.Experience;
import pl.edu.pg.eti.experience.service.api.ExperienceService;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.service.api.GameService;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.service.api.UserService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.UUID;

/**
 * Initialize test data
 */
@Component
public class InitializeData implements InitializingBean {

    private final ExperienceService experienceService;
    private final UserService userService;
    private final GameService gameService;

    @Autowired
    public InitializeData(ExperienceService experienceService, UserService userService, GameService gameService) {
        this.experienceService = experienceService;
        this.userService = userService;
        this.gameService = gameService;
    }

    @Override
    public void afterPropertiesSet() {
        User user1 = new User(UUID.randomUUID(), "username1", null, new ArrayList<>());
        User user2 = new User(UUID.randomUUID(), "username2", "bgg", new ArrayList<>());
        userService.create(user1);
        userService.create(user2);

        Game game1 = new Game("1", "game1", new ArrayList<>());
        Game game2 = new Game("2", "game2", new ArrayList<>());
        Game game3 = new Game("3", "game3", new ArrayList<>());
        gameService.create(game1);
        gameService.create(game2);
        gameService.create(game3);

        experienceService.create(
                Experience.builder()
                        .uuid(UUID.randomUUID())
                        .user(user1)
                        .game(game1)
                        .avgRating(0)
                        .numberOfPlays(0)
                        .numberOfWins(0)
                        .firstPlay(null)
                        .lastPlay(null)
                        .build()
        );

        experienceService.create(
                Experience.builder()
                        .uuid(UUID.randomUUID())
                        .user(user1)
                        .game(game2)
                        .avgRating(5)
                        .numberOfPlays(5)
                        .numberOfWins(2)
                        .firstPlay(LocalDate.of(2024, 1, 1))
                        .lastPlay(LocalDate.of(2024, 5, 1))
                        .build()
        );

        experienceService.create(
                Experience.builder()
                        .uuid(UUID.randomUUID())
                        .user(user2)
                        .game(game3)
                        .avgRating(10)
                        .numberOfPlays(1)
                        .numberOfWins(1)
                        .firstPlay(LocalDate.of(2024, 2, 1))
                        .lastPlay(LocalDate.of(2024, 2, 1))
                        .build()
        );
    }
}
