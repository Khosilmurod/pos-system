package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.DeliverAll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DeliverAllRepository extends JpaRepository<DeliverAll, UUID> {
}
