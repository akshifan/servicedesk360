# ServiceDesk 360 Database Design

## Database

The current implementation uses PostgreSQL and Flyway. The JDBC URL is configured through `DB_URL`; the default local value is `jdbc:postgresql://localhost:5432/servicedesk360`.

## Migration order

| Migration | Purpose |
|---|---|
| `V1__create_tenants_and_users.sql` | tenants and users |
| `V2__create_teams_queues_and_categories.sql` | teams, queues and categories |
| `V3__create_tickets_and_comments.sql` | tickets and ticket comments |
| `V4__create_tasks.sql` | employee tasks |
| `V5__create_sla_policies_and_ticket_deadlines.sql` | SLA policies and ticket deadline columns |
| `V6__create_audit_logs.sql` | append-oriented audit records |

## Tenant-scoped tables

The core tenant-owned records are users, teams, queues, categories, tickets, ticket comments, tasks, SLA policies and audit logs. Tenant IDs are stored directly on tenant-scoped records where practical so that query enforcement and indexing remain explicit.

## Constraints and indexes

The migrations define primary keys, foreign keys, tenant-aware uniqueness where applicable, status/priority checks and indexes for common tenant-scoped ticket/task queries.

## UTC timestamps

Application timestamps use `Instant`. Hibernate is configured with UTC JDBC time zone handling. PostgreSQL timestamp columns should be interpreted and displayed as UTC in API contracts.

## Local permission troubleshooting

If Flyway reports `permission denied for schema public`, run as a PostgreSQL administrator:

```sql
ALTER DATABASE servicedesk360 OWNER TO servicedesk360_app;
\c servicedesk360
ALTER SCHEMA public OWNER TO servicedesk360_app;
GRANT USAGE, CREATE ON SCHEMA public TO servicedesk360_app;
```

Never solve a production permission problem by making the application user a superuser.
