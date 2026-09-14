package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.BranchRequestDto;
import com.optiplant.inventory.domain.dto.BranchResponseDto;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.exception.ResourceNotFoundException;
import com.optiplant.inventory.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BranchService {
    private final BranchRepository repository;

    @Transactional(readOnly = true)
    public List<BranchResponseDto> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BranchResponseDto findById(Long id) {
        return toResponse(repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada")));
    }

    @Transactional
    public BranchResponseDto create(BranchRequestDto dto) {
        Branch b = Branch.builder()
            .name(dto.name())
            .address(dto.address())
            .active(dto.active())
            .build();
        return toResponse(repository.save(b));
    }

    @Transactional
    public BranchResponseDto update(Long id, BranchRequestDto dto) {
        Branch b = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada"));
        b.setName(dto.name());
        b.setAddress(dto.address());
        b.setActive(dto.active());
        return toResponse(b);
    }
    
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Sucursal no encontrada");
        repository.deleteById(id);
    }

    private BranchResponseDto toResponse(Branch b) {
        return new BranchResponseDto(b.getId(), b.getName(), b.getAddress(), b.isActive(), b.getCreatedAt());
    }
}
