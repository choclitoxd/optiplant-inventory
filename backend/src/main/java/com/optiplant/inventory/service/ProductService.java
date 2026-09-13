package com.optiplant.inventory.service;

import com.optiplant.inventory.dto.ProductDTO;
import com.optiplant.inventory.model.Product;
import com.optiplant.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;

    @Transactional(readOnly = true)
    public List<Product> findAll() { return repository.findAll(); }

    @Transactional
    public Product create(ProductDTO dto) {
        if(repository.existsBySku(dto.sku())) throw new IllegalArgumentException("SKU ya existe");
        
        Product product = Product.builder()
            .sku(dto.sku())
            .name(dto.name())
            .description(dto.description())
            .basePrice(dto.basePrice())
            .averageCost(BigDecimal.ZERO)
            .build();
        return repository.save(product);
    }
}
