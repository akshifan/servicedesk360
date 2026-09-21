# ServiceDesk 360 Deployment Notes

This document describes a portfolio/demo deployment shape. Provider pricing, limits and eligibility change; verify current provider documentation before deploying.

## Frontend

The Vite frontend can be deployed to Vercel or another static host.

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

Set:

```text
VITE_API_BASE_URL=https://<backend-host>/api
VITE_WS_BASE_URL=https://<backend-host>/ws
```

## Backend

Deploy the Spring Boot service to a WebSocket-capable host. Set these environment variables in the host configuration, not in Git:

```text
DB_URL=jdbc:postgresql://<database-host>:5432/servicedesk360
DB_USERNAME=<database-user>
DB_PASSWORD=<database-password>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRATION_SECONDS=3600
FRONTEND_URL=https://<frontend-origin>
```

Health check path:

```text
/actuator/health
```

The production JPA setting should remain schema-validation or migration-controlled. Do not use destructive schema auto-creation for production data.

## CORS and WebSocket checks

- Set `FRONTEND_URL` to the exact deployed frontend origin.
- Use HTTPS for the API and WSS for the WebSocket endpoint.
- Verify login from the deployed frontend.
- Verify the actuator health endpoint.
- Verify the WebSocket handshake from an allowed origin.
- Re-test tenant isolation after deployment.

## Free-tier truthfulness

A free web service may sleep or have usage limits. AWS free programs may be credit- or eligibility-based. These options should be treated as demo infrastructure, not as a permanent uptime or cost guarantee.
