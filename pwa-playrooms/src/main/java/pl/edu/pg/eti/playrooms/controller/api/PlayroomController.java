package pl.edu.pg.eti.playrooms.controller.api;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.socket.WebSocketSession;
import pl.edu.pg.eti.playrooms.dto.GetPlayrooms;
import pl.edu.pg.eti.playrooms.dto.PlayroomInfo;
import pl.edu.pg.eti.playrooms.dto.PutPlayroom;
import pl.edu.pg.eti.playrooms.dto.PutPlayroomQueue;
import pl.edu.pg.eti.playrooms.entity.Playroom;

import java.util.List;

/**
 * The controller used for the {@link Playroom} entity
 */
public interface PlayroomController {

    /**
     * POST request to create a new playroom
     * @return general playroom info
     */
    @PostMapping("/api/playrooms")
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    ResponseEntity<PlayroomInfo> createNewPlayroom();

    /**
     * PUT request to update the playroom details
     * @param playroomId - playroom ID
     * @param request - playroom details {@link PutPlayroom}
     */
    @PutMapping("/api/playrooms/{playroomId}")
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    void updatePlayroom(
            @PathVariable("playroomId") String playroomId,
            @RequestBody PutPlayroom request
    );

    /**
     * Get all active playrooms
     * @return list of all playrooms
     */
    @GetMapping("/api/playrooms")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    GetPlayrooms getPlayrooms();

    /**
     * Put request to update playroom queue
     * @param playroomId - playroom ID
     * @param request - players queue
     */
    @PutMapping("/api/playrooms/{playroomId}/queue")
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    void updatePlayroomQueue(
            @PathVariable("playroomId") String playroomId,
            @RequestBody PutPlayroomQueue request
    );


    /**
     * Join the waiting room
     * @param webSocketSession - communication client-server
     * @param message - message with all details
     *                {
     *                  "operation": "joinWaitingRoom",
     *                  "playroomId": --playroomUUID--,
     *                  "player": {
     *                      "id": --userUID-- (null if not registered),
     *                      "username": --username--
     *                  }
     *                }
     */
    void joinWaitingRoom(WebSocketSession webSocketSession, JSONObject message);

    /**
     * Close the waiting room for joining new players
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "closeWaitingRoom",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void closeWaitingRoom(String sessionId, JSONObject message);

    /**
     * Finish the waiting room and go to the playroom
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "finishWaitingRoom",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void finishWaitingRoom(String sessionId, JSONObject message);

    /**
     * Join the playroom
     * @param webSocketSession - communication client-server
     * @param message - message with all details
     *                {
     *                  "operation": "joinPlayroom",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void joinPlayroom(WebSocketSession webSocketSession, JSONObject message);

    /**
     * Quit the playroom
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "quitPlayroom",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void quitPlayroom(String sessionId, JSONObject message);

    /**
     * End the current turn
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "endTurn",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void endTurn(String sessionId, JSONObject message);

    /**
     * Vote for a game pause
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "pause",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void pause(String sessionId, JSONObject message);

    /**
     * Start the game (or continue after pause)
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "start",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void start(String sessionId, JSONObject message);

    /**
     * Win the game
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "win",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void win(String sessionId, JSONObject message);

    /**
     * End the game with a tie
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "endGame",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void endGame(String sessionId, JSONObject message);

    /**
     * Get game status
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "status",
     *                  "playroomId": --playroomUUID--
     *                }
     */
    void status(String sessionId, JSONObject message);

    /**
     * Confirm the operation
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "confirm",
     *                  "playroomId": --playroomUUID--,
     *                  "operationId": --operationID--
     *                }
     */
    void confirm(String sessionId, JSONObject message);

    /**
     * Reject the operation
     * @param sessionId - websocket session ID
     * @param message - message with all details
     *                {
     *                  "operation": "reject",
     *                  "playroomId": --playroomUUID--,
     *                  "operationId": --operationID--
     *                }
     */
    void reject(String sessionId, JSONObject message);


}
