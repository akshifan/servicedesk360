# ServiceDesk 360 WebSocket Design

## Current foundation

The backend exposes `/ws` using Spring WebSocket/STOMP configuration and a simple in-memory broker. No Redis, Kafka, RabbitMQ or other external broker is required for the base project.

Broker prefixes:

- `/topic` for tenant/team broadcasts
- `/queue` for queue-style destinations
- `/user` for user destinations
- `/app` for client-to-server message mappings when required

## Intended destinations

```text
/topic/tenant/{tenantId}/tickets
/topic/tenant/{tenantId}/tasks
/user/queue/notifications
```

State-changing operations should normally use REST first. After a successful transaction, the server can publish a stable event payload to authorized subscribers.

## Authorization model

The WebSocket channel interceptor validates the authenticated principal on STOMP messages. Tenant destination IDs must match the authenticated tenant. A client must not be able to subscribe to another tenant's topic by changing a URL segment.

## Event vocabulary

The intended event types are:

- `TICKET_CREATED`
- `TICKET_UPDATED`
- `TICKET_ASSIGNED`
- `TICKET_STATUS_CHANGED`
- `TASK_CREATED`
- `TASK_UPDATED`
- `SLA_AT_RISK`
- `SLA_BREACHED`
- `NOTIFICATION_CREATED`

## Client behavior

The React client now has a STOMP/SockJS client with JWT connect headers, tenant ticket/task subscriptions, personal notification subscription, controlled reconnect delay and ticket-page refetch on events. The backend publishes persisted notification events for assignment/status/task-assignment flows.

The in-memory broker remains a base-project limitation; production scaling would require a separately designed broker and deployment strategy.
