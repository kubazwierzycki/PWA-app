package pl.edu.pg.eti.users.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="users")
public class User implements Serializable {

    @Id
    private UUID uuid;

    @ToString.Exclude
    private String email;

    private String username;

    @ToString.Exclude
    private String password;

    private String bggUsername;

}
