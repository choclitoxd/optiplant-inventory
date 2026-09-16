package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.PurchaseDTOs.*;
import com.optiplant.inventory.domain.entity.*;
import com.optiplant.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    @Transactional
    public PurchaseResponseDTO registerPurchase(PurchaseRequestDTO request) {
        Branch branch = branchRepository.findById(request.branchId())
            .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada"));
        Supplier supplier = supplierRepository.findById(request.supplierId())
            .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado"));

        Purchase purchase = Purchase.builder()
            .branch(branch).supplier(supplier).responsibleUser(request.responsibleUser())
            .totalAmount(BigDecimal.ZERO)
            .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PurchaseDetailRequestDTO detailDTO : request.details()) {
            Product product = productRepository.findById(detailDTO.productId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + detailDTO.productId()));

            // a) Calcular Costo Total del Detalle
            BigDecimal detailTotal = detailDTO.unitCost().multiply(BigDecimal.valueOf(detailDTO.quantity()));
            totalAmount = totalAmount.add(detailTotal);

            // b) Lógica de Costo Promedio Ponderado (CPP)
            int currentGlobalStock = inventoryRepository.sumStockByProductId(product.getId());
            BigDecimal currentTotalValue = product.getWeightedAverageCost().multiply(BigDecimal.valueOf(currentGlobalStock));
            
            int newGlobalStock = currentGlobalStock + detailDTO.quantity();
            BigDecimal newTotalValue = currentTotalValue.add(detailTotal);
            
            BigDecimal newCPP = newTotalValue.divide(BigDecimal.valueOf(newGlobalStock), 2, RoundingMode.HALF_UP);
            product.setWeightedAverageCost(newCPP);
            productRepository.save(product);

            // c) Actualizar o Crear Stock en Sucursal
            Inventory inventory = inventoryRepository.findByBranchIdAndProductId(branch.getId(), product.getId())
                .orElseGet(() -> Inventory.builder().branch(branch).product(product).stock(0).minStockThreshold(0).build());
            inventory.setStock(inventory.getStock() + detailDTO.quantity());
            inventoryRepository.save(inventory);

            // d) Agregar al Detalle de Compra
            purchase.getDetails().add(PurchaseDetail.builder()
                .purchase(purchase).product(product)
                .quantity(detailDTO.quantity()).unitCost(detailDTO.unitCost())
                .build());
        }

        purchase.setTotalAmount(totalAmount);
        Purchase savedPurchase = purchaseRepository.save(purchase);

        return buildResponseDTO(savedPurchase);
    }

    public List<PurchaseResponseDTO> getAllPurchases() {
        return purchaseRepository.findAll().stream()
            .map(this::buildResponseDTO)
            .toList();
    }

    private PurchaseResponseDTO buildResponseDTO(Purchase purchase) {
        List<PurchaseDetailResponseDTO> detailDTOs = purchase.getDetails().stream()
            .map(d -> new PurchaseDetailResponseDTO(
                d.getProduct().getId(), d.getProduct().getSku(), d.getProduct().getName(), 
                d.getQuantity(), d.getUnitCost()))
            .toList();
            
        return new PurchaseResponseDTO(
            purchase.getId(), purchase.getSupplier().getId(), purchase.getSupplier().getCompanyName(),
            purchase.getBranch().getId(), purchase.getPurchaseDate(), purchase.getTotalAmount(),
            purchase.getResponsibleUser(), detailDTOs
        );
    }
}
