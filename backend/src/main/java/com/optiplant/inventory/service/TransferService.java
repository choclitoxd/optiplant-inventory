package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.TransferDTOs.*;
import com.optiplant.inventory.domain.entity.*;
import com.optiplant.inventory.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransferService {

    private final TransferRepository transferRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryAdjustmentRepository inventoryAdjustmentRepository;

    public TransferService(TransferRepository transferRepository, BranchRepository branchRepository,
                           ProductRepository productRepository, InventoryRepository inventoryRepository,
                           InventoryAdjustmentRepository inventoryAdjustmentRepository) {
        this.transferRepository = transferRepository;
        this.branchRepository = branchRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryAdjustmentRepository = inventoryAdjustmentRepository;
    }

    @Transactional
    public TransferResponseDTO sendTransfer(TransferSendRequestDTO request) {
        if (request.originBranchId().equals(request.destinationBranchId())) {
            throw new IllegalArgumentException("La sucursal de origen y destino no pueden ser la misma.");
        }

        Branch origin = branchRepository.findById(request.originBranchId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal de origen no encontrada."));
        Branch destination = branchRepository.findById(request.destinationBranchId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal de destino no encontrada."));

        Transfer transfer = new Transfer();
        transfer.setOriginBranch(origin);
        transfer.setDestinationBranch(destination);
        transfer.setSendDate(LocalDateTime.now());
        transfer.setStatus(TransferStatus.IN_TRANSIT);
        transfer.setResponsibleUser(request.responsibleUser());

        List<TransferDetail> details = new ArrayList<>();

        for (TransferDetailRequestDTO detailDto : request.details()) {
            Product product = productRepository.findById(detailDto.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + detailDto.productId()));

            // Bloqueo pesimista en inventario origen
            Inventory inventory = inventoryRepository.findByBranchIdAndProductIdWithLock(origin.getId(), product.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no disponible en el inventario local."));

            if (inventory.getStock() < detailDto.quantitySent()) {
                throw new IllegalArgumentException("Stock insuficiente para transferencia del producto: " + product.getName());
            }

            // Descontar inventario origen
            inventory.setStock(inventory.getStock() - detailDto.quantitySent());
            inventoryRepository.save(inventory);

            TransferDetail detail = new TransferDetail();
            detail.setTransfer(transfer);
            detail.setProduct(product);
            detail.setQuantitySent(detailDto.quantitySent());
            details.add(detail);
        }

        transfer.setDetails(details);
        Transfer savedTransfer = transferRepository.save(transfer);
        return mapToResponseDTO(savedTransfer);
    }

    @Transactional
    public TransferResponseDTO receiveTransfer(Long transferId, TransferReceiveRequestDTO request) {
        Transfer transfer = transferRepository.findById(transferId)
                .orElseThrow(() -> new IllegalArgumentException("Transferencia no encontrada."));

        if (transfer.getStatus() != TransferStatus.IN_TRANSIT) {
            throw new IllegalArgumentException("La transferencia ya fue procesada o está cancelada. Estado actual: " + transfer.getStatus());
        }

        Map<Long, Integer> receivedQuantities = request.details().stream()
                .collect(Collectors.toMap(TransferReceiveDetailDTO::detailId, TransferReceiveDetailDTO::quantityReceived));

        boolean hasDiscrepancy = false;

        for (TransferDetail detail : transfer.getDetails()) {
            Integer qReceived = receivedQuantities.get(detail.getId());
            if (qReceived == null) {
                throw new IllegalArgumentException("Falta especificar cantidad recibida para el detalle ID: " + detail.getId());
            }
            if (qReceived > detail.getQuantitySent()) {
                throw new IllegalArgumentException("No se puede recibir más cantidad de la enviada para el detalle ID: " + detail.getId());
            }

            detail.setQuantityReceived(qReceived);

            if (qReceived < detail.getQuantitySent()) {
                hasDiscrepancy = true;
                int difference = detail.getQuantitySent() - qReceived;
                
                // Registrar discrepancia/faltante (Inventory Adjustment)
                InventoryAdjustment adjustment = new InventoryAdjustment();
                adjustment.setBranch(transfer.getDestinationBranch());
                adjustment.setProduct(detail.getProduct());
                adjustment.setQuantity(-difference); // Representa pérdida
                adjustment.setReason("TRANSFER_DISCREPANCY (Origen ID: " + transfer.getOriginBranch().getId() + ")");
                adjustment.setAdjustmentDate(LocalDateTime.now());
                inventoryAdjustmentRepository.save(adjustment);
            }

            if (qReceived > 0) {
                // Sumar al stock destino usando bloqueo pesimista en caso de que exista, si no, crear
                Inventory destInventory = inventoryRepository.findByBranchIdAndProductIdWithLock(transfer.getDestinationBranch().getId(), detail.getProduct().getId())
                        .orElseGet(() -> {
                            Inventory newInv = new Inventory();
                            newInv.setBranch(transfer.getDestinationBranch());
                            newInv.setProduct(detail.getProduct());
                            newInv.setStock(0);
                            return newInv;
                        });
                
                destInventory.setStock(destInventory.getStock() + qReceived);
                inventoryRepository.save(destInventory);
            }
        }

        transfer.setReceiveDate(LocalDateTime.now());
        transfer.setStatus(hasDiscrepancy ? TransferStatus.PARTIAL : TransferStatus.COMPLETED);
        
        // Mantener rastro de quien lo recibió agregándolo al registro de usuarios o asumiendo el log.
        // En un caso real se tendría un campo separate receiverUser, lo concatenamos temporalmente:
        transfer.setResponsibleUser(transfer.getResponsibleUser() + " | Recibió: " + request.responsibleUser());

        Transfer savedTransfer = transferRepository.save(transfer);
        return mapToResponseDTO(savedTransfer);
    }

    public List<TransferResponseDTO> getTransfersByBranch(Long branchId) {
        return transferRepository.findByOriginBranchIdOrDestinationBranchIdOrderBySendDateDesc(branchId, branchId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public TransferResponseDTO getTransferById(Long id) {
        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transferencia no encontrada."));
        return mapToResponseDTO(transfer);
    }

    private TransferResponseDTO mapToResponseDTO(Transfer transfer) {
        List<TransferDetailResponseDTO> detailDTOs = transfer.getDetails().stream()
                .map(d -> new TransferDetailResponseDTO(
                        d.getId(),
                        d.getProduct().getId(),
                        d.getProduct().getName(),
                        d.getQuantitySent(),
                        d.getQuantityReceived()
                ))
                .collect(Collectors.toList());

        return new TransferResponseDTO(
                transfer.getId(),
                transfer.getOriginBranch().getId(),
                transfer.getOriginBranch().getName(),
                transfer.getDestinationBranch().getId(),
                transfer.getDestinationBranch().getName(),
                transfer.getSendDate(),
                transfer.getReceiveDate(),
                transfer.getStatus(),
                transfer.getResponsibleUser(),
                detailDTOs
        );
    }
}
