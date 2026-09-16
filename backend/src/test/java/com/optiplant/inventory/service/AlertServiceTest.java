package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.StockAlertDTO;
import com.optiplant.inventory.repository.InventoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock private InventoryRepository inventoryRepository;
    @Mock private EmailService emailService;

    @InjectMocks
    private AlertService alertService;

    @Test
    void shouldCategorizeAlertsCorrectlyAndCalculateSuggestedQuantity() {
        // Given
        StockAlertDTO critical = new StockAlertDTO(1L, "Branch", "Lentes", "SKU", 0, 10, 20, "CRITICAL");
        StockAlertDTO warning = new StockAlertDTO(2L, "Branch", "Gafas", "SKU", 5, 10, 15, "WARNING");

        when(inventoryRepository.findLowStockInventories()).thenReturn(List.of(critical, warning));

        // When
        List<StockAlertDTO> alerts = alertService.getAllLowStockAlerts();

        // Then
        assertThat(alerts).hasSize(2);
        assertThat(alerts.get(0).severity()).isEqualTo("CRITICAL");
        assertThat(alerts.get(1).severity()).isEqualTo("WARNING");
    }

    @Test
    void shouldTriggerEmailServiceAsynchronously() {
        // Given
        StockAlertDTO critical = new StockAlertDTO(1L, "Branch", "Lentes", "SKU", 0, 10, 20, "CRITICAL");
        when(inventoryRepository.findLowStockInventories()).thenReturn(List.of(critical));

        // When
        alertService.manualSendEmailReport("test@example.com");

        // Then
        verify(emailService, times(1)).sendLowStockAlertEmail(any(), anyList());
    }
}
