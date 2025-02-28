package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SettingsRepository extends JpaRepository<Settings, UUID> {
}
