package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.SaleDTOs.SaleRequestDTO;
import com.optiplant.inventory.domain.dto.SaleDTOs.SaleResponseDTO;
import com.optiplant.inventory.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
@Tag(name = "Ventas (POS)", description = "API para la gestión de ventas y procesamiento de transacciones en el Punto de Venta")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @Operation(summary = "Registrar una nueva venta", description = "Procesa una venta descontando el inventario de la sucursal de forma concurrente.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Venta registrada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o stock insuficiente"),
        @ApiResponse(responseCode = "404", description = "Producto o sucursal no encontrados")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SaleResponseDTO createSale(@Valid @RequestBody SaleRequestDTO request) {
        return saleService.createSale(request);
    }

    @Operation(summary = "Listar ventas por sucursal", description = "Retorna el historial de todas las ventas registradas en una sucursal específica.")
    @ApiResponse(responseCode = "200", description = "Listado de ventas obtenido correctamente")
    @GetMapping("/branch/{branchId}")
    public List<SaleResponseDTO> getSalesByBranch(@PathVariable Long branchId) {
        return saleService.getSalesByBranch(branchId);
    }
}
