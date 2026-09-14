package com.optiplant.inventory.domain.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record InventoryRequestDto(
    @NotNull Long branchId,
    @NotNull Long productId,
    @NotNull @PositiveOrZero Integer stock,
    @NotNull @PositiveOrZero Integer minStockThreshold
) {}
