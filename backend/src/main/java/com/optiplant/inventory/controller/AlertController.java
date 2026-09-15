package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.StockAlertDTO;
import com.optiplant.inventory.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/low-stock")
    public List<StockAlertDTO> getLowStockAlerts() {
        return alertService.getAllLowStockAlerts();
    }

    @GetMapping("/branch/{branchId}/low-stock")
    public List<StockAlertDTO> getLowStockAlertsByBranch(@PathVariable Long branchId) {
        return alertService.getLowStockAlertsByBranch(branchId);
    }

    @PostMapping("/send-email-report")
    public ResponseEntity<String> sendEmailReport() {
        alertService.manualSendEmailReport();
        return ResponseEntity.ok("El reporte de alertas de stock se está enviando de forma asíncrona.");
    }
}
