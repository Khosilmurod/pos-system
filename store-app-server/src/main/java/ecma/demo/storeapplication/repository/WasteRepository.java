package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.Waste;
import ecma.demo.storeapplication.entity.enums.WasteStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface WasteRepository extends JpaRepository<Waste, UUID> {
    Waste findByDeliverIdAndWasteStatus(UUID id, WasteStatus wasteStatus);
    Page<Waste> findAllByWasteStatus(WasteStatus wasteStatus, Pageable pageable);

    @Query(value = "select coalesce(sum(w.amount),0) from waste w where w.deliver_uuid=:id and w.waste_status=:wasteStatus", nativeQuery = true)
    Integer getWasteAmount(UUID id, String wasteStatus);
}
