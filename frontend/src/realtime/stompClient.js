import { Client } from '@stomp/stompjs';
import { notificationTopic, taskTopic, ticketTopic } from './realtimeTopics';

const configuredWsUrl =
  import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8080/ws';

const wsUrl = configuredWsUrl
  .replace(/^http:/, 'ws:')
  .replace(/^https:/, 'wss:');

export function createRealtimeClient({ token, tenantId, onEvent, onState }) {
  const client = new Client({
    brokerURL: wsUrl,

    connectHeaders: token
      ? { Authorization: `Bearer ${token}` }
      : {},

    reconnectDelay: 5000,

    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: (message) => {
      console.log('[STOMP]', message);
    },

    onConnect: () => {
      console.log('[STOMP] CONNECTED');

      onState?.('connected');

      [
        ticketTopic(tenantId),
        taskTopic(tenantId),
        notificationTopic
      ].forEach(destination => {
        console.log('[STOMP] Subscribing:', destination);

        client.subscribe(destination, message => {
          onEvent?.(JSON.parse(message.body));
        });
      });
    },

    onStompError: (frame) => {
      console.error('[STOMP ERROR]', frame);
      console.error('[STOMP ERROR HEADERS]', frame.headers);
      console.error('[STOMP ERROR BODY]', frame.body);

      onState?.('error');
    },

    onWebSocketError: (event) => {
      console.error('[WEBSOCKET ERROR]', event);
    },

    onWebSocketClose: (event) => {
      console.error('[WEBSOCKET CLOSED]', event);
      console.error('Code:', event.code);
      console.error('Reason:', event.reason);

      onState?.('disconnected');
    },

    onDisconnect: () => {
      console.log('[STOMP] DISCONNECTED');
      onState?.('disconnected');
    }
  });

  return client;
}
