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
import java.util.List;
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
     * Get owned games from BGG
     * source: <a href="https://www.baeldung.com/java-http-request"/>
     * source: <a href="https://www.baeldung.com/java-convert-string-xml-dom"/>
     * @param userUuid - user ID
     * @return list of owned bgg games (ID)
     */
    public List<String> getUserGamesId(String userUuid) {
        User user = userService.find(UUID.fromString(userUuid)).orElse(null);
        if (user == null || user.getBggUsername() == null) {
            return new ArrayList<>();
        }
        else {
            List<String> objectsId = new ArrayList<>();
            try {
                URL url = new URL(bggApiUrl + "/xmlapi2/collection?username=" + user.getBggUsername() + "&own=1");
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
     * source: <a href="https://www.baeldung.com/java-convert-string-xml-dom"/>
     * @param gameId - game ID
     * @return game rating (Double) or null if not exists
     */
    public Double getGameBggRating(String gameId) {
        try {
            URL url = new URL(bggApiUrl + "/xmlapi2/thing?id=" + gameId + "&stats=1");
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

}
