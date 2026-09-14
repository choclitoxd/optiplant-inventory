package com.optiplant.inventory.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BranchRequestDto(
    @NotBlank String name,
    String address,
    @NotNull Boolean active
) {}
