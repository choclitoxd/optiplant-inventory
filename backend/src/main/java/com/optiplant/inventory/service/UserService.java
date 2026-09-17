package com.optiplant.inventory.service;

import com.optiplant.inventory.domain.dto.AuthDTOs.UserUpdateDTO;
import com.optiplant.inventory.domain.entity.Branch;
import com.optiplant.inventory.domain.entity.Role;
import com.optiplant.inventory.domain.entity.RoleName;
import com.optiplant.inventory.domain.entity.User;
import com.optiplant.inventory.repository.BranchRepository;
import com.optiplant.inventory.repository.RoleRepository;
import com.optiplant.inventory.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, BranchRepository branchRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.branchRepository = branchRepository;
    }

    public List<User> getAllUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        
        List<User> allUsers = userRepository.findAll();
        
        if (isAdmin) {
            return allUsers;
        } else {
            String username = auth.getName();
            User currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            return allUsers.stream()
                    .filter(u -> u.getBranch() != null && u.getBranch().getId().equals(currentUser.getBranch().getId()))
                    .collect(Collectors.toList());
        }
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
        validateManagerAccess(user);
        return user;
    }

    private void validateManagerAccess(User targetUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Admin bypasses all branch isolation checks
        if (auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) return;

        String username = auth.getName();
        User currentUser = userRepository.findByUsername(username).orElseThrow();
        Long managerBranchId = currentUser.getBranch() != null ? currentUser.getBranch().getId() : null;
        Long targetBranchId  = targetUser.getBranch()  != null ? targetUser.getBranch().getId()  : null;

        if (managerBranchId == null || !managerBranchId.equals(targetBranchId)) {
            throw new SecurityException("No tienes permiso para gestionar a este usuario.");
        }
    }

    @Transactional
    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, UserUpdateDTO updateDTO) {
        User user = getUserById(id);

        if (!user.getUsername().equals(updateDTO.username()) && userRepository.existsByUsername(updateDTO.username())) {
            throw new IllegalArgumentException("Error: Username is already taken!");
        }
        if (!user.getEmail().equals(updateDTO.email()) && userRepository.existsByEmail(updateDTO.email())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(updateDTO.role().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Error: Invalid role.");
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        
        if (!isAdmin && roleName == RoleName.ROLE_ADMIN) {
            throw new SecurityException("Un gerente no puede asignar el rol de ADMIN.");
        }
        
        if (!isAdmin) {
            String username = auth.getName();
            User currentUser = userRepository.findByUsername(username).orElseThrow();
            if (updateDTO.branchId() == null || !updateDTO.branchId().equals(currentUser.getBranch().getId())) {
                throw new SecurityException("Solo puedes asignar usuarios a tu propia sucursal.");
            }
        }

        Role userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        Branch branch = null;
        if (roleName != RoleName.ROLE_ADMIN) {
            if (updateDTO.branchId() == null) {
                throw new IllegalArgumentException("Error: Este rol requiere asignar una sucursal.");
            }
            branch = branchRepository.findById(updateDTO.branchId())
                    .orElseThrow(() -> new IllegalArgumentException("Error: Branch not found."));
        }

        user.setUsername(updateDTO.username());
        user.setEmail(updateDTO.email());
        user.setFullName(updateDTO.fullName());
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        user.setBranch(branch);

        return userRepository.save(user);
    }
}
