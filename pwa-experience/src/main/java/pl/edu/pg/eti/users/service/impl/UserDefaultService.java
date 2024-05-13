package pl.edu.pg.eti.users.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.repository.api.UserRepository;
import pl.edu.pg.eti.users.service.api.UserService;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserDefaultService implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserDefaultService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<User> find(UUID uuid) {
        return userRepository.findById(uuid);
    }

    @Override
    public void create(User user) {
        userRepository.save(user);
    }

    @Override
    public void update(User user) {
        userRepository.save(user);
    }

    @Override
    public void delete(UUID uuid) {
        userRepository.findById(uuid).ifPresent(userRepository::delete);
    }
}
