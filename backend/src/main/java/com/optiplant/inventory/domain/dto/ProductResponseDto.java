package com.optiplant.inventory.domain.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponseDto(
    Long id,
    String sku,
    String name,
    String description,
    String unitOfMeasure,
    BigDecimal basePrice,
    BigDecimal weightedAverageCost,
    LocalDateTime createdAt
) {}
