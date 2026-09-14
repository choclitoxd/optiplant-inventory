package com.optiplant.inventory.domain.dto;

public record InventoryResponseDto(
    Long id,
    Long branchId,
    Long productId,
    Integer stock,
    Integer minStockThreshold,
    Integer version
) {}
