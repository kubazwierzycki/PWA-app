package pl.edu.pg.eti.experience.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.experience.controller.api.ExperienceController;
import pl.edu.pg.eti.experience.dto.GetExperience;
import pl.edu.pg.eti.experience.dto.GetExperiences;
import pl.edu.pg.eti.experience.entity.Experience;
import pl.edu.pg.eti.experience.service.api.ExperienceService;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.service.api.GameService;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.service.api.UserService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
public class ExperienceDefaultController implements ExperienceController {

    private final ExperienceService experienceService;
    private final UserService userService;
    private final GameService gameService;

    @Autowired
    public ExperienceDefaultController(ExperienceService experienceService,
                                       UserService userService, GameService gameService) {
        this.experienceService = experienceService;
        this.userService = userService;
        this.gameService = gameService;
    }

    @Override
    public GetExperiences getAllExperiences() {
        List<Experience> experiences = experienceService.findAll();

        return GetExperiences.builder()
                .experiences(experiences.stream()
                        .map(experience -> GetExperiences.Experience.builder()
                                .uuid(experience.getUuid())
                                .userUuid(experience.getUser().getUuid())
                                .username(experience.getUser().getUsername())
                                .gameId(experience.getGame().getId())
                                .game(experience.getGame().getName())
                                .numberOfPlays(experience.getNumberOfPlays())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public GetExperiences getExperiences(String value, String type) {
        List<Experience> experiences;

        if ("user".equals(type)) {
            User user = userService.find(UUID.fromString(value)).orElse(null);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
            else {
                experiences = experienceService.findByUser(user);
            }
        }
        else if ("game".equals(type)) {
            Game game = gameService.findById(value).orElse(null);
            if (game == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
            else {
                experiences = experienceService.findByGame(game);
            }
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        return GetExperiences.builder()
                .experiences(experiences.stream()
                        .map(experience -> GetExperiences.Experience.builder()
                                .uuid(experience.getUuid())
                                .userUuid(experience.getUser().getUuid())
                                .username(experience.getUser().getUsername())
                                .gameId(experience.getGame().getId())
                                .game(experience.getGame().getName())
                                .numberOfPlays(experience.getNumberOfPlays())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public GetExperience getExperience(String userUUID, String gameID) {
        User user = userService.find(UUID.fromString(userUUID)).orElse(null);
        Game game = gameService.findById(gameID).orElse(null);

        if (user == null || game == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Experience experience = experienceService.findByUserAndGame(user, game).orElse(null);
        if (experience == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return GetExperience.builder()
                .uuid(experience.getUuid())
                .userUuid(user.getUuid())
                .username(user.getUsername())
                .gameId(game.getId())
                .game(game.getName())
                .numberOfPlays(experience.getNumberOfPlays())
                .numberOfWins(experience.getNumberOfWins())
                .firstPlay(experience.getFirstPlay())
                .lastPlay(experience.getLastPlay())
                .avgRating(experience.getAvgRating())
                .build();
    }

    private Experience updateDetails(Experience experience, String win, String rating) {
        if ("1".equals(win)) {
            experience.setNumberOfWins(experience.getNumberOfWins() + 1);
        }
        if (rating != null) {
            try {
                double playRating = Double.parseDouble(rating);
                if (playRating >= 1 && playRating <= 10) {
                    playRating += (experience.getAvgRating() * experience.getNumberOfVotes());
                    experience.setAvgRating(playRating / (experience.getNumberOfVotes() + 1));
                    experience.setNumberOfVotes(experience.getNumberOfVotes() + 1);
                    return experience;
                }
            }
            catch (Exception ex) {

            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return experience;
    }

    @Override
    public void putExperience(String userUUID, String gameID, String win, String rating) {
        User user = userService.find(UUID.fromString(userUUID)).orElse(null);
        Game game = gameService.findById(gameID).orElse(null);

        if (user == null || game == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Experience experience = experienceService.findByUserAndGame(user, game).orElse(null);
        if (experience == null) {
            experience = Experience.builder()
                    .uuid(UUID.randomUUID())
                    .user(user)
                    .game(game)
                    .avgRating(0)
                    .numberOfVotes(0)
                    .numberOfPlays(1)
                    .numberOfWins(0)
                    .firstPlay(LocalDate.now())
                    .lastPlay(LocalDate.now())
                    .build();
        }
        else {
            experience.setNumberOfPlays(experience.getNumberOfPlays() + 1);
            experience.setLastPlay(LocalDate.now());
        }

        experience = updateDetails(experience, win, rating);
        experienceService.update(experience);
    }

    @Override
    public void updateExperience(String userUUID, String gameID, String win, String rating) {
        User user = userService.find(UUID.fromString(userUUID)).orElse(null);
        Game game = gameService.findById(gameID).orElse(null);

        if (user == null || game == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Experience experience = experienceService.findByUserAndGame(user, game).orElse(null);
        if (experience == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        experience = updateDetails(experience, win, rating);
        experienceService.update(experience);
    }

    @Override
    public void deleteExperience(String uuid) {
        experienceService.delete(UUID.fromString(uuid));
    }
}
