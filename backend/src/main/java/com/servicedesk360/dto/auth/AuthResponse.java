package com.servicedesk360.dto.auth;

import com.servicedesk360.dto.user.UserResponse;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds,
        UserResponse user
) {
}
