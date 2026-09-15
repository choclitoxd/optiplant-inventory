package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.SaleDTOs.SaleRequestDTO;
import com.optiplant.inventory.domain.dto.SaleDTOs.SaleResponseDTO;
import com.optiplant.inventory.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SaleResponseDTO createSale(@Valid @RequestBody SaleRequestDTO request) {
        return saleService.createSale(request);
    }

    @GetMapping("/branch/{branchId}")
    public List<SaleResponseDTO> getSalesByBranch(@PathVariable Long branchId) {
        return saleService.getSalesByBranch(branchId);
    }
}
