package pl.edu.pg.eti.playrooms.event.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import pl.edu.pg.eti.playrooms.dto.PutGame;
import pl.edu.pg.eti.playrooms.dto.PutGameplay;
import pl.edu.pg.eti.playrooms.entity.Playroom;
import pl.edu.pg.eti.playrooms.event.api.PlayroomEventRepository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class PlayroomDefaultEventRepository implements PlayroomEventRepository {

    private final RestTemplate gamesRestTemplate;
    private final RestTemplate experienceRestTemplate;
    private final RestTemplate gameplaysRestTemplate;

    @Autowired
    public PlayroomDefaultEventRepository(@Qualifier("gamesRestTemplate") RestTemplate gamesRestTemplate,
                                          @Qualifier("experienceRestTemplate") RestTemplate experienceRestTemplate,
                                          @Qualifier("gameplaysRestTemplate") RestTemplate gameplaysRestTemplate) {
        this.gamesRestTemplate = gamesRestTemplate;
        this.experienceRestTemplate = experienceRestTemplate;
        this.gameplaysRestTemplate = gameplaysRestTemplate;
    }

    @Override
    public void createExperience(String userId, String gameId) {
        experienceRestTemplate.postForEntity("/api/experience/{userUUID}/{gameID}",
                null, Void.TYPE, userId, gameId);
    }

    @Override
    public void putExperience(String userId, String gameId, boolean win) {
        if (win) {
            experienceRestTemplate.put("/api/experience/{userUUID}/{gameID}?win=1",
                    null, userId, gameId);
        }
        else {
            experienceRestTemplate.put("/api/experience/{userUUID}/{gameID}",
                    null, Void.TYPE, userId, gameId);
        }
    }

    @Override
    public void putExperience(String userId, String gameId, boolean win, int rating) {
        if (rating < 0 || rating > 10) {
            putExperience(userId, gameId, win);
        }
        if (win) {
            experienceRestTemplate.put("/api/experience/{userUUID}/{gameID}?win=1&rating={rating}",
                    null, userId, gameId, rating);
        }
        else {
            experienceRestTemplate.put("/api/experience/{userUUID}/{gameID}?rating={rating}",
                    null, userId, gameId, rating);
        }
    }

    @Override
    public void updateGame(String gameId, String gameName, boolean isTurnBased, int time) {
        gamesRestTemplate.put("/api/games/{id}", new PutGame(gameName, isTurnBased, time), gameId);
    }

    @Override
    public void putGameplay(Playroom playroom) {
        putGameplay(playroom, null);
    }

    @Override
    public void putGameplay(Playroom playroom, String winner) {
        List<PutGameplay.Player> players = new ArrayList<>();

        for (Playroom.Player player : playroom.getPlayers().values()) {
            players.add(
                    PutGameplay.Player.builder()
                            .uuid(player.getUuid())
                            .name(player.getUsername())
                            .build()
            );
        }

        PutGameplay gameplay =
                PutGameplay.builder()
                        .uuid(playroom.getUuid())
                        .winner(winner)
                        .game(PutGameplay.Game.builder()
                                .id(playroom.getGame().getId())
                                .name(playroom.getGame().getName())
                                .build())
                        .players(players)
                        .build();

        gameplaysRestTemplate.put("/api/gameplay/{uuid}", gameplay);
    }
}
