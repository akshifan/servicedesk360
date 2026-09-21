# ServiceDesk 360 Testing

## Backend command

From the `backend` directory:

```powershell
mvn clean test
```

The current test suite includes:

- tenant persistence and same-email isolation across tenants
- registration creates a tenant administrator
- invalid login password rejection
- task transition and assignment rules
- tenant-admin user role management
- non-admin user-management rejection

## Manual integration smoke test

1. Start PostgreSQL.
2. Set the backend environment variables.
3. Run `mvn clean test`.
4. Start the API with `mvn spring-boot:run`.
5. Confirm `/actuator/health` returns `UP`.
6. Register a first tenant administrator through the React `/register` page or the API.
7. Sign in through the React landing page and `/login`.
8. Confirm the app redirects to `/app`.
9. Confirm dashboard, ticket list and task list load.
10. Sign in as `TENANT_ADMIN` and open `/app/admin`.
11. Create a worker and verify the account appears in the tenant directory.
12. Create an open ticket and open team work from the admin control room.
13. Create a ticket through the API and verify it appears in the ticket list.
14. Change the ticket status and add a comment.
15. Verify a user from another tenant cannot access the record.

## Required security scenarios before production claims

- first-workspace registration succeeds without a setup token in `FIRST_WORKSPACE_ONLY` mode
- workspace registration is rejected after the first tenant exists in `FIRST_WORKSPACE_ONLY` mode
- multiple organizations can register in `OPEN` mode
- tenant A cannot read tenant B tickets
- tenant A cannot assign a tenant B user
- requester cannot perform manager/admin-only operations
- tenant A admin receives only tenant A audit rows
- unauthorized STOMP subscriptions are rejected
- inactive users cannot authenticate
- non-admin users are redirected away from `/app/admin`
- direct `POST /api/users` calls from non-admin users are rejected
- `POST /api/users` never accepts or trusts a client tenant ID
- notification list/read operations cannot cross user or tenant boundaries
- team, queue and category operations cannot cross tenant boundaries

## Frontend command

From the `frontend` directory:

```powershell
npm install
npm run build
```

The current build has been verified successfully. Requester, agent, manager and tenant-admin dashboard responses are role-scoped. The frontend does not yet include a browser automation test suite.

## Coverage policy

No percentage coverage claim is made. Add and run a coverage tool such as JaCoCo before publishing any numeric coverage statement.
