package pl.edu.pg.eti.gameplays.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.gameplays.controller.api.GameplayController;
import pl.edu.pg.eti.gameplays.dto.GetGameplay;
import pl.edu.pg.eti.gameplays.dto.GetGameplays;
import pl.edu.pg.eti.gameplays.dto.PutGameplay;
import pl.edu.pg.eti.gameplays.entity.Gameplay;
import pl.edu.pg.eti.gameplays.service.api.GameplayService;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.players.entity.Player;
import pl.edu.pg.eti.players.service.api.PlayerService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@RestController
public class GameplayDefaultController implements GameplayController {

    private final GameplayService gameplayService;
    private final PlayerService playerService;

    @Autowired
    public GameplayDefaultController(GameplayService gameplayService,
                                     PlayerService playerService) {
        this.gameplayService = gameplayService;
        this.playerService = playerService;
    }

    @Override
    public GetGameplays getAllGameplays() {
        List<Gameplay> gameplays = gameplayService.findAll();

        return GetGameplays.builder()
                .gameplays(gameplays.stream()
                        .map(gameplay -> GetGameplays.Gameplay.builder()
                                .uuid(gameplay.getUuid())
                                .date(gameplay.getDate().toString())
                                .winner(gameplay.getWinner())
                                .game(gameplay.getGame().getName())
                                .players(getPlayersName(gameplay))
                                .build())
                        .toList())
                .build();
    }

    @Override
    public GetGameplays getGameplays(String uuid) {
        List<Gameplay> gameplays;
        try {
            gameplays = playerService.find(UUID.fromString(uuid)).orElseThrow().getGameplays();
        } catch (NoSuchElementException ex) {
            gameplays = new ArrayList<>();
        }

        return GetGameplays.builder()
                .gameplays(gameplays.stream()
                        .map(gameplay -> GetGameplays.Gameplay.builder()
                                .uuid(gameplay.getUuid())
                                .date(gameplay.getDate().toString())
                                .winner(gameplay.getWinner())
                                .game(gameplay.getGame().getName())
                                .players(getPlayersName(gameplay))
                                .build())
                        .toList())
                .build();
    }

    @Override
    public GetGameplay getGameplay(String uuid) {
        Gameplay gameplay = gameplayService.find(UUID.fromString(uuid)).orElse(null);

        if (gameplay == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return GetGameplay.builder()
                .uuid(gameplay.getUuid())
                .date(gameplay.getDate().toString())
                .winner(gameplay.getWinner())
                .game(gameplay.getGame().getName())
                .players(getPlayersName(gameplay))
                .build();
    }

    @Override
    public void putGameplay(String uuid, PutGameplay request) {
        Gameplay gameplay =
                Gameplay.builder()
                        .uuid(UUID.fromString(uuid))
                        .date(LocalDate.now())
                        .winner(request.getWinner())
                        .game(Game.builder()
                                .id(request.getGame().getId())
                                .name(request.getGame().getName())
                                .build())
                        .registeredPlayers(parseToRegisteredPlayers(request))
                        .anonymousPlayers(parseToAnonymousPlayers(request))
                        .build();

        gameplayService.create(gameplay);

        for (Player player : gameplay.getRegisteredPlayers()) {
            List<Gameplay> newGameplaysList = player.getGameplays();
            newGameplaysList.add(gameplay);
            player.setGameplays(newGameplaysList);

            playerService.update(player);
        }
    }

    @Override
    public void deleteGameplay(String uuid) {
        gameplayService.delete(UUID.fromString(uuid));
    }

    private List<String> getPlayersName(Gameplay gameplay) {
        List<String> usernames = gameplay.getAnonymousPlayers();

        for (Player player : gameplay.getRegisteredPlayers()) {
            usernames.add(0, player.getUsername());
        }

        return usernames;
    }

    private List<Player> parseToRegisteredPlayers(PutGameplay request) {
        List<Player> result = new ArrayList<>();

        for (PutGameplay.Player player : request.getPlayers()) {
            if (player.getUuid() != null) {
                playerService.find(player.getUuid()).ifPresent(result::add);
            }
        }
        return result;
    }

    private List<String> parseToAnonymousPlayers(PutGameplay request) {
        List<String> result = new ArrayList<>();

        for (PutGameplay.Player player : request.getPlayers()) {
            if (player.getUuid() == null) {
                result.add(player.getName());
            }
        }
        return result;
    }
}
