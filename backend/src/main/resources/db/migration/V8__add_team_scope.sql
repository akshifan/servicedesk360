ALTER TABLE users
    ADD COLUMN team_id BIGINT;

ALTER TABLE users
    ADD CONSTRAINT fk_users_team_tenant
        FOREIGN KEY (team_id, tenant_id)
            REFERENCES teams (id, tenant_id)
            ON DELETE SET NULL;

ALTER TABLE tickets
    ADD COLUMN team_id BIGINT;

ALTER TABLE tickets
    ADD CONSTRAINT fk_tickets_team_tenant
        FOREIGN KEY (team_id, tenant_id)
            REFERENCES teams (id, tenant_id)
            ON DELETE SET NULL;

ALTER TABLE tasks
    ADD COLUMN team_id BIGINT;

ALTER TABLE tasks
    ADD CONSTRAINT fk_tasks_team_tenant
        FOREIGN KEY (team_id, tenant_id)
            REFERENCES teams (id, tenant_id)
            ON DELETE SET NULL;

CREATE INDEX idx_users_tenant_team
    ON users (tenant_id, team_id);

CREATE INDEX idx_tickets_tenant_team_status
    ON tickets (tenant_id, team_id, status);

CREATE INDEX idx_tasks_tenant_team_status
    ON tasks (tenant_id, team_id, status);
