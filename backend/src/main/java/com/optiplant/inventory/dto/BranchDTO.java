package com.optiplant.inventory.dto;

import jakarta.validation.constraints.*;

public record BranchDTO(
    Long id,
    @NotBlank String name,
    String address
) {}
