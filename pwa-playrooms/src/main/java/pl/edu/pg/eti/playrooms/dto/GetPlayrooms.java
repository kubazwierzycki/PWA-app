package pl.edu.pg.eti.playrooms.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor(access= AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
public class GetPlayrooms {
    private List<Playroom> playrooms;

    @Getter
    @Setter
    @AllArgsConstructor(access= AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Builder
    public static class Playroom {
        private String id;
        private String game;
        private int numOfPlayers;
    }
}
