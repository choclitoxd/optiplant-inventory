package com.optiplant.inventory.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProductDTO(
    Long id,
    @NotBlank String sku,
    @NotBlank String name,
    String description,
    @NotNull @PositiveOrZero BigDecimal basePrice
) {}
