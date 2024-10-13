package pl.edu.pg.eti.playrooms.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

/**
 * Used as PUT request to update playroom queue
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class PutPlayroomQueue {

    private List<Player> players;

    @Getter
    @Setter
    @AllArgsConstructor(access= AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Builder
    public static class Player {
        private UUID playerId;
    }
}
