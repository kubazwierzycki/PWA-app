package pl.edu.pg.eti.playrooms.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.io.Serializable;
import java.time.LocalDate;
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
     * The date of the creation
     */
    private LocalDate startDate;

    /**
     * The date of the end
     */
    private LocalDate endDate;

    /**
     * Timer (in seconds) for whole playroom
     * null if not exists
     */
    private Double globalTimer;

    /**
     * Played game
     */
    private Game game;

    /**
     * Players in the playroom
     */
    @ElementCollection
    private Map<Integer, Player> players;

    @Embeddable
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    private static class Player {
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
         * Player webSocket session
         */
        private WebSocketSession webSocketSession;
    }

    @Embeddable
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    private static class Game {
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
