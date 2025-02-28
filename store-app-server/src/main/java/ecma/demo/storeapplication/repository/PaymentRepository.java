package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Payment;
import ecma.demo.storeapplication.entity.enums.PayType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Payment findAllByTradeAllIdAndPayType(UUID id, PayType payType);
}
