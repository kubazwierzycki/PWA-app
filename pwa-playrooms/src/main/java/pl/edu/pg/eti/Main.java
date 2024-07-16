package pl.edu.pg.eti;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    public RestTemplate gamesRestTemplate(@Value("${games.url}") String gamesUrl) {
        return new RestTemplateBuilder().rootUri(gamesUrl).build();
    }

    @Bean
    public RestTemplate experienceRestTemplate(@Value("${experience.url}") String experienceUrl) {
        return new RestTemplateBuilder().rootUri(experienceUrl).build();
    }
}
