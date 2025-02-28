package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LoanRepository extends JpaRepository<Loan, UUID> {
    Loan findByTradeAllId(UUID id);
}
