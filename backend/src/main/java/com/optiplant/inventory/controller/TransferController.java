package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.TransferDTOs.*;
import com.optiplant.inventory.service.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@CrossOrigin(origins = "*")
public class TransferController {

    private final TransferService transferService;

    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @PostMapping("/send")
    @ResponseStatus(HttpStatus.CREATED)
    public TransferResponseDTO sendTransfer(@Valid @RequestBody TransferSendRequestDTO request) {
        return transferService.sendTransfer(request);
    }

    @PutMapping("/{id}/receive")
    public TransferResponseDTO receiveTransfer(@PathVariable Long id, @Valid @RequestBody TransferReceiveRequestDTO request) {
        return transferService.receiveTransfer(id, request);
    }

    @GetMapping("/branch/{branchId}")
    public List<TransferResponseDTO> getTransfersByBranch(@PathVariable Long branchId) {
        return transferService.getTransfersByBranch(branchId);
    }

    @GetMapping("/{id}")
    public TransferResponseDTO getTransferById(@PathVariable Long id) {
        return transferService.getTransferById(id);
    }
}
