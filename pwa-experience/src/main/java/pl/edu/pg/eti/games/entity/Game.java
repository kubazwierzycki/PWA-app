package pl.edu.pg.eti.games.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import pl.edu.pg.eti.experience.entity.Experience;

import java.io.Serializable;
import java.util.List;

/**
 * The entity represents a game with default settings
 */
@Getter
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

    @OneToMany(mappedBy="game", cascade= CascadeType.REMOVE)
    @ToString.Exclude
    private List<Experience> gameExperience;

}
