package com.optiplant.inventory.domain.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductRequestDto(
    @NotBlank String sku,
    @NotBlank String name,
    String description,
    @NotBlank String unitOfMeasure,
    @NotNull @PositiveOrZero BigDecimal basePrice
) {}
