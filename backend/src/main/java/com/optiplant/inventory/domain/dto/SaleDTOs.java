package com.optiplant.inventory.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SaleDTOs {

    @Schema(description = "Payload para registrar una nueva venta")
    public record SaleRequestDTO(
            @Schema(description = "ID de la sucursal donde se realiza la venta", example = "1")
            @NotNull(message = "Branch ID is required") Long branchId,
            
            @Schema(description = "Lista de productos a vender")
            @NotEmpty(message = "Sale details cannot be empty") List<SaleDetailRequestDTO> details
    ) {}

    @Schema(description = "Detalle individual de producto en la venta")
    public record SaleDetailRequestDTO(
            @Schema(description = "ID del producto", example = "105")
            @NotNull(message = "Product ID is required") Long productId,
            
            @Schema(description = "Cantidad a vender", example = "2")
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
