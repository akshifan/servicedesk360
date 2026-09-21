import {
  useCallback,
  useEffect,
  useState
} from 'react';
import { useRealtime } from '../realtime/useRealtime';
import { getSummary } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';

const definitions = {
  REQUESTER: [['myOpenTickets', 'My open tickets'], ['myOpenTasks', 'My open work']],
  AGENT: [['myOpenTickets', 'Assigned tickets'], ['myOpenTasks', 'Assigned work']],
  MANAGER: [['openTickets', 'Open tickets'], ['inProgressTickets', 'In progress'], ['openTasks', 'Open team work'], ['completedTasks', 'Completed work'], ['totalUsers', 'Team members'], ['myOpenTickets', 'My assigned tickets']],
  TENANT_ADMIN: [['openTickets', 'Open tickets'], ['inProgressTickets', 'In progress'], ['openTasks', 'Open team work'], ['completedTasks', 'Completed work'], ['totalUsers', 'Tenant users'], ['myOpenTickets', 'My assigned tickets']]
};

const descriptions = {
  REQUESTER: 'Track your requests, current status and work connected to your support needs.',
  AGENT: 'Focus on the tickets and team work assigned to you.',
  MANAGER: 'Monitor team workload, ticket flow and delivery progress.',
  TENANT_ADMIN: 'Manage the tenant operation, people and overall service desk health.'
};

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    return getSummary(token)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime({
    token,
    tenantId: user?.tenantId,
    onEvent: load
  });  const role = data?.role || user?.role || 'REQUESTER';
  const cards = definitions[role] || definitions.REQUESTER;

  return <section className="dashboard-page"><div className="dashboard-heading"><div><span className="eyebrow">{role.replace('_', ' ')}</span><h1>{role === 'REQUESTER' ? 'Your support view.' : 'Operations overview.'}</h1><p>{descriptions[role]}</p></div>{role === 'REQUESTER' && <span className="dashboard-cta">Need help? Create a ticket from the Tickets page.</span>}</div>{error ? <div className="error">{error}</div> : !data ? <p>Loading dashboard...</p> : <div className="cards">{cards.map(([key, label]) => <article key={key}><strong>{data[key] ?? 0}</strong><span>{label}</span></article>)}</div>}</section>;
}
