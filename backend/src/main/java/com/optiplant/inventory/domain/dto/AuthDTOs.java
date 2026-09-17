package com.optiplant.inventory.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class AuthDTOs {

    @Schema(description = "Payload para login de usuario")
    public record LoginRequestDTO(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Password is required") String password
    ) {}

    @Schema(description = "Respuesta exitosa de autenticación")
    public record AuthResponseDTO(
            String token,
            String username,
            String email,
            String fullName,
            List<String> roles,
            Long branchId
    ) {}

    @Schema(description = "Payload para registrar un nuevo usuario")
    public record UserRegisterDTO(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
            @NotBlank(message = "Password is required") String password,
            @NotBlank(message = "Full name is required") String fullName,
            @NotBlank(message = "Role is required (e.g. ROLE_OPERATOR)") String role,
            Long branchId // Nullable, logic validation applies
    ) {}

    @Schema(description = "Payload para actualizar un usuario")
    public record UserUpdateDTO(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
            @NotBlank(message = "Full name is required") String fullName,
            @NotBlank(message = "Role is required (e.g. ROLE_OPERATOR)") String role,
            Long branchId // Nullable, logic validation applies
    ) {}
}
