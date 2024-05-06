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
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

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

    /**
     * The ranking with the most popular timer settings for the game
     */
    @ElementCollection
    @OrderBy("popularity DESC")
    private List<TimerSettings> mostPopularTimers;

    /**
     * Add new timer settings or increase popularity of old one
     * @param timerSettings - timer details
     */
    public void addTimerSettings(TimerSettings timerSettings) {

        if (mostPopularTimers.size() >= 10) {
            mostPopularTimers = mostPopularTimers.subList(0, 5);
        }

        if (mostPopularTimers.contains(timerSettings)) {
            int index = mostPopularTimers.indexOf(timerSettings);
            timerSettings = mostPopularTimers.get(index);
            timerSettings.upPopularity();
            mostPopularTimers.set(index, timerSettings);
        }
        else {
            mostPopularTimers.add(timerSettings);
        }
    }

    @Embeddable
    @Getter
    @NoArgsConstructor
    public static class TimerSettings {

        /**
         * Frequency of the settings
         */
        private int popularity;

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
            this.popularity = 1;
            this.isTimeTurnBased = isTimeTurnBased;
            this.time = time;
        }

        @Override
        public boolean equals(Object obj) {
            return obj.getClass() == this.getClass() &&
                    this.isTimeTurnBased == ((TimerSettings) obj).isTimeTurnBased &&
                    this.time == ((TimerSettings) obj).time;
        }

        public void upPopularity() {
            this.popularity++;
        }
    }
}
