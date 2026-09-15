package com.optiplant.inventory.domain.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SaleDTOs {

    public record SaleRequestDTO(
            @NotNull(message = "Branch ID is required") Long branchId,
            @NotEmpty(message = "Responsible user is required") String responsibleUser,
            @NotEmpty(message = "Sale details cannot be empty") List<SaleDetailRequestDTO> details
    ) {}

    public record SaleDetailRequestDTO(
            @NotNull(message = "Product ID is required") Long productId,
            @NotNull(message = "Quantity is required")
            @Positive(message = "Quantity must be greater than zero") Integer quantity
    ) {}

    public record SaleResponseDTO(
            Long id,
            Long branchId,
            String branchName,
            LocalDateTime saleDate,
            BigDecimal totalAmount,
            String responsibleUser,
            List<SaleDetailResponseDTO> details
    ) {}

    public record SaleDetailResponseDTO(
            Long id,
            Long productId,
            String productName,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal subtotal
    ) {}
}
