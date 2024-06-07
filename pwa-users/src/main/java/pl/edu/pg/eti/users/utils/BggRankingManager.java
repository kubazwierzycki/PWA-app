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
            List<String> games = getUserGamesId(userUuid);
            List<User.GameRanking> ranking = new ArrayList<>();

            Map<String, Double> dictionaryRating = getGamesBggRating(games);
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
            List<String> games = getUserGamesId(userUuid);
            List<User.GameRanking> ranking = new ArrayList<>();

            for (String id : games) {
                boolean exist = false;
                for (User.GameRanking game : userRanking) {
                    if (id.equals(game.getGameId())) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    Double rating = getGameBggRating(id);
                    if (rating != null) {
                        ranking.add(new User.GameRanking(id, rating, 0));
                    }
                }
            }
            return ranking;
        }
    }

    /**
     * Get owned games from BGG
     * source: <a href="https://www.baeldung.com/java-http-request"/>
     * @param userUuid - user ID
     * @return list of owned bgg games (ID)
     */
    private List<String> getUserGamesId(String userUuid) {
        User user = userService.find(UUID.fromString(userUuid)).orElse(null);
        if (user == null || user.getBggUsername() == null) {
            return new ArrayList<>();
        }
        else {
            List<String> objectsId = new ArrayList<>();
            try {
                URL url = new URL(bggApiUrl + "/collection?username=" + user.getBggUsername() + "&own=1");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");

                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    if (inputLine.contains("<item") && inputLine.contains("objectid=")) {
                        Pattern pattern = Pattern.compile("objectid=\"(\\d+)\"");
                        Matcher matcher = pattern.matcher(inputLine);

                        if (matcher.find()) {
                            objectsId.add(matcher.group(1));
                        }
                    }
                }
                in.close();
                connection.disconnect();
            } catch (IOException ex) {
                System.err.println("Connection failed: userUuid: " + userUuid + ", bgg: " + user.getBggUsername());
            }
            return objectsId;
        }
    }

    /**
     * Get BGG rating of the game
     * source: <a href="https://www.baeldung.com/java-http-request"/>
     * @param gameId - game ID
     * @return game rating (Double) or null if not exists
     */
    private Double getGameBggRating(String gameId) {
        try {
            URL url = new URL(bggApiUrl + "/thing?id=" + gameId + "&stats=1");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                if (inputLine.contains("<average value=")) {
                    Pattern pattern = Pattern.compile("<average value=\"(\\d{1,2}(\\.\\d+)?)\"");
                    Matcher matcher = pattern.matcher(inputLine);
                    if (matcher.find()) {
                        return Double.valueOf(matcher.group(1));
                    }
                }
            }
            in.close();
            connection.disconnect();
        } catch (IOException ex) {
            System.err.println("Connection failed: gameId: " + gameId);
        }
        return null;
    }

    /**
     * Get BGG rating of the games
     * source: <a href="https://www.baeldung.com/java-http-request"/>
     * @param gamesId - list of games ID
     * @return Map (game ID: game rating)
     */
    private Map<String, Double> getGamesBggRating(List<String> gamesId) {
        if (gamesId.isEmpty()) {
            return new HashMap<>();
        }
        StringBuilder ids = new StringBuilder(gamesId.get(0));
        for (int i = 1; i < gamesId.size(); i++) {
            ids.append(",").append(gamesId.get(i));
        }
        Map<String, Double> result = new HashMap<>();

        try {
            URL url = new URL(bggApiUrl + "/thing?id=" + ids.toString() + "&stats=1");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            String id = null;
            while ((inputLine = in.readLine()) != null) {
                if (inputLine.contains("<item")) {
                    Pattern pattern = Pattern.compile("id=\"(\\d+)\"");
                    Matcher matcher = pattern.matcher(inputLine);
                    if (matcher.find()) {
                        id = matcher.group(1);
                    }
                }
                else if (id != null && inputLine.contains("<average value=")) {
                    Pattern pattern = Pattern.compile("<average value=\"(\\d{1,2}(\\.\\d+)?)\"");
                    Matcher matcher = pattern.matcher(inputLine);
                    if (matcher.find()) {
                        result.put(id, Double.valueOf(matcher.group(1)));
                        id = null;
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
