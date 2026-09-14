package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.InventoryRequestDto;
import com.optiplant.inventory.domain.dto.InventoryResponseDto;
import com.optiplant.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventories")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService service;

    @GetMapping
    public List<InventoryResponseDto> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public InventoryResponseDto getById(@PathVariable Long id) { return service.findById(id); }

    @GetMapping("/branch/{branchId}")
    public List<InventoryResponseDto> getByBranch(@PathVariable Long branchId) { return service.findByBranch(branchId); }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public InventoryResponseDto setupOrUpdate(@RequestBody @Valid InventoryRequestDto dto) { return service.createOrUpdate(dto); }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
