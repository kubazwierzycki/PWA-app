package pl.edu.pg.eti.games.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Used as a GET response for a game representation
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
@ToString
public class GetGame {
    private String id;
    private String name;
    private boolean isTurnBased;
    private int time;
}
