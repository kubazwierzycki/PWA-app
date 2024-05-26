package pl.edu.pg.eti.users.event.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.event.api.UserEventRepository;

import java.util.UUID;

@Repository
public class UserDefaultEventRepository implements UserEventRepository {

    private final RestTemplate restTemplate;

    @Autowired
    public UserDefaultEventRepository(@Qualifier("experienceRestTemplate") RestTemplate experienceRestTemplate) {
        this.restTemplate = experienceRestTemplate;
    }

    @Override
    public void create(UUID uuid, PutUser request) {
        restTemplate.put("/api/users/{uuid}", request, uuid);
    }

    @Override
    public void delete(UUID uuid) {
        restTemplate.delete("/api/users/{uuid}", uuid);
    }


}
