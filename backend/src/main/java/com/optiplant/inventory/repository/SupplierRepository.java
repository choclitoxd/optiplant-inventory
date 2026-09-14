package com.optiplant.inventory.repository;

import com.optiplant.inventory.domain.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    boolean existsByTaxId(String taxId);
}
