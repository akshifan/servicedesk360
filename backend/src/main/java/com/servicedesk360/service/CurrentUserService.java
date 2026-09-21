package com.servicedesk360.service;

import com.servicedesk360.dto.user.UserResponse;
import com.servicedesk360.entity.Role;
import com.servicedesk360.entity.User;
import com.servicedesk360.exception.UnauthorizedException;
import com.servicedesk360.repository.UserRepository;
import com.servicedesk360.security.SecurityConstants;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public CurrentUser getRequiredUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken jwtAuthentication)) {
            throw new UnauthorizedException("An authenticated user is required");
        }

        Number userIdClaim = jwtAuthentication.getToken().getClaim(SecurityConstants.USER_ID_CLAIM);
        Number tenantIdClaim = jwtAuthentication.getToken().getClaim(SecurityConstants.TENANT_ID_CLAIM);
        if (userIdClaim == null || tenantIdClaim == null) {
            throw new UnauthorizedException("The authentication token is incomplete");
        }

        Long userId = userIdClaim.longValue();
        Long tenantId = tenantIdClaim.longValue();
        User user = userRepository.findByIdAndTenantId(userId, tenantId)
                .filter(User::isActive)
                .orElseThrow(() -> new UnauthorizedException("User is inactive or not found"));

        return new CurrentUser(user, tenantId, user.getRole());
    }

    @Transactional(readOnly = true)
    public UserResponse getRequiredUserResponse() {
        return UserResponse.from(getRequiredUser().user());
    }

    public record CurrentUser(User user, Long tenantId, Role role) {
    }
}
