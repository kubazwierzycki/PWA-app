package pl.edu.pg.eti.experience.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.UUID;

/**
 * Used as a GET response to represent one or more statistic sets
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
@ToString
public class GetExperiences {
    @Getter
    @Setter
    @AllArgsConstructor(access= AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Builder
    @ToString
    public static class Experience {
        private UUID uuid;
        private UUID userUuid;
        private String username;
        private String gameId;
        private String game;
        private int numberOfPlays;
    }

    private List<Experience> experiences;
}
