package pl.edu.pg.eti.users.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.users.dto.PutUser;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.event.api.UserEventRepository;
import pl.edu.pg.eti.users.repository.api.UserRepository;
import pl.edu.pg.eti.users.service.api.UserService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserDefaultService implements UserService {

    private final UserRepository userRepository;
    private final UserEventRepository userEventRepository;

    @Autowired
    public UserDefaultService(UserRepository userRepository, UserEventRepository userEventRepository) {
        this.userRepository = userRepository;
        this.userEventRepository = userEventRepository;
    }

    @Override
    public Optional<User> find(UUID uuid) {
        return userRepository.findById(uuid);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> findByUsernamePattern(String pattern) {
        return userRepository.findByUsernameContainingIgnoreCase(pattern);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void create(User user) {
        userRepository.save(user);
        userEventRepository.create(user.getUuid(),
                PutUser.builder()
                        .bggUsername(user.getBggUsername())
                        .build());
    }

    @Override
    public void update(User user) {
        userRepository.save(user);
        userEventRepository.create(user.getUuid(),
                PutUser.builder()
                        .bggUsername(user.getBggUsername())
                        .build());
    }

    @Override
    public void delete(UUID uuid) {
        userRepository.findById(uuid).ifPresent(userRepository::delete);
        userEventRepository.delete(uuid);
    }
}
