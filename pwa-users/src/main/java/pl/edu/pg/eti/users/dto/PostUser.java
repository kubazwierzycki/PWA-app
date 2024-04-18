package pl.edu.pg.eti.users.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Used as a POST request to create a new user
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EqualsAndHashCode
public class PostUser {

    @ToString.Exclude
    private String email;

    private String username;

    @ToString.Exclude
    private String password;

    private String bggUsername;
}
