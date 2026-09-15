package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.PurchaseDTOs.PurchaseRequestDTO;
import com.optiplant.inventory.domain.dto.PurchaseDTOs.PurchaseDetailRequestDTO;
import com.optiplant.inventory.domain.dto.PurchaseDTOs.PurchaseResponseDTO;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.domain.entity.Inventory;
import com.optiplant.inventory.domain.entity.Product;
import com.optiplant.inventory.domain.entity.Supplier;
import com.optiplant.inventory.domain.entity.Purchase;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.InventoryRepository;
import com.optiplant.inventory.repository.ProductRepository;
import com.optiplant.inventory.repository.PurchaseRepository;
import com.optiplant.inventory.repository.SupplierRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PurchaseServiceTest {

    @Mock private PurchaseRepository purchaseRepository;
    @Mock private BranchRepository branchRepository;
    @Mock private SupplierRepository supplierRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryRepository inventoryRepository;

    @InjectMocks
    private PurchaseService purchaseService;

    @Test
    void shouldCalculateCorrectWeightedAverageCostAndIncreaseStockWhenPurchaseIsRegistered() {
        // Given
        Long branchId = 1L;
        Long supplierId = 1L;
        Long productId = 1L;

        PurchaseDetailRequestDTO detail = new PurchaseDetailRequestDTO(productId, 10, new BigDecimal("120.00"));
        PurchaseRequestDTO request = new PurchaseRequestDTO(branchId, supplierId, "comprador1", List.of(detail));

        Branch branch = new Branch();
        branch.setId(branchId);
        Supplier supplier = new Supplier();
        supplier.setId(supplierId);

        // Producto preexistente con 10 unidades a costo promedio de 80.00
        Product product = new Product();
        product.setId(productId);
        product.setWeightedAverageCost(new BigDecimal("80.00"));

        Inventory inventory = new Inventory();
        inventory.setBranch(branch);
        inventory.setProduct(product);
        inventory.setStock(10);

        when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));
        when(supplierRepository.findById(supplierId)).thenReturn(Optional.of(supplier));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(inventoryRepository.sumStockByProductId(productId)).thenReturn(10);
        when(inventoryRepository.findByBranchIdAndProductId(branchId, productId)).thenReturn(Optional.of(inventory));
        
        Purchase savedPurchase = new Purchase();
        savedPurchase.setId(100L);
        savedPurchase.setSupplier(supplier);
        savedPurchase.setBranch(branch);
        savedPurchase.setDetails(new ArrayList<>());
        when(purchaseRepository.save(any(Purchase.class))).thenReturn(savedPurchase);

        // When
        PurchaseResponseDTO response = purchaseService.registerPurchase(request);

        // Then
        // Fórmula: ((10 * 80) + (10 * 120)) / (10 + 10) = (800 + 1200) / 20 = 2000 / 20 = 100.00
        BigDecimal expectedCPP = new BigDecimal("100.00").setScale(2, RoundingMode.HALF_UP);
        assertThat(product.getWeightedAverageCost()).isEqualByComparingTo(expectedCPP);
        assertThat(inventory.getStock()).isEqualTo(20);
        
        verify(productRepository, times(1)).save(product);
        verify(inventoryRepository, times(1)).save(inventory);
        verify(purchaseRepository, times(1)).save(any(Purchase.class));
    }
}
