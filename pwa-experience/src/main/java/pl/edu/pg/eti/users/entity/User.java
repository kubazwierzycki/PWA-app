package pl.edu.pg.eti.users.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import pl.edu.pg.eti.experience.entity.Experience;

import java.io.Serializable;
import java.util.List;
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

    @OneToMany(mappedBy="user", cascade=CascadeType.REMOVE)
    @ToString.Exclude
    private List<Experience> userExperience;

}
