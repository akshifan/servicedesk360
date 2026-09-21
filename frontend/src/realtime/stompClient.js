import { Client } from '@stomp/stompjs';
import { notificationTopic, taskTopic, ticketTopic } from './realtimeTopics';

const configuredWsUrl = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/ws';
const wsUrl = configuredWsUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
export function createRealtimeClient({ token, tenantId, onEvent, onState }) {
  const client = new Client({
    brokerURL: wsUrl,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      onState?.('connected');
      [ticketTopic(tenantId), taskTopic(tenantId), notificationTopic].forEach(destination => client.subscribe(destination, message => onEvent?.(JSON.parse(message.body))));
    },
    onDisconnect: () => onState?.('disconnected'),
    onStompError: () => onState?.('error'),
    onWebSocketClose: () => onState?.('disconnected')
  });
  return client;
}
