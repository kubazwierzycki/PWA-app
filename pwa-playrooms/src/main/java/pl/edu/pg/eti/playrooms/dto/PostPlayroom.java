package pl.edu.pg.eti.playrooms.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Used as a POST request to create a new playroom
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode
public class PostPlayroom {
    private String gameId;
    private String game;
    private boolean isGlobalTimer;
    private Double timer;
}
