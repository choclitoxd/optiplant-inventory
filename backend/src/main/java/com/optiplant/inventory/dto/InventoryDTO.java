package com.optiplant.inventory.dto;

import jakarta.validation.constraints.*;

public record InventoryDTO(
    Long branchId,
    Long productId,
    @NotNull @PositiveOrZero Integer stock,
    @PositiveOrZero Integer minStockThreshold
) {}
