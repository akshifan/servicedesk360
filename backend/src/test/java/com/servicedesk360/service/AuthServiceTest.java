package com.servicedesk360.service;

import com.servicedesk360.dto.auth.AuthResponse;
import com.servicedesk360.dto.auth.LoginRequest;
import com.servicedesk360.dto.auth.RegisterRequest;
import com.servicedesk360.entity.Tenant;
import com.servicedesk360.entity.User;
import com.servicedesk360.repository.TenantRepository;
import com.servicedesk360.repository.UserRepository;
import com.servicedesk360.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registrationCreatesTheFirstUserAsTenantAdmin() {
        RegisterRequest request = new RegisterRequest(
                "Acme Support",
                " ACME ",
                "Tenant Admin",
                "ADMIN@EXAMPLE.COM",
                "a-strong-password"
        );
        Tenant tenant = new Tenant("Acme Support", "acme");

        when(tenantRepository.existsByCode("acme")).thenReturn(false);
        when(tenantRepository.saveAndFlush(any(Tenant.class))).thenReturn(tenant);
        when(passwordEncoder.encode("a-strong-password")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.issueToken(any(User.class))).thenReturn("jwt-token");
        when(jwtService.getExpirationSeconds()).thenReturn(3600L);

        AuthResponse response = authService.register(request);

        assertThat(response.accessToken()).isEqualTo("jwt-token");
        assertThat(response.user().role()).isEqualTo("TENANT_ADMIN");
        assertThat(response.user().email()).isEqualTo("admin@example.com");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getPasswordHash()).isEqualTo("encoded-password");
    }

    @Test
    void registrationClosesAfterTheFirstWorkspaceExists() {
        when(tenantRepository.count()).thenReturn(1L);

        assertThatThrownBy(() -> authService.register(new RegisterRequest(
                "Another Organization",
                "another",
                "Another Admin",
                "another@example.com",
                "a-strong-password"
        )))
                .isInstanceOf(com.servicedesk360.exception.UnauthorizedException.class)
                .hasMessage(
                    "Workspace registration is currently closed. "
                        + "Ask a tenant administrator to create your account."
                );
    }

    @Test
    void loginRejectsAnIncorrectPasswordBeforeIssuingJwt() {
        Tenant tenant = new Tenant("Acme Support", "acme");
        User user = new User(tenant, "Agent", "agent@example.com", "encoded-password", com.servicedesk360.entity.Role.AGENT);

        when(userRepository.findByTenant_CodeAndEmail("acme", "agent@example.com"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-password"))
                .thenReturn(false);

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> authService.login(
                new LoginRequest("ACME", "AGENT@EXAMPLE.COM", "wrong-password")
        )).isInstanceOf(com.servicedesk360.exception.UnauthorizedException.class);
    }
}
