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

/**
 * The entity represents a registered user
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name="users")
public class User implements Serializable {

    /**
     * User's ID
     */
    @Id
    private UUID uuid;

    /**
     * User email address
     */
    @ToString.Exclude
    private String email;

    /**
     * Unique username in the system
     */
    private String username;

    /**
     * Hashed user password
     */
    @ToString.Exclude
    private String password;

    /**
     * Hashed session token
     */
    @ToString.Exclude
    private String token;

    /**
     * The BoardGeekGame username associated with the user
     */
    private String bggUsername;

}
