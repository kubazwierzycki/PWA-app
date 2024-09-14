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
 * Used as GET response to represent gameplays
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class GetGameplays {
    private List<Gameplay> gameplays;

    @Getter
    @Setter
    @AllArgsConstructor(access= AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Builder
    public static class Gameplay {
        private UUID uuid;

        private String date;

        private String winner;

        private String game;

        private List<String> players;
    }
}

