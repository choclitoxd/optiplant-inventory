package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.AuthDTOs.AuthResponseDTO;
import com.optiplant.inventory.domain.dto.AuthDTOs.LoginRequestDTO;
import com.optiplant.inventory.domain.dto.AuthDTOs.UserRegisterDTO;
import com.optiplant.inventory.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "API para autenticación y registro de usuarios")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Iniciar sesión", description = "Autentica al usuario y devuelve un token JWT")
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        AuthResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Registrar nuevo usuario", description = "Crea un nuevo usuario en el sistema. Requiere ROLE_ADMIN o ROLE_BRANCH_MANAGER.")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BRANCH_MANAGER')")
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> register(@Valid @RequestBody UserRegisterDTO registerDTO) {
        try {
            authService.register(registerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
