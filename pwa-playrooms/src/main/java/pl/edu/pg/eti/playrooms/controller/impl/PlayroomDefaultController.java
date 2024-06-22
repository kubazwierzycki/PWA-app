package pl.edu.pg.eti.playrooms.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.WebSocketSession;
import pl.edu.pg.eti.playrooms.controller.api.PlayroomController;
import pl.edu.pg.eti.playrooms.service.api.PlayroomService;

import java.util.HashMap;
import java.util.Map;

@Controller
public class PlayroomDefaultController implements PlayroomController {

    private final PlayroomService playroomService;
    private final Map<String, WebSocketSession> sessions;

    @Autowired
    public PlayroomDefaultController(PlayroomService playroomService) {
        this.playroomService = playroomService;
        this.sessions = new HashMap<>();
    }

    @Override
    public void createNewPlayroom() {

    }
}
