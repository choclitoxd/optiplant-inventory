package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.AuthDTOs.AuthResponseDTO;
import com.optiplant.inventory.domain.dto.AuthDTOs.LoginRequestDTO;
import com.optiplant.inventory.domain.dto.AuthDTOs.UserRegisterDTO;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.domain.entity.Role;
import com.optiplant.inventory.domain.entity.RoleName;
import com.optiplant.inventory.domain.entity.User;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.RoleRepository;
import com.optiplant.inventory.repository.UserRepository;
import com.optiplant.inventory.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       RoleRepository roleRepository, BranchRepository branchRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        Authentication authentication = null;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }

        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByUsername(loginRequest.username()).orElseThrow();
        
        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new AuthResponseDTO(
                jwt,
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                roles,
                user.getBranch() != null ? user.getBranch().getId() : null
        );
    }

    @Transactional
    public void register(UserRegisterDTO registerDTO) {
        if (userRepository.existsByUsername(registerDTO.username())) {
            throw new IllegalArgumentException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(registerDTO.email())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(registerDTO.role().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Error: Invalid role.");
        }

        Role userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            if (!isAdmin) {
                if (roleName == RoleName.ROLE_ADMIN) {
                    throw new SecurityException("Un gerente no puede crear un administrador.");
                }
                String username = auth.getName();
                User currentUser = userRepository.findByUsername(username).orElseThrow();
                if (registerDTO.branchId() == null || !registerDTO.branchId().equals(currentUser.getBranch().getId())) {
                    throw new SecurityException("Solo puedes crear usuarios en tu propia sucursal.");
                }
            }
        }

        Branch branch = null;
        if (roleName != RoleName.ROLE_ADMIN) {
            if (registerDTO.branchId() == null) {
                throw new IllegalArgumentException("Error: Este rol requiere asignar una sucursal.");
            }
            branch = branchRepository.findById(registerDTO.branchId())
                    .orElseThrow(() -> new IllegalArgumentException("Error: Branch not found."));
        }

        User user = User.builder()
                .username(registerDTO.username())
                .email(registerDTO.email())
                .password(passwordEncoder.encode(registerDTO.password()))
                .fullName(registerDTO.fullName())
                .branch(branch)
                .roles(Collections.singleton(userRole))
                .active(true)
                .build();

        userRepository.save(user);
    }
}
