package pl.edu.pg.eti;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    // all services with open API need to have routing set
    @Bean
    public RouteLocator routeLocator(
            RouteLocatorBuilder builder,
            @Value("${gateway.host}") String gateway,
            @Value("${users.url}") String usersUrl,
            @Value("${gameplays.url}") String gameplaysUrl,
            @Value("${games.url}") String gamesUrl,
            @Value("${playrooms.url}") String playroomsUrl,
            @Value("${ws-playrooms.url}") String wsPlayroomsUrl,
            @Value("${experience.url}") String experienceUrl) {
        return builder.routes()
                .route("users", route -> route
                        .host(gateway)
                        .and()
                        .path("/api/users/**",
                                "/api/users"
                        )
                        .uri(usersUrl)
                )
                .route("gameplay", route -> route
                        .host(gateway)
                        .and()
                        .path("/api/gameplay/{uuid}",
                                "/api/gameplay",
                                "/api/gameplay/player/{uuid}"
                        )
                        .uri(gameplaysUrl)
                )
                .route("games", route -> route
                        .host(gateway)
                        .and()
                        .path("/api/games/**",
                                "/api/games"
                        )
                        .uri(gamesUrl)
                )
                .route("playrooms", route -> route
                        .host(gateway)
                        .and()
                        .path("/api/playrooms/**",
                                "/api/playrooms"
                        )
                        .uri(playroomsUrl)
                )
                .route("ws-playrooms", route -> route
                        .host(gateway)
                        .and()
                        .path("/ws-playrooms")
                        .uri(wsPlayroomsUrl)
                )
                .route("experience", route -> route
                        .host(gateway)
                        .and()
                        .path("/api/experience/**",
                                "/api/experience"
                        )
                        .uri(experienceUrl)
                )
                .build();
    }
}
