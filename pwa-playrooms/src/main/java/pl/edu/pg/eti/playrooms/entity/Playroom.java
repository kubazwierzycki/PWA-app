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

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="experience")
public class Playroom implements Serializable {

    @Id
    private UUID uuid;

    private boolean isGlobalTimer;

    private boolean paused;

    private int currentPlayer;

    private LocalDate startDate;

    private LocalDate endDate;

    private Double globalTimer;

    private Game game;

    @ElementCollection
    private Map<Integer, Player> players;

    @Embeddable
    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    private static class Player {
        private UUID uuid;
        private String username;
        private Double timer;
        private boolean host;
        private boolean guest;
    }

    @Embeddable
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    private static class Game {
        private String id;
        private String name;
    }
}
