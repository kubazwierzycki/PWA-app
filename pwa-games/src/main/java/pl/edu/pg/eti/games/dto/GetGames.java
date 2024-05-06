package pl.edu.pg.eti.games.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * Used as a GET response to represent one or more games
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
@ToString
public class GetGames {
    @Getter
    @Setter
    @AllArgsConstructor(access= AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Builder
    @ToString
    public static class Game {
        private String id;
        private String name;
    }

    private List<Game> games;
}
