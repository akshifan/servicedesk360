package com.servicedesk360.service;

import com.servicedesk360.dto.user.UpdateUserRoleRequest;
import com.servicedesk360.dto.user.CreateUserRequest;
import com.servicedesk360.entity.Role;
import com.servicedesk360.entity.Tenant;
import com.servicedesk360.entity.User;
import com.servicedesk360.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CurrentUserService currentUserService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void tenantAdminCanChangeAnotherUsersRoleInsideTheirTenant() {
        Tenant tenant = mock(Tenant.class);
        User admin = mock(User.class);
        User target = mock(User.class);

        when(admin.getId()).thenReturn(1L);
        when(target.getId()).thenReturn(2L);
        when(target.getTenant()).thenReturn(tenant);
        when(target.getName()).thenReturn("Agent");
        when(target.getEmail()).thenReturn("agent@example.com");
        when(target.getRole()).thenReturn(Role.AGENT);
        when(target.isActive()).thenReturn(true);
        when(tenant.getId()).thenReturn(10L);
        when(tenant.getCode()).thenReturn("demo");

        when(currentUserService.getRequiredUser()).thenReturn(
                new CurrentUserService.CurrentUser(admin, 10L, Role.TENANT_ADMIN)
        );
        when(userRepository.findByIdAndTenantId(2L, 10L))
                .thenReturn(Optional.of(target));

        var response = userService.updateRole(
                2L,
                new UpdateUserRoleRequest(Role.MANAGER)
        );

        assertThat(response.email()).isEqualTo("agent@example.com");
        verify(target).setRole(Role.MANAGER);
    }

    @Test
    void nonAdminCannotManageTenantUsers() {
        User agent = mock(User.class);

        when(currentUserService.getRequiredUser()).thenReturn(
                new CurrentUserService.CurrentUser(agent, 10L, Role.AGENT)
        );

        assertThatThrownBy(() -> userService.updateRole(
                2L,
                new UpdateUserRoleRequest(Role.MANAGER)
        )).isInstanceOf(com.servicedesk360.exception.UnauthorizedException.class);
    }

    @Test
    void tenantAdminCreatesWorkerWithoutAcceptingTenantFromRequest() {
        Tenant tenant = mock(Tenant.class);
        User admin = mock(User.class);

        when(admin.getTenant()).thenReturn(tenant);
        when(tenant.getId()).thenReturn(10L);
        when(tenant.getCode()).thenReturn("demo");
        when(currentUserService.getRequiredUser()).thenReturn(
                new CurrentUserService.CurrentUser(admin, 10L, Role.TENANT_ADMIN)
        );
        when(userRepository.existsByTenantIdAndEmail(10L, "worker@example.com"))
                .thenReturn(false);
        when(passwordEncoder.encode("strong-worker-password"))
                .thenReturn("encoded-worker-password");
        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = userService.createUser(new CreateUserRequest(
                "Worker",
                "WORKER@EXAMPLE.COM",
                "strong-worker-password",
                Role.AGENT
        ));

        assertThat(response.tenantId()).isEqualTo(10L);
        assertThat(response.tenantCode()).isEqualTo("demo");
        assertThat(response.email()).isEqualTo("worker@example.com");
        assertThat(response.role()).isEqualTo("AGENT");
        verify(passwordEncoder).encode("strong-worker-password");
    }
}
