package com.optiplant.inventory.controller;

/**
 * ¿Por qué se hizo así?
 *   • Exponemos una API REST dedicada a Branch para mantener la separación de
 *     responsabilidades entre dominio (modelo) y entrega (controller). Cada
 *     recurso tiene su propio controlador, facilitando la evolución futura y la
 *     reutilización de servicios.
 *   • Se usa @RestControllerAdvice a nivel global para manejo de errores,
 *     evitando código repetido.
 */

import com.optiplant.inventory.dto.BranchDTO;
import com.optiplant.inventory.model.Branch;
import com.optiplant.inventory.service.BranchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BranchController {
    private final BranchService service;

    @GetMapping
    public List<Branch> getAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Branch create(@RequestBody @Valid BranchDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public Branch update(@PathVariable Long id,
                         @RequestBody @Valid BranchDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
