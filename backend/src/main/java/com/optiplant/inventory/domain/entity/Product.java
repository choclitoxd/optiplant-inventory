package com.optiplant.inventory.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String sku;
    
    @Column(nullable = false, length = 150)
    private String name;
    
    private String description;
    
    @Column(length = 20)
    private String unitOfMeasure;
    
    @Column(nullable = false)
    private BigDecimal basePrice;
    
    @Builder.Default
    @Column(nullable = false)
    private BigDecimal weightedAverageCost = BigDecimal.ZERO;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
