import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  getNotifications,
  markNotificationRead
} from '../api/notificationApi';

import {
  useAuth
} from '../context/AuthContext';

import {
  useRealtime
} from '../realtime/useRealtime';

export default function NotificationsPage() {
  const {
    token,
    user
  } = useAuth();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const result =
        await getNotifications(token);

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

  const read = async (id) => {
    try {
      await markNotificationRead(
        token,
        id
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
            Personal inbox
          </span>

          <h1>Notifications</h1>

          <p>
            Assignment, status and workflow
            updates for your account.
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

      {!data ? (
        <p>Loading notifications...</p>
      ) : data.content.length === 0 ? (
        <div className="empty-panel">
          No notifications yet.
        </div>
      ) : (
        <div className="list">
          {data.content.map((notification) => (
            <article
              className="task-list-item"
              key={notification.id}
            >
              <b>{notification.title}</b>

              <span>
                {notification.message}
              </span>

              <small>
                {notification.type}
                {' · '}
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </small>

              {!notification.readAt && (
                <button
                  className="table-action"
                  onClick={() =>
                    read(notification.id)
                  }
                >
                  Mark read
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
