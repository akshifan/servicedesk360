package com.servicedesk360.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 200) String tenantName,
        @NotBlank @Size(max = 64) String tenantCode,
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Email @Size(max = 320) String email,
        @NotBlank @Size(min = 12, max = 128) String password
) {
}
