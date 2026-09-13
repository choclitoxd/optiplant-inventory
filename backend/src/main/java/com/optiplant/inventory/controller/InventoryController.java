package com.optiplant.inventory.controller;

/**
 * ¿Por qué se hizo así?
 *   • El inventario es una entidad que relaciona Branch y Product; al tener su
 *     propio controlador evitamos que el ProductController se sobrecargue con
 *     lógica de stock.
 *   • Permite consultas por sucursal (filtrado) sin exponer la entidad
 *     directamente, manteniendo la encapsulación vía DTO.
 */

import com.optiplant.inventory.dto.InventoryDTO;
import com.optiplant.inventory.model.Inventory;
import com.optiplant.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryService service;

    @GetMapping
    public List<Inventory> getAll() {
        return service.findAll();
    }

    @GetMapping(params = "branchId")
    public List<Inventory> getByBranch(@RequestParam Long branchId) {
        return service.findByBranchId(branchId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inventory create(@RequestBody @Valid InventoryDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public Inventory update(@PathVariable Long id,
                            @RequestBody @Valid InventoryDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
