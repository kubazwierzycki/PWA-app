package pl.edu.pg.eti.users.event.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import pl.edu.pg.eti.users.dto.PutPlayer;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.event.api.UserEventRepository;

import java.util.UUID;

@Repository
public class UserDefaultEventRepository implements UserEventRepository {

    private final RestTemplate experienceRestTemplate;
    private final RestTemplate gameplaysRestTemplate;

    @Autowired
    public UserDefaultEventRepository(@Qualifier("experienceRestTemplate") RestTemplate experienceRestTemplate,
                                      @Qualifier("gameplaysRestTemplate") RestTemplate gameplaysRestTemplate) {
        this.experienceRestTemplate = experienceRestTemplate;
        this.gameplaysRestTemplate = gameplaysRestTemplate;
    }

    @Override
    public void create(UUID uuid, PutUser request) {
        experienceRestTemplate.put("/api/users/{uuid}", request, uuid);
        gameplaysRestTemplate.put("/api/players/{uuid}",
                PutPlayer.builder()
                        .username(request.getUsername())
                        .build(), uuid);
    }

    @Override
    public void delete(UUID uuid) {
        experienceRestTemplate.delete("/api/users/{uuid}", uuid);
        gameplaysRestTemplate.delete("/api/players/{uuid}", uuid);
    }


}
