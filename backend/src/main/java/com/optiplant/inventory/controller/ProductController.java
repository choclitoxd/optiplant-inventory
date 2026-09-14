package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.ProductRequestDto;
import com.optiplant.inventory.domain.dto.ProductResponseDto;
import com.optiplant.inventory.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;

    @GetMapping
    public List<ProductResponseDto> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ProductResponseDto getById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponseDto create(@RequestBody @Valid ProductRequestDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public ProductResponseDto update(@PathVariable Long id, @RequestBody @Valid ProductRequestDto dto) { return service.update(id, dto); }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
