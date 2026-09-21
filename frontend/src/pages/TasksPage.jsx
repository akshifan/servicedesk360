import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  changeTaskStatus,
  getTasks
} from '../api/taskApi';

import {
  useAuth
} from '../context/AuthContext';

import {
  useRealtime
} from '../realtime/useRealtime';

const nextStates = {
  TODO: [
    'IN_PROGRESS',
    'BLOCKED',
    'CANCELLED'
  ],
  BLOCKED: [
    'IN_PROGRESS',
    'CANCELLED'
  ],
  IN_PROGRESS: [
    'DONE',
    'BLOCKED',
    'CANCELLED'
  ]
};

export default function TasksPage() {
  const {
    token,
    user
  } = useAuth();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const result = await getTasks(token);
      setData(result);
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

  const change = async (id, status) => {
    try {
      await changeTaskStatus(
        token,
        id,
        status
      );

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
            Execution
          </span>

          <h1>Tasks</h1>
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

      {!data ? (
        <p>Loading tasks...</p>
      ) : data.content.length === 0 ? (
        <div className="empty-panel">
          No assigned work yet.
        </div>
      ) : (
        <div className="list">
          {data.content.map((task) => (
            <article
              className="task-list-item"
              key={task.id}
            >
              <b>{task.title}</b>

              <span>
                {task.priority}
                {' · '}
                {task.assigneeId
                  ? `Assignee #${task.assigneeId}`
                  : 'Unassigned'}
              </span>

              <small>
                {task.status}

                {task.dueAt &&
                  ` · Due ${new Date(
                    task.dueAt
                  ).toLocaleString()}`}
              </small>

              {nextStates[task.status]?.length > 0 && (
                <select
                  value=""
                  onChange={(event) => {
                    if (event.target.value) {
                      change(
                        task.id,
                        event.target.value
                      );
                    }
                  }}
                >
                  <option value="">
                    Change status…
                  </option>

                  {nextStates[task.status].map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
