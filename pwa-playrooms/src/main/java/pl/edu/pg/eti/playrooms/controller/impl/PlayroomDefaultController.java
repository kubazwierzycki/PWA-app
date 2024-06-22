package pl.edu.pg.eti.playrooms.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import pl.edu.pg.eti.playrooms.controller.api.PlayroomController;
import pl.edu.pg.eti.playrooms.service.api.PlayroomService;

@Controller
public class PlayroomDefaultController implements PlayroomController {

    private final PlayroomService playroomService;

    @Autowired
    public PlayroomDefaultController(PlayroomService playroomService) {
        this.playroomService = playroomService;
    }

    @Override
    public void createNewPlayroom() {

    }

    @Override
    public void handleWebSocketMessage(String message, SimpMessageHeaderAccessor headerAccessor) {

    }
}
