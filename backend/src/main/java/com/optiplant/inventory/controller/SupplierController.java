package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.SupplierDTO;
import com.optiplant.inventory.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;

    @GetMapping
    public List<SupplierDTO> getAll() {
        return supplierService.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SupplierDTO create(@Valid @RequestBody SupplierDTO request) {
        return supplierService.create(request);
    }
}
