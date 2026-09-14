package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.SupplierDTO;
import com.optiplant.inventory.domain.entity.Supplier;
import com.optiplant.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<SupplierDTO> getAll() {
        return supplierRepository.findAll().stream()
            .map(s -> new SupplierDTO(s.getId(), s.getTaxId(), s.getCompanyName(), s.getContactName(), s.getPhone()))
            .toList();
    }

    @Transactional
    public SupplierDTO create(SupplierDTO dto) {
        if (supplierRepository.existsByTaxId(dto.taxId())) {
            throw new IllegalArgumentException("Ya existe un proveedor con el Tax ID: " + dto.taxId());
        }
        Supplier supplier = Supplier.builder()
            .taxId(dto.taxId()).companyName(dto.companyName())
            .contactName(dto.contactName()).phone(dto.phone()).build();
        supplier = supplierRepository.save(supplier);
        return new SupplierDTO(supplier.getId(), supplier.getTaxId(), supplier.getCompanyName(), supplier.getContactName(), supplier.getPhone());
    }
}
