package com.optiplant.inventory.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Supplier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 20)
    private String taxId;
    
    @Column(nullable = false, length = 150)
    private String companyName;
    
    @Column(length = 100)
    private String contactName;
    
    @Column(length = 20)
    private String phone;
}
