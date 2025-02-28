package ecma.demo.storeapplication.entity;

import ecma.demo.storeapplication.entity.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Role")
public class Role implements GrantedAuthority {

    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name",nullable = false)
    private RoleName roleName;

    private String description;

    @Override
    public String getAuthority() {
        return roleName.name();
    }
}
