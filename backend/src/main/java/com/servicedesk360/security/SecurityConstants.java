package com.servicedesk360.security;

public final class SecurityConstants {

    public static final String AUTH_BASE_PATH = "/api/auth/**";
    public static final String HEALTH_PATH = "/actuator/health";
    public static final String ROLE_CLAIM = "role";
    public static final String USER_ID_CLAIM = "userId";
    public static final String TENANT_ID_CLAIM = "tenantId";

    private SecurityConstants() {
    }
}
