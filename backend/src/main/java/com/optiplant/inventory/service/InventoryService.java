package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.InventoryRequestDto;
import com.optiplant.inventory.domain.dto.InventoryResponseDto;
import com.optiplant.inventory.domain.entity.Inventory;
import com.optiplant.inventory.exception.ResourceNotFoundException;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.InventoryRepository;
import com.optiplant.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository invRepo;
    private final BranchRepository branchRepo;
    private final ProductRepository prodRepo;

    @Transactional(readOnly = true)
    public List<InventoryResponseDto> findAll() {
        return invRepo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponseDto findById(Long id) {
        return toResponse(invRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado")));
    }

    @Transactional(readOnly = true)
    public List<InventoryResponseDto> findByBranch(Long branchId) {
        return invRepo.findByBranchId(branchId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public InventoryResponseDto createOrUpdate(InventoryRequestDto dto) {
        Inventory inv = invRepo.findByBranchIdAndProductId(dto.branchId(), dto.productId())
            .orElseGet(() -> Inventory.builder()
                .branch(branchRepo.getReferenceById(dto.branchId()))
                .product(prodRepo.getReferenceById(dto.productId()))
                .stock(0)
                .build());
                
        inv.setStock(dto.stock());
        inv.setMinStockThreshold(dto.minStockThreshold());
        
        return toResponse(invRepo.save(inv));
    }
    
    @Transactional
    public void delete(Long id) {
        if (!invRepo.existsById(id)) throw new ResourceNotFoundException("Inventario no encontrado");
        invRepo.deleteById(id);
    }

    private InventoryResponseDto toResponse(Inventory i) {
        return new InventoryResponseDto(i.getId(), i.getBranch().getId(), i.getProduct().getId(), 
            i.getStock(), i.getMinStockThreshold(), i.getVersion());
    }
}
