package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.BranchRequestDto;
import com.optiplant.inventory.domain.dto.BranchResponseDto;
import com.optiplant.inventory.service.BranchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
public class BranchController {
    private final BranchService service;

    @GetMapping
    public List<BranchResponseDto> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public BranchResponseDto getById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BranchResponseDto create(@RequestBody @Valid BranchRequestDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public BranchResponseDto update(@PathVariable Long id, @RequestBody @Valid BranchRequestDto dto) { return service.update(id, dto); }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
