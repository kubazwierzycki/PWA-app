package pl.edu.pg.eti.gameplays.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

/**
 * Used as PUT request to represent gameplay
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class PutGameplay {
    private UUID uuid;

    private String winner;

    private Game game;

    private List<Player> players;

    @Getter
    @Setter
    @AllArgsConstructor(access= AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Builder
    public static class Game {
        private String id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor(access= AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Builder
    public static class Player {
        private UUID uuid;
        private String name;
    }
}

