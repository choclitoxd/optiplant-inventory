package com.optiplant.inventory.domain.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PurchaseDTOs {

    public record PurchaseDetailRequestDTO(
        @NotNull Long productId,
        @Min(1) Integer quantity,
        @NotNull @DecimalMin("0.01") BigDecimal unitCost
    ) {}

    public record PurchaseRequestDTO(
        @NotNull Long branchId,
        @NotNull Long supplierId,
        @NotEmpty List<PurchaseDetailRequestDTO> details
    ) {}

    public record PurchaseDetailResponseDTO(
        Long productId,
        String productSku,
        String productName,
        Integer quantity,
        BigDecimal unitCost
    ) {}

    public record PurchaseResponseDTO(
        Long id,
        Long supplierId,
        String supplierName,
        Long branchId,
        LocalDateTime purchaseDate,
        BigDecimal totalAmount,
        String responsibleUser,
        List<PurchaseDetailResponseDTO> details
    ) {}
}
