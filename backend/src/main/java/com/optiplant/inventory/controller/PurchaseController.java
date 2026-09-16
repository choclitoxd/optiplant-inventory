package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.PurchaseDTOs.PurchaseRequestDTO;
import com.optiplant.inventory.domain.dto.PurchaseDTOs.PurchaseResponseDTO;
import com.optiplant.inventory.service.PurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PurchaseController {
    private final PurchaseService purchaseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseResponseDTO registerPurchase(@Valid @RequestBody PurchaseRequestDTO request) {
        return purchaseService.registerPurchase(request);
    }

    @GetMapping
    public java.util.List<PurchaseResponseDTO> getAllPurchases() {
        return purchaseService.getAllPurchases();
    }
}
