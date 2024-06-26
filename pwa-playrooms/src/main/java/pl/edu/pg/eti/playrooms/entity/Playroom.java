package pl.edu.pg.eti.playrooms.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.Map;
import java.util.UUID;

/**
 * The entity represents the playroom
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="playrooms")
public class Playroom implements Serializable {

    /**
     * Playroom ID
     */
    @Id
    private UUID uuid;

    /**
     * If timer settings are global
     */
    private boolean isGlobalTimer;

    /**
     * If playroom is currently paused
     */
    private boolean paused;

    /**
     * Player number in the play queue
     */
    private int currentPlayer;

    /**
     * The time of last operation
     */
    private LocalTime lastOperationTime;

    /**
     * Timer (in seconds) for whole playroom
     */
    private Double globalTimer;

    /**
     * Played game
     */
    private Game game;

    /**
     * Players in the playroom
     */
    @ElementCollection(fetch = FetchType.EAGER)
    private Map<Integer, Player> players;

    @Embeddable
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Player {
        /**
         * User ID
         * null if guest
         */
        private UUID uuid;

        /**
         * Username
         */
        private String username;

        /**
         * Timer (in seconds) for specific player
         */
        private Double timer;

        /**
         * If player is host of playroom
         */
        private boolean host;

        /**
         * If user is not registered
         */
        private boolean guest;

        /**
         * Player webSocket session ID
         */
        private String webSocketSessionId;
    }

    @Embeddable
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Game {
        /**
         * Game ID
         */
        private String id;
        /**
         * Game name
         */
        private String name;
    }
}
