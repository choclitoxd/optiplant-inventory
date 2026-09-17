package com.optiplant.inventory.domain.dto;

import com.optiplant.inventory.domain.entity.TransferStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;

public class TransferDTOs {

    public record TransferSendRequestDTO(
            @NotNull(message = "Origin branch ID is required") Long originBranchId,
            @NotNull(message = "Destination branch ID is required") Long destinationBranchId,
            LocalDateTime estimatedArrival,
            String transporter,
            String routePriority,
            @NotEmpty(message = "Transfer details cannot be empty") List<TransferDetailRequestDTO> details
    ) {}

    public record TransferDetailRequestDTO(
            @NotNull(message = "Product ID is required") Long productId,
            @NotNull(message = "Quantity sent is required")
            @Positive(message = "Quantity sent must be positive") Integer quantitySent
    ) {}

    public record TransferReceiveRequestDTO(
            @NotEmpty(message = "Transfer receive details cannot be empty") List<TransferReceiveDetailDTO> details
    ) {}

    public record TransferReceiveDetailDTO(
            @NotNull(message = "Detail ID is required") Long detailId,
            @NotNull(message = "Quantity received is required")
            @PositiveOrZero(message = "Quantity received must be zero or positive") Integer quantityReceived
    ) {}

    public record TransferResponseDTO(
            Long id,
            Long originBranchId,
            String originBranchName,
            Long destinationBranchId,
            String destinationBranchName,
            LocalDateTime sendDate,
            LocalDateTime estimatedArrival,
            LocalDateTime receiveDate,
            String transporter,
            String routePriority,
            TransferStatus status,
            String responsibleUser,
            List<TransferDetailResponseDTO> details
    ) {}

    public record TransferDetailResponseDTO(
            Long id,
            Long productId,
            String productName,
            Integer quantitySent,
            Integer quantityReceived
    ) {}
}
