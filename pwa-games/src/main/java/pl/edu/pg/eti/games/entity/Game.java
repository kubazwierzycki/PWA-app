package pl.edu.pg.eti.games.entity;

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

    /**
     * The ranking with the most popular timer settings for the game
     */
    @ElementCollection
    @OrderBy("position")
    private List<TimerSettings> mostPopularTimers;

    @Embeddable
    @NoArgsConstructor
    public static class TimerSettings {

        /**
         * Ranking position
         */
        private int position;

        /**
         * If the timer is counted for a round or game
         * True - timer for a round
         * False - timer for a game
         */
        private boolean isTimeTurnBased;

        /**
         * Time in seconds
         */
        private int time;

        public TimerSettings(boolean isTimeTurnBased, int time) {
            this.position = 5;
            this.isTimeTurnBased = isTimeTurnBased;
            this.time = time;
        }

        @Override
        public boolean equals(Object obj) {
            return obj.getClass() == this.getClass() &&
                    this.isTimeTurnBased == ((TimerSettings) obj).isTimeTurnBased &&
                    this.time == ((TimerSettings) obj).time;
        }

        public void upPosition() {
            if (position >= 2) {
                this.position--;
            }
        }

        public void downPosition() {
            this.position++;
        }
    }
}
