package pl.edu.pg.eti.playrooms.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.playrooms.entity.Playroom;
import pl.edu.pg.eti.playrooms.repository.api.PlayroomRepository;
import pl.edu.pg.eti.playrooms.service.api.PlayroomService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlayroomDefaultService implements PlayroomService {

    private final PlayroomRepository playroomRepository;

    @Autowired
    public PlayroomDefaultService(PlayroomRepository playroomRepository) {
        this.playroomRepository = playroomRepository;
    }

    @Override
    public Optional<Playroom> find(UUID uuid) {
        return playroomRepository.findByUuid(uuid);
    }

    @Override
    public List<Playroom> findByPaused(boolean paused) {
        return playroomRepository.findByPaused(paused);
    }

    @Override
    public List<Playroom> findAll() {
        return playroomRepository.findAll();
    }

    @Override
    public void create(Playroom playroom) {
        playroomRepository.save(playroom);
    }

    @Override
    public void update(Playroom playroom) {
        playroomRepository.save(playroom);
    }

    @Override
    public void delete(UUID uuid) {
        playroomRepository.findByUuid(uuid).ifPresent(playroomRepository::delete);
    }
}
