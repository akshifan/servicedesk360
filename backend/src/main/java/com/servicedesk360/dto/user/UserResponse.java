package com.servicedesk360.dto.user;

import com.servicedesk360.entity.User;

public record UserResponse(
        Long id,
        Long tenantId,
        String tenantCode,
        String name,
        String email,
        String role,
        boolean active,
        Long teamId
) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getTenant().getId(),
                user.getTenant().getCode(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
            user.getTeam() == null
                ? null
                : user.getTeam().getId()
        );
    }
}
