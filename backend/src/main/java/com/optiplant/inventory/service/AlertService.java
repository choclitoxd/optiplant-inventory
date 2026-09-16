package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.StockAlertDTO;
import com.optiplant.inventory.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlertService {

    private final InventoryRepository inventoryRepository;
    private final EmailService emailService;

    // En un caso real esto se tomaría de la BD o application.yml
    @Value("${app.admin.email:admin@optiplant.com}")
    private String adminEmail;

    public AlertService(InventoryRepository inventoryRepository, EmailService emailService) {
        this.inventoryRepository = inventoryRepository;
        this.emailService = emailService;
    }

    @Transactional(readOnly = true)
    public List<StockAlertDTO> getAllLowStockAlerts() {
        return inventoryRepository.findLowStockInventories();
    }

    @Transactional(readOnly = true)
    public List<StockAlertDTO> getLowStockAlertsByBranch(Long branchId) {
        return inventoryRepository.findLowStockInventoriesByBranch(branchId);
    }

    public void manualSendEmailReport(String email) {
        List<StockAlertDTO> alerts = getAllLowStockAlerts();
        if (!alerts.isEmpty()) {
            String recipient = (email != null && !email.trim().isEmpty()) ? email : adminEmail;
            emailService.sendLowStockAlertEmail(recipient, alerts);
            System.out.println("Enviando reporte manual a: " + recipient);
        }
    }

    // Se ejecuta a las 8:00 AM todos los días para revisión automática
    @Scheduled(cron = "0 0 8 * * *")
    public void checkAndNotifyLowStock() {
        List<StockAlertDTO> alerts = getAllLowStockAlerts();
        if (!alerts.isEmpty()) {
            emailService.sendLowStockAlertEmail(adminEmail, alerts);
            System.out.println("Cron Job: Reporte de stock enviado. Total alertas: " + alerts.size());
        }
    }
}
