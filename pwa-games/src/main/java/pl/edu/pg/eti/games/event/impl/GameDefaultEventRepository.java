package pl.edu.pg.eti.games.event.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import pl.edu.pg.eti.games.dto.PutGame;
import pl.edu.pg.eti.games.dto.PutGameBasic;
import pl.edu.pg.eti.games.event.api.GameEventRepository;

@Repository
public class GameDefaultEventRepository implements GameEventRepository {

    private final RestTemplate experienceRestTemplate;
    private final RestTemplate gameplaysRestTemplate;

    @Autowired
    public GameDefaultEventRepository(@Qualifier("experienceRestTemplate") RestTemplate experienceRestTemplate,
                                      @Qualifier("gameplaysRestTemplate") RestTemplate gameplaysRestTemplate) {
        this.experienceRestTemplate = experienceRestTemplate;
        this.gameplaysRestTemplate = gameplaysRestTemplate;
    }

    @Override
    public void create(String id, PutGame request) {
        experienceRestTemplate.put("/api/games/{id}", request, id);
        gameplaysRestTemplate.put("/api/ganes/{id}",
                PutGameBasic.builder()
                        .name(request.getName())
                        .build(), id);
    }

    @Override
    public void delete(String id) {
        experienceRestTemplate.delete("/api/games/{id}", id);
        gameplaysRestTemplate.delete("/api/ganes/{id}", id);
    }
}
