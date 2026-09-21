package com.servicedesk360.dto.user;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull Boolean active
) {
}
