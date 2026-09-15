package com.optiplant.inventory.repository;

import com.optiplant.inventory.domain.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findByOriginBranchIdOrDestinationBranchIdOrderBySendDateDesc(Long originBranchId, Long destinationBranchId);
}
