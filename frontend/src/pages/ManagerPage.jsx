import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  assignTicket,
  changeTicketPriority,
  getTickets
} from '../api/ticketApi';

import {
  createTask
} from '../api/taskApi';

import {
  getUsers
} from '../api/userApi';

import {
  useAuth
} from '../context/AuthContext';

import {
  useRealtime
} from '../realtime/useRealtime';

const priorities = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
];

const initialTask = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueAt: '',
  assigneeId: ''
};

export default function ManagerPage() {
  const {
    token,
    user
  } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskForm, setTaskForm] =
    useState(initialTask);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [
        ticketPage,
        userPage
      ] = await Promise.all([
        getTickets(token),
        getUsers(token)
      ]);

      setTickets(ticketPage.content || []);
      setUsers(userPage.content || []);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const realtimeState = useRealtime({
    token,
    tenantId: user?.tenantId,
    onEvent: load
  });

  const agents = users.filter(
    (item) =>
      item.active &&
      ['AGENT', 'MANAGER', 'TENANT_ADMIN']
        .includes(item.role)
  );

  const updateTaskField = (field) => (event) => {
    setTaskForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const submitTask = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setBusy(true);

    try {
      await createTask(token, {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        priority: taskForm.priority,
        assigneeId: taskForm.assigneeId
          ? Number(taskForm.assigneeId)
          : null,
        dueAt: taskForm.dueAt
          ? new Date(
            taskForm.dueAt
          ).toISOString()
          : null
      });

      setTaskForm(initialTask);
      setSuccess('Team work created successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const run = async (action) => {
    setError('');
    setSuccess('');

    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            Team control
          </span>

          <h1>Manager workspace</h1>

          <p>
            Assign tickets, create team work and
            monitor delivery progress.
          </p>
        </div>

        <span
          className={`connection-indicator connection-${realtimeState}`}
        >
          {realtimeState === 'connected'
            ? 'Live updates'
            : realtimeState}
        </span>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {success && (
        <div className="success">
          {success}
        </div>
      )}

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="eyebrow">
              Team work
            </span>

            <h2>Create work for the team</h2>
          </div>
        </div>

        <form
          className="admin-form"
          onSubmit={submitTask}
        >
          <div className="admin-form-grid">
            <label>
              Work title

              <input
                value={taskForm.title}
                onChange={updateTaskField('title')}
                placeholder="Prepare new starter laptop"
                required
              />
            </label>

            <label>
              Assign to

              <select
                value={taskForm.assigneeId}
                onChange={updateTaskField('assigneeId')}
              >
                <option value="">
                  Unassigned
                </option>

                {agents.map((agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                  >
                    {agent.name} · {agent.role}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority

              <select
                value={taskForm.priority}
                onChange={updateTaskField('priority')}
              >
                {priorities.map((priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due date

              <input
                type="datetime-local"
                value={taskForm.dueAt}
                onChange={updateTaskField('dueAt')}
              />
            </label>
          </div>

          <label>
            Description

            <textarea
              value={taskForm.description}
              onChange={updateTaskField('description')}
              placeholder="Describe the work to be completed."
            />
          </label>

          <button
            className="button button-primary"
            disabled={busy}
          >
            {busy
              ? 'Creating…'
              : 'Create team work'}
          </button>
        </form>
      </section>

      <div className="manager-stats">
        <article>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === 'OPEN'
              ).length
            }
          </strong>

          <span>Open tickets</span>
        </article>

        <article>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === 'IN_PROGRESS'
              ).length
            }
          </strong>

          <span>In progress</span>
        </article>

        <article>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.assigneeId
              ).length
            }
          </strong>

          <span>Assigned</span>
        </article>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="eyebrow">
              Queue ownership
            </span>

            <h2>Tickets in motion</h2>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
            <tr>
              <th>Ticket</th>
              <th>Priority</th>
              <th>Assignee</th>
            </tr>
            </thead>

            <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <b>{ticket.ticketNumber}</b>
                  <small>{ticket.title}</small>
                </td>

                <td>
                  <select
                    value={ticket.priority}
                    onChange={(event) =>
                      run(() =>
                        changeTicketPriority(
                          token,
                          ticket.id,
                          event.target.value
                        )
                      )
                    }
                  >
                    {priorities.map((priority) => (
                      <option
                        key={priority}
                        value={priority}
                      >
                        {priority}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <select
                    value={ticket.assigneeId || ''}
                    onChange={(event) => {
                      if (!event.target.value) {
                        return;
                      }

                      run(() =>
                        assignTicket(
                          token,
                          ticket.id,
                          Number(event.target.value)
                        )
                      );
                    }}
                  >
                    <option value="">
                      Unassigned
                    </option>

                    {agents.map((agent) => (
                      <option
                        key={agent.id}
                        value={agent.id}
                      >
                        {agent.name} · {agent.role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
