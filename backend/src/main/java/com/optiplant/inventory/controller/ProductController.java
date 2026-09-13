package com.optiplant.inventory.controller;

import com.optiplant.inventory.dto.ProductDTO;
import com.optiplant.inventory.model.Product;
import com.optiplant.inventory.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService service;

    @GetMapping
    public List<Product> getAll() { return service.findAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody @Valid ProductDTO dto) {
        return service.create(dto);
    }
}
