package pl.edu.pg.eti.users.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * Used as a GET response for a user ranking
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
@ToString
public class GetRanking {
    private List<GameRanking> ranking;

    public static class GameRanking {
        private String gameId;
        private double rating;
        private int numberOfCompares;
    }
}
