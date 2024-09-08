package pl.edu.pg.eti.gameplays.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.players.entity.Player;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="gameplays")
public class Gameplay implements Serializable {

    @Id
    private UUID uuid;

    private LocalDate date;

    private String winner;

    @ManyToOne
    @JoinColumn(name="host_id")
    private Player host;

    @ManyToOne
    @JoinColumn(name="game_id")
    private Game game;

    @ManyToMany
    private List<Player> registeredPlayers;

    @ElementCollection
    private List<String> anonymousPlayers;
}
