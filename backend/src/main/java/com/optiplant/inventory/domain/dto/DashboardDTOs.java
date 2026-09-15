package com.optiplant.inventory.domain.dto;

import java.math.BigDecimal;

public class DashboardDTOs {

    public record DashboardMetricsDTO(
            Long totalProducts,
            Long totalBranches,
            Long totalStockUnits,
            BigDecimal totalInventoryValue,
            BigDecimal totalMonthlySales,
            BigDecimal totalMonthlyPurchases
    ) {}

    public record StockValueByBranchDTO(
            Long branchId,
            String branchName,
            Long totalItems,
            BigDecimal totalValue
    ) {}

    public record TopSellingProductDTO(
            Long productId,
            String productName,
            String productSku,
            Long totalUnitsSold,
            BigDecimal totalRevenue
    ) {}
}
