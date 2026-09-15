package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.DashboardDTOs.*;
import com.optiplant.inventory.repository.DashboardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsDTO getGeneralMetrics() {
        DashboardMetricsDTO metrics = dashboardRepository.getGeneralMetrics();
        // Garantizar el uso de BigDecimal con RoundingMode.HALF_UP (2 decimales) en valores monetarios
        return new DashboardMetricsDTO(
                metrics.totalProducts(),
                metrics.totalBranches(),
                metrics.totalStockUnits(),
                metrics.totalInventoryValue().setScale(2, RoundingMode.HALF_UP),
                metrics.totalMonthlySales().setScale(2, RoundingMode.HALF_UP),
                metrics.totalMonthlyPurchases().setScale(2, RoundingMode.HALF_UP)
        );
    }

    @Transactional(readOnly = true)
    public List<StockValueByBranchDTO> getInventoryValueByBranch() {
        return dashboardRepository.getInventoryValueByBranch().stream()
                .map(dto -> new StockValueByBranchDTO(
                        dto.branchId(),
                        dto.branchName(),
                        dto.totalItems(),
                        dto.totalValue() != null ? dto.totalValue().setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2)
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TopSellingProductDTO> getTopSellingProducts(int limit) {
        return dashboardRepository.getTopSellingProducts(limit).stream()
                .map(dto -> new TopSellingProductDTO(
                        dto.productId(),
                        dto.productName(),
                        dto.productSku(),
                        dto.totalUnitsSold(),
                        dto.totalRevenue() != null ? dto.totalRevenue().setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO.setScale(2)
                ))
                .collect(Collectors.toList());
    }
}
