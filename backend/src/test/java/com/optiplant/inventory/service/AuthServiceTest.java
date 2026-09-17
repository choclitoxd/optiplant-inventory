package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.AuthDTOs.UserRegisterDTO;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.domain.entity.Role;
import com.optiplant.inventory.domain.entity.RoleName;
import com.optiplant.inventory.domain.entity.User;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.RoleRepository;
import com.optiplant.inventory.repository.UserRepository;
import com.optiplant.inventory.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private BranchRepository branchRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // ─── Caso 1: Admin se registra sin sucursal → branchId queda null ───────────
    @Test
    void adminRegistration_shouldSucceed_withNullBranch() {
        // Given
        UserRegisterDTO dto = new UserRegisterDTO(
                "admin2", "admin2@test.com", "pass123",
                "Admin Dos", "ROLE_ADMIN", null
        );

        Role adminRole = new Role();
        adminRole.setName(RoleName.ROLE_ADMIN);

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("admin2");
        savedUser.setBranch(null);
        savedUser.setRoles(Set.of(adminRole));

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_ADMIN)).thenReturn(Optional.of(adminRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        authService.register(dto);

        // Then: se guardó sin sucursal
        verify(userRepository, times(1)).save(argThat(u -> u.getBranch() == null));
    }

    // ─── Caso 2: Operador sin sucursal → debe lanzar IllegalArgumentException ──
    @Test
    void operatorRegistration_withoutBranch_shouldThrowIllegalArgumentException() {
        // Given
        UserRegisterDTO dto = new UserRegisterDTO(
                "cajero1", "cajero@test.com", "pass123",
                "Cajero Uno", "ROLE_OPERATOR", null  // branchId = null (inválido para este rol)
        );

        Role operatorRole = new Role();
        operatorRole.setName(RoleName.ROLE_OPERATOR);

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_OPERATOR)).thenReturn(Optional.of(operatorRole));

        // When & Then
        assertThatThrownBy(() -> authService.register(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("sucursal");

        verify(userRepository, never()).save(any());
    }

    // ─── Caso 3: Usuario duplicado → debe lanzar IllegalArgumentException ─────
    @Test
    void registration_withDuplicateUsername_shouldThrowIllegalArgumentException() {
        // Given
        UserRegisterDTO dto = new UserRegisterDTO(
                "admin", "nuevo@test.com", "pass123",
                "Admin Dup", "ROLE_ADMIN", null
        );

        when(userRepository.existsByUsername("admin")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> authService.register(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already taken");

        verify(userRepository, never()).save(any());
    }

    // ─── Caso 4: Operador con sucursal válida → registra correctamente ────────
    @Test
    void operatorRegistration_withValidBranch_shouldSucceed() {
        // Given
        UserRegisterDTO dto = new UserRegisterDTO(
                "cajero2", "cajero2@test.com", "pass123",
                "Cajero Dos", "ROLE_OPERATOR", 1L
        );

        Role operatorRole = new Role();
        operatorRole.setName(RoleName.ROLE_OPERATOR);

        Branch branch = new Branch();
        branch.setId(1L);
        branch.setActive(true);

        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setBranch(branch);

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_OPERATOR)).thenReturn(Optional.of(operatorRole));
        when(branchRepository.findById(1L)).thenReturn(Optional.of(branch));
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        authService.register(dto);

        // Then: se guardó con sucursal asignada
        verify(userRepository, times(1)).save(argThat(u -> u.getBranch() != null));
    }
}
