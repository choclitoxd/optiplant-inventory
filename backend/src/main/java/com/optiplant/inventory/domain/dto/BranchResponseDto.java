package com.optiplant.inventory.domain.dto;

import java.time.LocalDateTime;

public record BranchResponseDto(
    Long id,
    String name,
    String address,
    Boolean active,
    LocalDateTime createdAt
) {}
