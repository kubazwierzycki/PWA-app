package pl.edu.pg.eti.users.initialize;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.service.api.UserService;
import pl.edu.pg.eti.users.utils.SecurityProvider;

import java.util.UUID;

/**
 * Initialize test data
 */
@Component
public class InitializeData implements InitializingBean {

    private final UserService userService;

    @Autowired
    public InitializeData(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        userService.create(
                User.builder()
                        .uuid(UUID.randomUUID())
                        .email("email1")
                        .username("user1")
                        .password(SecurityProvider.calculateSHA256("password1"))
                        .bggUsername("bgg1")
                        .token(null)
                        .build()
        );
        userService.create(
                User.builder()
                        .uuid(UUID.randomUUID())
                        .email("email2")
                        .username("user2")
                        .password(SecurityProvider.calculateSHA256("password2"))
                        .bggUsername("bgg2")
                        .token(null)
                        .build()
        );
        userService.create(
                User.builder()
                        .uuid(UUID.randomUUID())
                        .email("email3")
                        .username("user3")
                        .password(SecurityProvider.calculateSHA256("password3"))
                        .bggUsername("bgg3")
                        .token(null)
                        .build()
        );
    }
}