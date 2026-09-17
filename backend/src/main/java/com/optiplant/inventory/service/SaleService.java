package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.SaleDTOs.*;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.domain.entity.Inventory;
import com.optiplant.inventory.domain.entity.Product;
import com.optiplant.inventory.domain.entity.Sale;
import com.optiplant.inventory.domain.entity.SaleDetail;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.InventoryRepository;
import com.optiplant.inventory.repository.ProductRepository;
import com.optiplant.inventory.repository.SaleRepository;
import com.optiplant.inventory.repository.UserRepository;
import com.optiplant.inventory.domain.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public SaleService(SaleRepository saleRepository, BranchRepository branchRepository,
                       ProductRepository productRepository, InventoryRepository inventoryRepository,
                       UserRepository userRepository) {
        this.saleRepository = saleRepository;
        this.branchRepository = branchRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
    }

    @Transactional
    public SaleResponseDTO createSale(SaleRequestDTO request) {
        if (request.details() == null || request.details().isEmpty()) {
            throw new IllegalArgumentException("La venta debe contener al menos un producto.");
        }

        Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> new IllegalArgumentException("Sucursal no encontrada."));

        Sale sale = new Sale();
        sale.setBranch(branch);
        sale.setSaleDate(LocalDateTime.now());
        sale.setResponsibleUser(getAuthenticatedUser());
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<SaleDetail> details = new ArrayList<>();

        for (SaleDetailRequestDTO detailDto : request.details()) {
            Product product = productRepository.findById(detailDto.productId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado con ID: " + detailDto.productId()));

            // Bloqueo Pesimista: SELECT FOR UPDATE
            Inventory inventory = inventoryRepository.findByBranchIdAndProductIdWithLock(branch.getId(), product.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no disponible en el inventario local."));

            if (inventory.getStock() < detailDto.quantity()) {
                throw new IllegalArgumentException("Stock insuficiente para realizar la venta del producto: " + product.getName() + ". Stock actual: " + inventory.getStock());
            }

            // Descontar inventario
            inventory.setStock(inventory.getStock() - detailDto.quantity());
            inventoryRepository.save(inventory);

            // Descuento
            BigDecimal discount = detailDto.discountPercentage() != null ? detailDto.discountPercentage() : BigDecimal.ZERO;
            if (discount.compareTo(BigDecimal.ZERO) < 0 || discount.compareTo(new BigDecimal("100")) > 0) {
                throw new IllegalArgumentException("El descuento debe estar entre 0 y 100.");
            }

            // Calcular subtotales
            BigDecimal unitPrice = product.getBasePrice();
            BigDecimal rawSubtotal = unitPrice.multiply(BigDecimal.valueOf(detailDto.quantity()));
            BigDecimal discountFactor = BigDecimal.ONE.subtract(discount.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP));
            BigDecimal subtotal = rawSubtotal.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);
            
            SaleDetail detail = new SaleDetail();
            detail.setSale(sale);
            detail.setProduct(product);
            detail.setQuantity(detailDto.quantity());
            detail.setUnitPrice(unitPrice);
            detail.setDiscountPercentage(discount);
            detail.setSubtotal(subtotal);

            details.add(detail);
            totalAmount = totalAmount.add(subtotal);
        }

        sale.setTotalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP));
        sale.setDetails(details);

        Sale savedSale = saleRepository.save(sale);
        return mapToResponseDTO(savedSale);
    }

    public List<SaleResponseDTO> getSalesByBranch(Long branchId) {
        return saleRepository.findByBranchIdOrderBySaleDateDesc(branchId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private SaleResponseDTO mapToResponseDTO(Sale sale) {
        List<SaleDetailResponseDTO> detailDTOs = sale.getDetails().stream()
                .map(d -> new SaleDetailResponseDTO(
                        d.getId(),
                        d.getProduct().getId(),
                        d.getProduct().getName(),
                        d.getQuantity(),
                        d.getUnitPrice(),
                        d.getDiscountPercentage(),
                        d.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new SaleResponseDTO(
                sale.getId(),
                sale.getBranch().getId(),
                sale.getBranch().getName(),
                sale.getSaleDate(),
                sale.getTotalAmount(),
                sale.getResponsibleUser().getUsername(),
                detailDTOs
        );
    }
}
