package pl.edu.pg.eti.games.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * The entity represents a game with default settings
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="games")
public class Game implements Serializable {

    /**
     * Game's ID - the same as BGG game ID
     */
    @Id
    private String id;

    /**
     * Game name
     */
    private String name;

}
