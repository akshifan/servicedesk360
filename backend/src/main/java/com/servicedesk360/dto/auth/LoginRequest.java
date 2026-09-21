package com.servicedesk360.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String tenantCode,
        @NotBlank @Email String email,
        @NotBlank String password
) {
}
