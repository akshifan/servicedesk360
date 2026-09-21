package com.servicedesk360.dto.common;

import java.time.Instant;

public record ApiError(
        Instant timestamp,
        int status,
        String code,
        String message,
        String path
) {
}
