package pl.edu.pg.eti.users.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

/**
 * The entity represents a registered user
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="users")
public class User implements Serializable {

    /**
     * User's ID
     */
    @Id
    private UUID uuid;

    /**
     * User email address
     */
    @ToString.Exclude
    private String email;

    /**
     * Unique username in the system
     */
    private String username;

    /**
     * Hashed user password
     */
    @ToString.Exclude
    private String password;

    /**
     * Hashed session token
     */
    @ToString.Exclude
    private String token;

    /**
     * The BoardGeekGame username associated with the user
     */
    private String bggUsername;

    /**
     * User's BGG games ranking
     */
    @ElementCollection
    @ToString.Exclude
    @OrderBy("rating DESC")
    private List<GameRanking> ranking;

    @Embeddable
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GameRanking {
        /**
         * Game ID
         */
        private String gameId;
        /**
         * Game rating (BGG and user)
         */
        private double rating;
        /**
         * How many times the game was compared with another
         */
        private int numberOfCompares;
    }

}
