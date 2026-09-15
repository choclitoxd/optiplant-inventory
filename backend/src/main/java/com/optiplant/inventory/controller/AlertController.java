package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.StockAlertDTO;
import com.optiplant.inventory.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
@Tag(name = "Alertas de Stock y Notificaciones", description = "API para gestionar niveles de stock crítico y disparar notificaciones")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @Operation(summary = "Obtener todas las alertas de stock bajo", description = "Retorna una lista global de alertas (CRITICAL, WARNING) en todas las sucursales")
    @ApiResponse(responseCode = "200", description = "Lista de alertas recuperada con éxito")
    @GetMapping("/low-stock")
    public List<StockAlertDTO> getLowStockAlerts() {
        return alertService.getAllLowStockAlerts();
    }

    @Operation(summary = "Obtener alertas por sucursal", description = "Filtra las alertas de stock basándose en el ID de la sucursal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de alertas de la sucursal"),
            @ApiResponse(responseCode = "404", description = "Sucursal no encontrada")
    })
    @GetMapping("/branch/{branchId}/low-stock")
    public List<StockAlertDTO> getLowStockAlertsByBranch(@PathVariable Long branchId) {
        return alertService.getLowStockAlertsByBranch(branchId);
    }

    @Operation(summary = "Forzar envío manual del informe por correo", description = "Dispara de inmediato el reporte HTML por correo electrónico a los administradores")
    @ApiResponse(responseCode = "200", description = "El reporte se encoló exitosamente")
    @PostMapping("/send-email-report")
    public ResponseEntity<String> sendEmailReport() {
        alertService.manualSendEmailReport();
        return ResponseEntity.ok("El reporte de alertas de stock se está enviando de forma asíncrona.");
    }
}
