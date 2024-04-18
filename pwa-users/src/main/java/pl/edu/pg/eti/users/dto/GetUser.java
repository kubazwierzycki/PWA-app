package pl.edu.pg.eti.users.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor(access=AccessLevel.PRIVATE)
@NoArgsConstructor
@Builder
@ToString
public class GetUser {
    private UUID uuid;
    private String email;
    private String username;
    private String bggUsername;
}
