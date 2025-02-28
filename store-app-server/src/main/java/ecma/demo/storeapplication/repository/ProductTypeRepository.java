package ecma.demo.storeapplication.repository;

import ecma.demo.storeapplication.entity.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
public interface ProductTypeRepository extends JpaRepository<ProductType, UUID> {
    List<ProductType> findAllByOrderByMainDesc();
}