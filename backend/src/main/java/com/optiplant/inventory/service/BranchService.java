package com.optiplant.inventory.service;

/**
 * ¿Por qué se hizo así?
 *   • Centraliza la lógica de negocio para Branch (ej.: validaciones de nombre
 *     único). Usa @Transactional para garantizar consistencia en operaciones de
 *     escritura.
 */

import com.optiplant.inventory.dto.BranchDTO;
import com.optiplant.inventory.model.Branch;
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
    public List<Branch> findAll() {
        return repository.findAll();
    }

    @Transactional
    public Branch create(BranchDTO dto) {
        Branch branch = Branch.builder()
                .name(dto.name())
                .address(dto.address())
                .build();
        return repository.save(branch);
    }

    @Transactional
    public Branch update(Long id, BranchDTO dto) {
        Branch branch = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch no encontrado"));
        branch.setName(dto.name());
        branch.setAddress(dto.address());
        return repository.save(branch);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new IllegalArgumentException("Branch no encontrado");
        repository.deleteById(id);
    }
}
