package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Role;
import ecma.demo.storeapplication.entity.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByRoleName(RoleName roleName);
}
