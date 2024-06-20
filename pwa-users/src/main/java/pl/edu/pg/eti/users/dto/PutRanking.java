package pl.edu.pg.eti.users.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Used as a PUT request to update user ranking
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode
public class PutRanking {
    private List<GameRanking> ranking;

    @Getter
    public static class GameRanking {
        private String gameId;
        private double rating;
        private int numberOfCompares;
    }
}
