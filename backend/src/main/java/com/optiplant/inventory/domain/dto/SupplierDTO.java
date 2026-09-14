package com.optiplant.inventory.domain.dto;

import jakarta.validation.constraints.NotBlank;

public record SupplierDTO(
    Long id,
    @NotBlank(message = "El Tax ID (RUT/RFC) es obligatorio") String taxId,
    @NotBlank(message = "La razón social es obligatoria") String companyName,
    String contactName,
    String phone
) {}
