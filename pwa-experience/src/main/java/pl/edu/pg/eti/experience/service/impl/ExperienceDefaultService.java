package pl.edu.pg.eti.experience.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.experience.entity.Experience;
import pl.edu.pg.eti.experience.repository.api.ExperienceRepository;
import pl.edu.pg.eti.experience.service.api.ExperienceService;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.users.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExperienceDefaultService implements ExperienceService {

    private final ExperienceRepository experienceRepository;

    @Autowired
    public ExperienceDefaultService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @Override
    public Optional<Experience> find(UUID uuid) {
        return experienceRepository.findById(uuid);
    }

    @Override
    public Optional<Experience> findByUserAndGame(User user, Game game) {
        return experienceRepository.findByUserAndGame(user, game);
    }

    @Override
    public List<Experience> findByUser(User user) {
        return experienceRepository.findByUser(user);
    }

    @Override
    public List<Experience> findByGame(Game game) {
        return experienceRepository.findByGame(game);
    }

    @Override
    public List<Experience> findAll() {
        return experienceRepository.findAll();
    }

    @Override
    public void create(Experience experience) {
        experienceRepository.save(experience);
    }

    @Override
    public void update(Experience experience) {
        experienceRepository.save(experience);
    }

    @Override
    public void delete(UUID uuid) {
        experienceRepository.findById(uuid).ifPresent(experienceRepository::delete);
    }
}
