package com.optiplant.inventory.repository;

import com.optiplant.inventory.domain.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByBranchIdAndProductId(Long branchId, Long productId);
    List<Inventory> findByBranchId(Long branchId);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(i.stock), 0) FROM Inventory i WHERE i.product.id = :productId")
    Integer sumStockByProductId(@org.springframework.data.repository.query.Param("productId") Long productId);
}
