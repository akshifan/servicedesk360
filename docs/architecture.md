# ServiceDesk 360 Architecture

## Runtime shape

```text
React/Vite SPA
    │ HTTPS JSON / STOMP over WebSocket
    ▼
Spring Boot controllers and messaging configuration
    │
    ├── Spring Security JWT authentication
    ├── DTO validation and stable error handling
    ├── Tenant-aware services
    ├── JPA repositories
    └── Flyway-managed PostgreSQL schema
```

The backend is a modular monolith. Controllers adapt HTTP or messaging input, services own business rules, repositories own persistence queries, and DTOs define the public API contract.

## Tenant resolution

1. A user logs in with a tenant code and email.
2. The JWT subject identifies the user and includes the tenant context used by the security layer.
3. `CurrentUserService` resolves the authenticated user from the security principal.
4. Tenant-scoped service operations use the authenticated user's tenant ID.
5. Repository lookups include tenant ownership where the operation is tenant-scoped.

A client-supplied tenant ID is not used as the security boundary. Registration is configurable: `FIRST_WORKSPACE_ONLY` is the safe default, while `OPEN` permits multiple organizations to create their own tenant administrator. If `OPEN` is used outside a local/demo environment, add approval or email verification before treating it as production-ready. Authenticated tenant administrators create workers through the control room.

## Backend modules

- `controller`: REST endpoints
- `dto`: request and response records
- `entity`: JPA entities and enums
- `repository`: Spring Data persistence queries
- `service`: authentication, users, tickets, tasks, SLA, dashboard and audit rules
- `security`: JWT decoder/converter, password hashing and security rules
- `websocket`: STOMP endpoint, channel interceptor and event payload foundation
- `exception`: stable API error mapping

## Frontend routes

- `/`: public glassmorphism landing page
- `/login`: public authentication screen
- `/register`: organization registration screen; the first account for each newly created tenant becomes `TENANT_ADMIN`, and later workers are created by that admin
- `/app`: protected dashboard
- `/app/tickets`: protected ticket list
- `/app/tasks`: protected task list
- `/app/admin`: tenant-administrator control room; protected by both frontend role routing and backend service authorization

The frontend stores the authentication response in browser local storage through `AuthContext`. REST calls are kept in `src/api`; cross-page authentication state is kept in Context rather than Redux.

## Security boundary

The backend remains authoritative. Frontend route protection improves UX but does not replace Spring Security authorization or tenant-aware service checks.
