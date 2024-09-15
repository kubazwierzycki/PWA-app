package pl.edu.pg.eti.playrooms.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.edu.pg.eti.playrooms.entity.Playroom;

import java.util.UUID;

/**
 * Used to represent operation details
 */
@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class Operation {
    private String type;

    private Playroom.Player player;
}
