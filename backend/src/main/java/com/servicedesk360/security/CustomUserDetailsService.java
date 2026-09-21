package com.servicedesk360.security;

import com.servicedesk360.entity.User;
import com.servicedesk360.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String tenantScopedUsername) {
        String[] parts = tenantScopedUsername.split("\\|", 2);
        if (parts.length != 2) {
            throw new UsernameNotFoundException(
                    "Tenant-scoped username must use tenantCode|email format"
            );
        }

        User user = userRepository.findByTenant_CodeAndEmail(parts[0], parts[1])
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(tenantScopedUsername)
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .disabled(!user.isActive())
                .build();
    }
}
