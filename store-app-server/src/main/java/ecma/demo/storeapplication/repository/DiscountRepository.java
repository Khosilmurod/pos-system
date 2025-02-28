package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DiscountRepository extends JpaRepository<Discount, UUID> {
    Discount findByTradeAllId(UUID id);
}
