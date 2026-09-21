# ServiceDesk 360

ServiceDesk 360 is a modular-monolith service desk baseline with a Spring Boot backend, PostgreSQL persistence, JWT authentication, tenant-aware data access, a React/Vite frontend, and a Spring STOMP/WebSocket foundation.

> This repository is an implementation baseline through the current integration/UI phases. It is not a claim that every PRD feature is production-complete. See [Known limitations](#known-limitations).

## Stack

- Java 17+
- Spring Boot 4.1.1
- Spring Security and JWT bearer authentication
- Spring Data JPA / Hibernate
- PostgreSQL
- Flyway migrations
- React 19 + Vite
- React Router
- STOMP/WebSocket foundation with Spring's simple broker
- Maven and npm

The implemented version uses PostgreSQL rather than the original PRD's MySQL baseline, as approved during the build.

## Repository layout

```text
servicedesk360/
├── backend/       Spring Boot API and migrations
├── frontend/      React/Vite SPA
├── docs/          Architecture, database, API, testing and deployment notes
└── README.md
```

## Prerequisites on Windows

Install and verify:

```powershell
java --version
javac --version
mvn --version
node --version
npm --version
psql --version
```

Use Java 17 or newer. The Maven project is configured with Java 17 compatibility,
so an installed Java 17 JDK is sufficient.

## PostgreSQL setup

Create the database and application user in pgAdmin or `psql` as a PostgreSQL administrator. Replace the password if you choose a different local password.

```sql
CREATE USER servicedesk360_app WITH PASSWORD 'servicedesk';
CREATE DATABASE servicedesk360 OWNER servicedesk360_app;
\c servicedesk360
ALTER SCHEMA public OWNER TO servicedesk360_app;
GRANT USAGE, CREATE ON SCHEMA public TO servicedesk360_app;
```

## Backend configuration

The backend targets Java 17 and loads local settings automatically from `backend/.env`.
Create it once:

```powershell
Copy-Item .\backend\.env.example .\backend\.env
```

Edit `backend/.env` if your PostgreSQL username, password or database name differs.
The file is ignored by Git. Do not commit real passwords, JWT secrets, private keys,
or production credentials.

## Run the backend

```powershell
cd .\backend
mvn clean test
mvn spring-boot:run
```

Verify health in a second PowerShell window:

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health
```

Expected result:

```json
{"status":"UP"}
```

Flyway applies migrations from `backend/src/main/resources/db/migration` on startup.

## Run the frontend

```powershell
cd .\frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The public landing page is at `/`; sign-in is at `/login`; the protected workspace begins at `/app`.

## Create a local account

The baseline does not seed a built-in password. Registration supports two modes: `FIRST_WORKSPACE_ONLY` (the safe default) allows one initial tenant, while `OPEN` allows multiple organizations to create their own tenant administrator through `/register`. Use `OPEN` only when public organization creation is intentional; in a production deployment, add an approval or email-verification workflow before enabling it. Tenant administrators create workers from `/app/admin`.

```powershell
$body = @{
    tenantName = "Demo Organization"
    tenantCode = "demo"
    name       = "Demo Admin"
    email      = "admin@example.com"
    password   = "AdminPassword123!"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:8080/api/auth/register" `
    -ContentType "application/json" `
    -Body $body
```

Then sign in at `http://localhost:5173/login` using the same tenant code, email and password.

## Current validation commands

Backend:

```powershell
cd backend
mvn clean test
```

Frontend:

```powershell
cd frontend
npm install
npm run build
```

No coverage percentage is claimed unless a coverage report is generated and recorded.

## Known limitations

- The React UI is a professional responsive baseline, not the complete PRD UI surface.
- The frontend includes a setup-token-protected first-workspace registration page, a tenant-admin control room, worker registration, open-ticket creation/status controls and open team-work creation. Full assignment screens, comments UI and some advanced admin workflows are still pending.
- The backend uses an in-memory STOMP broker; it is suitable for the base project but not a scaled multi-instance deployment.
- Notifications are persisted for assignment/status/task-assignment flows; a broader event catalogue still requires additional business wiring.
- SLA policies and ticket deadline calculation are implemented; full at-risk/breached dashboard semantics and scheduled escalation are not complete.
- Automated tests cover selected persistence and service paths. No overall coverage percentage is claimed.
- Deployment instructions are portfolio/demo guidance and are not a production availability guarantee.

## Further documentation

- [Architecture](docs/architecture.md)
- [Database design](docs/database-design.md)
- [API reference](docs/api-reference.md)
- [WebSocket design](docs/websocket-design.md)
- [Testing](docs/testing.md)
- [Deployment](docs/deployment.md)
