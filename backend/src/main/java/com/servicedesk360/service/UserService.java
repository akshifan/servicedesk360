package com.servicedesk360.service;

import com.servicedesk360.dto.common.PageResponse;
import com.servicedesk360.dto.user.UpdateUserRoleRequest;
import com.servicedesk360.dto.user.UpdateUserStatusRequest;
import com.servicedesk360.dto.user.UserResponse;
import com.servicedesk360.dto.user.CreateUserRequest;
import com.servicedesk360.entity.Role;
import com.servicedesk360.entity.User;
import com.servicedesk360.exception.BusinessException;
import com.servicedesk360.exception.ResourceNotFoundException;
import com.servicedesk360.exception.UnauthorizedException;
import com.servicedesk360.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            CurrentUserService currentUserService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        CurrentUserService.CurrentUser current = requireTenantAdmin();
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (request.role() == Role.PLATFORM_ADMIN) {
            throw new BusinessException(
                    "INVALID_TENANT_ROLE",
                    "Tenant administrators cannot create platform administrators"
            );
        }
        if (userRepository.existsByTenantIdAndEmail(current.tenantId(), email)) {
            throw new BusinessException(
                    "USER_EMAIL_EXISTS",
                    "A user with this email already exists in the tenant"
            );
        }

        User user = new User(
                current.user().getTenant(),
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                request.role()
        );
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listUsers(Pageable pageable) {
        CurrentUserService.CurrentUser current = requireTenantManager();
        Page<UserResponse> users = userRepository
                .findAllByTenantId(current.tenantId(), pageable)
                .map(UserResponse::from);

        return PageResponse.from(users);
    }

    @Transactional
    public UserResponse updateStatus(
            Long userId,
            UpdateUserStatusRequest request
    ) {
        CurrentUserService.CurrentUser current = requireTenantAdmin();
        User target = findTenantUser(userId, current.tenantId());

        if (sameUser(current.user(), target) && !request.active()) {
            throw new BusinessException(
                    "CANNOT_DEACTIVATE_SELF",
                    "A tenant administrator cannot deactivate their own account"
            );
        }

        target.setActive(request.active());
        return UserResponse.from(target);
    }

    @Transactional
    public UserResponse updateRole(
            Long userId,
            UpdateUserRoleRequest request
    ) {
        CurrentUserService.CurrentUser current = requireTenantAdmin();
        User target = findTenantUser(userId, current.tenantId());

        if (sameUser(current.user(), target)) {
            throw new BusinessException(
                    "CANNOT_CHANGE_SELF_ROLE",
                    "A tenant administrator cannot change their own role"
            );
        }

        target.setRole(request.role());
        return UserResponse.from(target);
    }

    private CurrentUserService.CurrentUser requireTenantAdmin() {
        CurrentUserService.CurrentUser current = currentUserService.getRequiredUser();
        if (current.role() != Role.TENANT_ADMIN) {
            throw new UnauthorizedException("Tenant administrator role required");
        }
        return current;
    }

    private CurrentUserService.CurrentUser requireTenantManager() {
        CurrentUserService.CurrentUser current = currentUserService.getRequiredUser();
        if (current.role() != Role.TENANT_ADMIN && current.role() != Role.MANAGER) {
            throw new UnauthorizedException("Manager or tenant administrator role required");
        }
        return current;
    }

    private User findTenantUser(Long userId, Long tenantId) {
        return userRepository.findByIdAndTenantId(userId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean sameUser(User first, User second) {
        return first.getId() != null && first.getId().equals(second.getId());
    }
}
