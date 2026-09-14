package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.ProductRequestDto;
import com.optiplant.inventory.domain.dto.ProductResponseDto;
import com.optiplant.inventory.domain.entity.Product;
import com.optiplant.inventory.exception.ResourceNotFoundException;
import com.optiplant.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;

    @Transactional(readOnly = true)
    public List<ProductResponseDto> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponseDto findById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado")));
    }

    @Transactional
    public ProductResponseDto create(ProductRequestDto dto) {
        if (repository.existsBySku(dto.sku())) throw new IllegalArgumentException("SKU ya existe");
        
        Product p = Product.builder()
            .sku(dto.sku())
            .name(dto.name())
            .description(dto.description())
            .unitOfMeasure(dto.unitOfMeasure())
            .basePrice(dto.basePrice())
            .weightedAverageCost(BigDecimal.ZERO)
            .build();
            
        return toResponse(repository.save(p));
    }

    @Transactional
    public ProductResponseDto update(Long id, ProductRequestDto dto) {
        Product p = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        p.setSku(dto.sku());
        p.setName(dto.name());
        p.setDescription(dto.description());
        p.setUnitOfMeasure(dto.unitOfMeasure());
        p.setBasePrice(dto.basePrice());
        return toResponse(p); // JPA Dirty Checking autoguarda
    }
    
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Producto no encontrado");
        repository.deleteById(id);
    }

    private ProductResponseDto toResponse(Product p) {
        return new ProductResponseDto(p.getId(), p.getSku(), p.getName(), p.getDescription(), 
            p.getUnitOfMeasure(), p.getBasePrice(), p.getWeightedAverageCost(), p.getCreatedAt());
    }
}
