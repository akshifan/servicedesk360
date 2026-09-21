# ServiceDesk 360 API Reference

Base URL: `http://localhost:8080/api`

All protected endpoints require:

```http
Authorization: Bearer <access-token>
```

## Authentication

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Create a tenant and first tenant administrator |
| POST | `/auth/login` | Authenticate by tenant code and email |

Registration fields: `tenantName`, `tenantCode`, `name`, `email`, `password`. Passwords must contain at least 12 characters. The `REGISTRATION_MODE` setting controls registration: `FIRST_WORKSPACE_ONLY` permits only the first tenant, while `OPEN` permits multiple organizations to create their own tenant administrator. Tenant administrators create workers through `POST /api/users`.

## Users

| Method | Path | Purpose |
|---|---|---|
| GET | `/users/me` | Current user profile |
| GET | `/users` | Tenant user list; tenant administrator only |
| POST | `/users` | Create a same-tenant worker; tenant administrator only |
| PATCH | `/users/{id}/status` | Activate/deactivate a user |
| PATCH | `/users/{id}/role` | Change a user's role |

## Tickets

| Method | Path | Purpose |
|---|---|---|
| GET | `/tickets` | Tenant-scoped paginated list |
| GET | `/tickets/{id}` | Ticket detail |
| POST | `/tickets` | Create a ticket |
| PATCH | `/tickets/{id}/status` | Validate and change status |
| PATCH | `/tickets/{id}/assignment` | Assign to a same-tenant user |
| PATCH | `/tickets/{id}/priority` | Change priority for manager/admin roles |
| POST | `/tickets/{id}/comments` | Add a requester-visible or internal comment |
| GET | `/tickets/{id}/comments` | List comments visible to the current user |

Create-ticket example:

```json
{
  "title": "VPN access issue",
  "description": "Unable to connect to the company VPN.",
  "priority": "HIGH"
}
```

Supported ticket statuses include `OPEN`, `IN_PROGRESS`, `WAITING_FOR_REQUESTER`, `RESOLVED`, `CLOSED` and `CANCELLED`. Transitions are checked in the service layer.

## Tasks

| Method | Path | Purpose |
|---|---|---|
| GET | `/tasks` | Tenant-scoped paginated list |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/{id}` | Update editable task fields |
| PATCH | `/tasks/{id}/status` | Validate and change task status |

## Notifications

| Method | Path | Purpose |
|---|---|---|
| GET | `/notifications` | Current user's tenant-scoped inbox |
| GET | `/notifications/unread-count` | Current user's unread count |
| PATCH | `/notifications/{id}/read` | Mark one notification read |

## Tenant administration

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/admin/teams` | List/create tenant teams |
| GET/POST | `/admin/queues` | List/create tenant queues |
| GET/POST | `/admin/categories` | List/create tenant categories |

## SLA, dashboard and audit

| Method | Path | Purpose |
|---|---|---|
| GET | `/sla/policies` | List tenant SLA policies |
| POST | `/sla/policies` | Create an SLA policy |
| PUT | `/sla/policies/{id}` | Update an SLA policy |
| GET | `/dashboard/summary` | Manager/admin dashboard counters |
| GET | `/audit-logs` | Tenant administrator audit query |

## Health

The actuator health endpoint is outside `/api`:

```text
GET http://localhost:8080/actuator/health
```

## Error envelope

Validation and domain errors are returned through the centralized exception handler with timestamp, status, code, message and path fields. Do not expose stack traces or secrets to clients.
