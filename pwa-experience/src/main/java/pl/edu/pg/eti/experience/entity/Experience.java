package pl.edu.pg.eti.experience.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.users.entity.User;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

/**
 * The entity represents the game statistics associated with a user
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="experience")
public class Experience implements Serializable {

    /**
     * User experience ID
     */
    @Id
    private UUID uuid;

    /**
     * An associated user
     */
    @ManyToOne
    @JoinColumn(name="user")
    private User user;

    /**
     * An associated game
     */
    @ManyToOne
    @JoinColumn(name="game")
    private Game game;

    /**
     * How many times the user played the game
     */
    private int numberOfPlays;

    /**
     * How many times the user won the game
     */
    private int numberOfWins;

    /**
     * YYYY-MM-DD
     * Date of the first play
     */
    private LocalDate firstPlay;

    /**
     * YYYY-MM-DD
     * Date of the last play
     */
    private LocalDate lastPlay;

    /**
     * Average rating (1-10) of plays
     */
    private double avgRating;

}
