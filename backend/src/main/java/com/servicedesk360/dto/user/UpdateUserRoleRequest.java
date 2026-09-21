package com.servicedesk360.dto.user;

import com.servicedesk360.entity.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull Role role
) {
}
