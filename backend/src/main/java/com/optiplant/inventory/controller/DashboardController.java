package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.DashboardDTOs.*;
import com.optiplant.inventory.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/metrics")
    public DashboardMetricsDTO getMetrics() {
        return dashboardService.getGeneralMetrics();
    }

    @GetMapping("/inventory-value")
    public List<StockValueByBranchDTO> getInventoryValueByBranch() {
        return dashboardService.getInventoryValueByBranch();
    }

    @GetMapping("/top-selling")
    public List<TopSellingProductDTO> getTopSellingProducts(@RequestParam(defaultValue = "5") int limit) {
        return dashboardService.getTopSellingProducts(limit);
    }
}
