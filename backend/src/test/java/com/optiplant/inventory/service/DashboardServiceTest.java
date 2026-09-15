package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.DashboardDTOs.DashboardMetricsDTO;
import com.optiplant.inventory.repository.DashboardRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock private DashboardRepository dashboardRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void shouldCalculateGlobalInventoryValueCorrectly() {
        // Given
        DashboardMetricsDTO mockMetrics = new DashboardMetricsDTO(
                10L, 2L, 30L, 
                new BigDecimal("2000.00"), 
                new BigDecimal("500.00"), 
                new BigDecimal("300.00")
        );
        when(dashboardRepository.getGeneralMetrics()).thenReturn(mockMetrics);

        // When
        DashboardMetricsDTO metrics = dashboardService.getGeneralMetrics();

        // Then
        BigDecimal expectedTotalValue = new BigDecimal("2000.00").setScale(2, RoundingMode.HALF_UP);
        assertThat(metrics.totalInventoryValue()).isEqualByComparingTo(expectedTotalValue);
        assertThat(metrics.totalStockUnits()).isEqualTo(30);
    }
}
