package pl.edu.pg.eti.users.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
     * Unique username in the system
     */
    private String username;

    /**
     * The BoardGeekGame username associated with the user
     */
    private String bggUsername;

}
