package com.optiplant.inventory.repository;

import com.optiplant.inventory.domain.entity.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleDetailRepository extends JpaRepository<SaleDetail, Long> {
}
