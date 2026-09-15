package com.optiplant.inventory.repository;

import com.optiplant.inventory.domain.entity.TransferDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferDetailRepository extends JpaRepository<TransferDetail, Long> {
}
