package pl.edu.pg.eti.playrooms.controller.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.WebSocketSession;
import pl.edu.pg.eti.playrooms.controller.api.PlayroomController;
import pl.edu.pg.eti.playrooms.service.api.PlayroomService;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Controller
public class PlayroomDefaultController implements PlayroomController {

    private final PlayroomService playroomService;
    private final Map<String, WebSocketSession> webSocketSessions;

    @Autowired
    public PlayroomDefaultController(PlayroomService playroomService) {
        this.playroomService = playroomService;
        webSocketSessions = Collections.synchronizedMap(new HashMap<>());
    }

    @Override
    public void createNewPlayroom() {

    }

    @Override
    public void joinPlayroom(WebSocketSession webSocketSession, JSONObject message) {

    }

    @Override
    public void quitPlayroom(String sessionId, JSONObject message) {

    }

    @Override
    public void endTurn(String sessionId, JSONObject message) {

    }

    @Override
    public void pause(String sessionId, JSONObject message) {

    }

}
