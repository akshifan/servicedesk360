package com.servicedesk360.service;

import com.servicedesk360.dto.auth.AuthResponse;
import com.servicedesk360.dto.auth.LoginRequest;
import com.servicedesk360.dto.auth.RegisterRequest;
import com.servicedesk360.dto.user.UserResponse;
import com.servicedesk360.entity.Role;
import com.servicedesk360.entity.Tenant;
import com.servicedesk360.entity.User;
import com.servicedesk360.exception.BusinessException;
import com.servicedesk360.exception.UnauthorizedException;
import com.servicedesk360.repository.TenantRepository;
import com.servicedesk360.repository.UserRepository;
import com.servicedesk360.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.registration.mode:FIRST_WORKSPACE_ONLY}")
    private String registrationMode = "FIRST_WORKSPACE_ONLY";

    public AuthService(
            TenantRepository tenantRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        authorizeWorkspaceRegistration();
        String tenantCode = normalize(request.tenantCode());
        String email = normalize(request.email());

        if (tenantRepository.existsByCode(tenantCode)) {
            throw new BusinessException("TENANT_CODE_EXISTS", "Tenant code is already registered");
        }

        Tenant tenant = tenantRepository.saveAndFlush(
                new Tenant(request.tenantName().trim(), tenantCode)
        );

        User user = userRepository.save(
                new User(
                        tenant,
                        request.name().trim(),
                        email,
                        passwordEncoder.encode(request.password()),
                        Role.TENANT_ADMIN
                )
        );

        return createAuthResponse(user);
    }

    private void authorizeWorkspaceRegistration() {
        String mode = registrationMode == null
                ? "FIRST_WORKSPACE_ONLY"
                : registrationMode.trim().toUpperCase(Locale.ROOT);

        if ("OPEN".equals(mode)) {
            return;
        }

        if ("FIRST_WORKSPACE_ONLY".equals(mode) && tenantRepository.count() == 0) {
            return;
        }

        throw new UnauthorizedException(
                "Workspace registration is currently closed. Ask a tenant administrator to create your account."
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String tenantCode = normalize(request.tenantCode());
        String email = normalize(request.email());

        User user = userRepository.findByTenant_CodeAndEmail(tenantCode, email)
                .filter(User::isActive)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        return new AuthResponse(
                jwtService.issueToken(user),
                "Bearer",
                jwtService.getExpirationSeconds(),
                UserResponse.from(user)
        );
    }

    private String normalize(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }
}
