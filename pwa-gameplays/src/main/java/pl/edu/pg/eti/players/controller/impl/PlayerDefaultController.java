package pl.edu.pg.eti.players.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pg.eti.gameplays.entity.Gameplay;
import pl.edu.pg.eti.players.controller.api.PlayerController;
import pl.edu.pg.eti.players.dto.PutPlayer;
import pl.edu.pg.eti.players.entity.Player;
import pl.edu.pg.eti.players.service.api.PlayerService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
public class PlayerDefaultController implements PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerDefaultController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @Override
    public void putPlayer(UUID uuid, PutPlayer request) {
        Player player = playerService.find(uuid).orElse(null);

        List<Gameplay> gameplays = new ArrayList<>();
        if (player != null) {
            gameplays = player.getGameplays();
        }

        playerService.update(
                Player.builder()
                        .uuid(uuid)
                        .username(request.getUsername())
                        .gameplays(gameplays)
                        .build());
    }

    @Override
    public void deletePlayer(UUID uuid) {
        Player player = playerService.find(uuid).orElse(null);

        if (player == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        else {
            playerService.delete(uuid);
        }
    }
}
