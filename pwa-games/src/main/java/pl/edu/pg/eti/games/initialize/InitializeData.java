package pl.edu.pg.eti.games.initialize;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.edu.pg.eti.games.entity.Game;
import pl.edu.pg.eti.games.service.api.GameService;

import java.util.ArrayList;

/**
 * Initialize test data
 */
@Component
public class InitializeData implements InitializingBean {

    private final GameService gameService;

    @Autowired
    public InitializeData(GameService gameService) {
        this.gameService = gameService;
    }

    @Override
    public void afterPropertiesSet() {
        Game game1 = new Game("1", "game 1", new ArrayList<>());
        game1.addTimerSettings(new Game.TimerSettings(true, 100));
        game1.addTimerSettings(new Game.TimerSettings(true, 100));
        game1.addTimerSettings(new Game.TimerSettings(true, 100));
        game1.addTimerSettings(new Game.TimerSettings(false, 50));
        game1.addTimerSettings(new Game.TimerSettings(false, 50));
        gameService.create(game1);

        Game game2 = new Game("2", "game 2", new ArrayList<>());
        game2.addTimerSettings(new Game.TimerSettings(false, 100));
        game2.addTimerSettings(new Game.TimerSettings(false, 100));
        game2.addTimerSettings(new Game.TimerSettings(false, 100));
        game2.addTimerSettings(new Game.TimerSettings(true, 50));
        game2.addTimerSettings(new Game.TimerSettings(true, 10));
        gameService.create(game2);

        Game game3 = new Game("3", "game 3", new ArrayList<>());
        game3.addTimerSettings(new Game.TimerSettings(false, 100));
        game3.addTimerSettings(new Game.TimerSettings(false, 100));
        game3.addTimerSettings(new Game.TimerSettings(false, 50));
        game3.addTimerSettings(new Game.TimerSettings(false, 50));
        game3.addTimerSettings(new Game.TimerSettings(false, 50));
        gameService.create(game3);

        Game game4 = new Game("4", "game 4", new ArrayList<>());
        game4.addTimerSettings(new Game.TimerSettings(true, 10));
        gameService.create(game4);
    }
}
