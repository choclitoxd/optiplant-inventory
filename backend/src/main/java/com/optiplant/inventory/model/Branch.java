package com.optiplant.inventory.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "branch")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Branch {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    private String address;
}
