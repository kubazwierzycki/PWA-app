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
            @Value("${gameplays.url}") String gameplaysUrl) {
        return builder.routes()
                .route("users", route -> route
                        .host(gateway)
                        .and()
                        .path("/api/users/{uuid}", "/api/types")
                        .uri(usersUrl)
                )
                .route("gameplays", route -> route
                        .host(gateway)
                        .and()
                        .path("/api/gameplays/{uuid}", "/api/gameplays")
                        .uri(gameplaysUrl)
                )
                .build();
    }
}
