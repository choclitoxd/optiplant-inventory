package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.TransferDTOs.TransferReceiveRequestDTO;
import com.optiplant.inventory.domain.dto.TransferDTOs.TransferReceiveDetailDTO;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.domain.entity.Inventory;
import com.optiplant.inventory.domain.entity.Transfer;
import com.optiplant.inventory.domain.entity.TransferDetail;
import com.optiplant.inventory.domain.entity.Product;
import com.optiplant.inventory.domain.entity.TransferStatus;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.InventoryAdjustmentRepository;
import com.optiplant.inventory.repository.InventoryRepository;
import com.optiplant.inventory.repository.ProductRepository;
import com.optiplant.inventory.repository.TransferRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock private TransferRepository transferRepository;
    @Mock private BranchRepository branchRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private InventoryAdjustmentRepository adjustmentRepository;

    @InjectMocks
    private TransferService transferService;

    @Test
    void shouldReceivePartialTransferAndRegisterAdjustmentWhenReceivedQuantityIsLessThanSent() {
        // Given
        Long transferId = 1L;
        Long productId = 1L;
        Long destBranchId = 2L;
        Long originBranchId = 1L;
        Long detailId = 100L;

        TransferReceiveDetailDTO detailReq = new TransferReceiveDetailDTO(detailId, 3);
        TransferReceiveRequestDTO request = new TransferReceiveRequestDTO("user2", List.of(detailReq));

        Transfer transfer = new Transfer();
        transfer.setId(transferId);
        transfer.setStatus(TransferStatus.IN_TRANSIT);
        transfer.setResponsibleUser("user1");
        
        Branch destBranch = new Branch();
        destBranch.setId(destBranchId);
        transfer.setDestinationBranch(destBranch);
        
        Branch originBranch = new Branch();
        originBranch.setId(originBranchId);
        transfer.setOriginBranch(originBranch);

        TransferDetail detail = new TransferDetail();
        detail.setId(detailId);
        Product product = new Product();
        product.setId(productId);
        detail.setProduct(product);
        detail.setQuantitySent(5); // Cantidad original enviada
        transfer.setDetails(List.of(detail));

        Inventory destInventory = new Inventory();
        destInventory.setStock(10); // Stock actual en destino

        when(transferRepository.findById(transferId)).thenReturn(Optional.of(transfer));
        when(inventoryRepository.findByBranchIdAndProductIdWithLock(destBranchId, productId)).thenReturn(Optional.of(destInventory));
        when(transferRepository.save(any(Transfer.class))).thenReturn(transfer);

        // When
        transferService.receiveTransfer(transferId, request);

        // Then
        assertThat(transfer.getStatus()).isEqualTo(TransferStatus.PARTIAL);
        assertThat(destInventory.getStock()).isEqualTo(13); // 10 + 3 recibidos
        verify(inventoryRepository, times(1)).save(destInventory);
        verify(adjustmentRepository, times(1)).save(any()); // Verifica que se guarda la merma
        verify(transferRepository, times(1)).save(transfer);
    }
}
