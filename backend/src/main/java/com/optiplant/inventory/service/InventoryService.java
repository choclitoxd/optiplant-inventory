package com.optiplant.inventory.service;

/**
 * ¿Por qué se hizo así?
 *   • Encapsula la lógica de negocio de stock (p.ej., no permite stock negativo).
 *   • Mantiene la capa de dominio libre de dependencias de Spring MVC.
 */

import com.optiplant.inventory.dto.InventoryDTO;
import com.optiplant.inventory.model.Inventory;
import com.optiplant.inventory.model.Branch;
import com.optiplant.inventory.model.Product;
import com.optiplant.inventory.repository.InventoryRepository;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepo;
    private final BranchRepository branchRepo;
    private final ProductRepository productRepo;

    @Transactional(readOnly = true)
    public List<Inventory> findAll() {
        return inventoryRepo.findAll();
    }

    @Transactional(readOnly = true)
    public List<Inventory> findByBranchId(Long branchId) {
        return inventoryRepo.findAll()
                .stream()
                .filter(i -> i.getBranch().getId().equals(branchId))
                .toList();
    }

    @Transactional
    public Inventory create(InventoryDTO dto) {
        Branch branch = branchRepo.findById(dto.branchId())
                .orElseThrow(() -> new IllegalArgumentException("Branch no encontrada"));
        Product product = productRepo.findById(dto.productId())
                .orElseThrow(() -> new IllegalArgumentException("Product no encontrado"));
        if (dto.stock() < 0) {
            throw new IllegalArgumentException("Stock no puede ser negativo");
        }
        Inventory inventory = Inventory.builder()
                .branch(branch)
                .product(product)
                .stock(dto.stock())
                .minStockThreshold(dto.minStockThreshold())
                .build();
        return inventoryRepo.save(inventory);
    }

    @Transactional
    public Inventory update(Long id, InventoryDTO dto) {
        Inventory inv = inventoryRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado"));
        if (dto.stock() < 0) {
            throw new IllegalArgumentException("Stock no puede ser negativo");
        }
        inv.setStock(dto.stock());
        inv.setMinStockThreshold(dto.minStockThreshold());
        return inventoryRepo.save(inv);
    }

    @Transactional
    public void delete(Long id) {
        if (!inventoryRepo.existsById(id))
            throw new IllegalArgumentException("Inventario no encontrado");
        inventoryRepo.deleteById(id);
    }
}
