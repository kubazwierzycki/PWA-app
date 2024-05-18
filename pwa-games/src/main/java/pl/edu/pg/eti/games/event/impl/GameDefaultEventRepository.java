package pl.edu.pg.eti.games.event.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import pl.edu.pg.eti.games.dto.PutGame;
import pl.edu.pg.eti.games.event.api.GameEventRepository;

@Repository
public class GameDefaultEventRepository implements GameEventRepository {

    private final RestTemplate restTemplate;

    @Autowired
    public GameDefaultEventRepository(@Qualifier("experienceRestTemplate") RestTemplate experienceRestTemplate) {
        this.restTemplate = experienceRestTemplate;
    }

    @Override
    public void create(String id, PutGame request) {
        restTemplate.put("/api/games/{id}", request, id);
    }

    @Override
    public void delete(String id) {
        restTemplate.delete("/api/games/{id}", id);
    }
}
