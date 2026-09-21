import { useEffect, useState } from 'react';
import { createRealtimeClient } from './stompClient';

export function useRealtime({ token, tenantId, onEvent }) {
  const [state, setState] = useState('connecting');
  useEffect(() => {
    if (!token || !tenantId) return undefined;
    const client = createRealtimeClient({ token, tenantId, onEvent, onState: setState });
    client.activate();
    return () => { setState('disconnected'); client.deactivate(); };
  }, [token, tenantId, onEvent]);
  return state;
}
