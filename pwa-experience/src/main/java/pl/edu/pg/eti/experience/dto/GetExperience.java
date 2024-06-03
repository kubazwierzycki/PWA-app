package pl.edu.pg.eti.experience.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Used as a GET response for statistics
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
@ToString
public class GetExperience {
    private UUID uuid;
    private UUID userUuid;
    private String username;
    private String gameId;
    private String game;
    private int numberOfPlays;
    private int numberOfWins;
    private LocalDate firstPlay;
    private LocalDate lastPlay;
    private double avgRating;

}
