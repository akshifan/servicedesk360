# Phase 0 Environment

## Baseline decision

The implementation will use the user-approved revised stack:

- Java 17+ (Java 17 compatibility baseline)
- Maven 3.8.4
- PostgreSQL 17
- Node.js 24.14.1
- npm 11.11.0
- Git 2.49.0

This intentionally differs from the attached PRD's original Java 21 and MySQL baseline. The application configuration, JDBC driver, schema conventions, and database documentation must use PostgreSQL consistently from Phase 1 onward.

## Verified local environment

- Java runtime: Java 17 or newer
- Java compiler: Java 17 or newer
- Maven: 3.8.4
- PostgreSQL server/client: 17.10
- PostgreSQL database: `servicedesk360`
- PostgreSQL readiness: accepting connections on the local Unix socket at `/tmp`, port `5432`

## Container startup note

The development container does not run `systemd`, so PostgreSQL is started directly with:

```bash
sudo -u postgres pg_ctl \
  -D /var/lib/pgsql/data \
  -l /var/lib/pgsql/data/server.log \
  -o "-k /tmp" \
  -w start
```

The Maven project targets Java 17, so Java 17 or newer can run Maven commands:

```bash
mvn clean test
```

No credentials, database passwords, JWT secrets, or private keys are stored in this repository.
