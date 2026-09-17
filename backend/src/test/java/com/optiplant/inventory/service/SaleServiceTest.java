package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.SaleDTOs.*;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.domain.entity.Inventory;
import com.optiplant.inventory.domain.entity.Product;
import com.optiplant.inventory.domain.entity.Sale;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.InventoryRepository;
import com.optiplant.inventory.repository.ProductRepository;
import com.optiplant.inventory.repository.SaleRepository;
import com.optiplant.inventory.repository.UserRepository;
import com.optiplant.inventory.domain.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock private SaleRepository saleRepository;
    @Mock private BranchRepository branchRepository;
    @Mock private ProductRepository productRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private SaleService saleService;

    @Test
    void shouldDecreaseStockWhenSaleIsSuccessful() {
        // Given
        Long branchId = 1L;
        Long productId = 1L;

        SaleDetailRequestDTO detail = new SaleDetailRequestDTO(productId, 5, BigDecimal.ZERO);
        SaleRequestDTO request = new SaleRequestDTO(branchId, List.of(detail));

        Branch branch = new Branch();
        branch.setId(branchId);
        Product product = new Product();
        product.setId(productId);
        product.setBasePrice(new BigDecimal("150.00"));

        Inventory inventory = new Inventory();
        inventory.setStock(10); // Stock suficiente

        when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(inventoryRepository.findByBranchIdAndProductIdWithLock(branchId, productId)).thenReturn(Optional.of(inventory));
        
        Sale savedSale = new Sale();
        savedSale.setId(200L);
        savedSale.setTotalAmount(new BigDecimal("750.00"));
        savedSale.setBranch(branch);
        savedSale.setDetails(List.of());
        
        User testUser = new User();
        testUser.setUsername("testuser");
        savedSale.setResponsibleUser(testUser);
        
        when(saleRepository.save(any(Sale.class))).thenReturn(savedSale);
        
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // When
        SaleResponseDTO response = saleService.createSale(request);

        // Then
        assertThat(inventory.getStock()).isEqualTo(5); // 10 - 5 = 5
        verify(inventoryRepository, times(1)).save(inventory);
        verify(saleRepository, times(1)).save(any(Sale.class));
    }

    @Test
    void shouldThrowIllegalArgumentExceptionWhenRequestedQuantityExceedsStock() {
        // Given
        Long branchId = 1L;
        Long productId = 1L;

        SaleDetailRequestDTO detail = new SaleDetailRequestDTO(productId, 50, BigDecimal.ZERO);
        SaleRequestDTO request = new SaleRequestDTO(branchId, List.of(detail));

        Branch branch = new Branch();
        branch.setId(branchId);
        Product product = new Product();
        product.setId(productId);
        product.setName("Producto A");
        Inventory inventory = new Inventory();
        inventory.setStock(10); // Stock actual: 10

        when(branchRepository.findById(branchId)).thenReturn(Optional.of(branch));
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));
        when(inventoryRepository.findByBranchIdAndProductIdWithLock(branchId, productId)).thenReturn(Optional.of(inventory));
        
        User testUser = new User();
        testUser.setUsername("testuser");
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // When & Then
        assertThatThrownBy(() -> saleService.createSale(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Stock insuficiente");

        verify(saleRepository, never()).save(any(Sale.class));
    }
}
