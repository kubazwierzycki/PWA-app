package pl.edu.pg.eti.users.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pl.edu.pg.eti.users.entity.User;
import pl.edu.pg.eti.users.service.api.UserService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class BggRankingManager {

    private final String bggApiUrl;
    private final UserService userService;

    @Autowired
    public BggRankingManager(@Value("${bgg.api.url}") String bggApiUrl, UserService userService) {
        this.bggApiUrl = bggApiUrl;
        this.userService = userService;
    }

    /**
     * Get user games ranking based on BGG
     * @param userUuid - user ID
     * @return list of owned bgg games with rating
     */
    public List<User.GameRanking> getNewGameRanking(String userUuid) {
        User user = userService.find(UUID.fromString(userUuid)).orElse(null);
        if (user == null || user.getBggUsername() == null) {
            return new ArrayList<>();
        }
        else {
            List<User.GameRanking> ranking = new ArrayList<>();

            Map<String, Double> dictionaryRating = getUserGamesWithRating(user.getBggUsername(), "own");
            dictionaryRating.putAll(getUserGamesWithRating(user.getBggUsername(), "played"));
            for (String id : dictionaryRating.keySet()) {
                ranking.add(new User.GameRanking(id, dictionaryRating.get(id), 0));
            }

            return ranking;
        }
    }

    /**
     * Update user ranking with new BGG games
     * @param userUuid - user ID
     * @return list of owned bgg games with rating
     */
    public List<User.GameRanking> updateGameRanking(String userUuid) {
        User user = userService.find(UUID.fromString(userUuid)).orElse(null);
        if (user == null || user.getBggUsername() == null) {
            return new ArrayList<>();
        }
        else {
            List<User.GameRanking> userRanking = user.getRanking();
            Map<String, Double> gamesWithRating = getUserGamesWithRating(user.getBggUsername(), "own");
            gamesWithRating.putAll(getUserGamesWithRating(user.getBggUsername(), "played"));
            List<User.GameRanking> ranking = new ArrayList<>();

            for (String gameId : gamesWithRating.keySet()) {
                boolean exist = false;
                for (User.GameRanking game : userRanking) {
                    if (gameId.equals(game.getGameId())) {
                        ranking.add(new User.GameRanking(gameId, game.getRating(), game.getNumberOfCompares()));
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    ranking.add(new User.GameRanking(gameId, gamesWithRating.get(gameId), 0));
                }
            }
            return ranking;
        }
    }

    /**
     * Get BGG rating of the games
     * @param username - BGG username
     * @param option - own / played
     * @return  Map (game ID: game rating)
     */
    private Map<String, Double> getUserGamesWithRating(String username, String option) {
        Map<String, Double> result = new HashMap<>();
        try {
            URL url = new URL(bggApiUrl + "/collection?username=" + username + "&" +
                    option + "=1&stats=1&subtype=boardgame&excludesubtype=boardgameexpansion");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            String gameId = null;
            while ((inputLine = in.readLine()) != null) {
                if (inputLine.contains("<item") && inputLine.contains("objectid=")) {
                    Pattern pattern = Pattern.compile("objectid=\"(\\d+)\"");
                    Matcher matcher = pattern.matcher(inputLine);

                    if (matcher.find()) {
                        gameId = matcher.group(1);
                    }
                }
                else if (gameId != null && inputLine.contains("<rating") && inputLine.contains("value=")
                        && !inputLine.contains("value=\"N/A\"")) {
                    Pattern pattern = Pattern.compile("value=\"(\\d+)\"");
                    Matcher matcher = pattern.matcher(inputLine);

                    if (matcher.find()) {
                        result.put(gameId, Double.valueOf(matcher.group(1)));
                        gameId = null;
                    }
                }
                else if (gameId != null && inputLine.contains("<average value=")) {
                    Pattern pattern = Pattern.compile("<average value=\"(\\d{1,2}(\\.\\d+)?)\"");
                    Matcher matcher = pattern.matcher(inputLine);
                    if (matcher.find()) {
                        result.put(gameId, Double.valueOf(matcher.group(1)));
                        gameId = null;
                    }
                }
            }
            in.close();
            connection.disconnect();
        } catch (IOException ex) {
            System.err.println("Connection failed: list of games ID");
        }
        return result;
    }

}
