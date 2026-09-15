package com.optiplant.inventory.domain.dto;

public record StockAlertDTO(
        Long inventoryId,
        String branchName,
        String productName,
        String productSku,
        Integer currentStock,
        Integer minStockThreshold,
        Integer suggestedReorderQuantity,
        String severity // CRITICAL (0), WARNING (>0 and <= minStockThreshold)
) {}
