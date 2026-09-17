package com.optiplant.inventory.controller;

import com.optiplant.inventory.domain.dto.AuthDTOs.UserUpdateDTO;
import com.optiplant.inventory.domain.entity.User;
import com.optiplant.inventory.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@Tag(name = "Users", description = "API para gestión de usuarios. Solo accesible por ADMIN.")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Listar usuarios", description = "Retorna todos los usuarios. Requiere ROLE_ADMIN o ROLE_BRANCH_MANAGER.")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BRANCH_MANAGER')")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Obtener usuario por ID", description = "Retorna el detalle de un usuario. Requiere ROLE_ADMIN o ROLE_BRANCH_MANAGER.")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BRANCH_MANAGER')")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(summary = "Desactivar usuario", description = "Marca a un usuario como inactivo. Requiere ROLE_ADMIN o ROLE_BRANCH_MANAGER.")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BRANCH_MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Actualizar usuario", description = "Actualiza el perfil. Requiere ROLE_ADMIN o ROLE_BRANCH_MANAGER.")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_BRANCH_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO updateDTO) {
        return ResponseEntity.ok(userService.updateUser(id, updateDTO));
    }
}
