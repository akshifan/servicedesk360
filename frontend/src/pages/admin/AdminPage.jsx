import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { changeTicketStatus, createTicket, getTickets } from '../../api/ticketApi';
import { createTask } from '../../api/taskApi';
import { createUser, getUsers, updateUserRole, updateUserStatus } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

const roles = ['REQUESTER', 'AGENT', 'MANAGER', 'TENANT_ADMIN'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const userInitial = { name: '', email: '', password: '', role: 'AGENT' };
const ticketInitial = { title: '', description: '', priority: 'MEDIUM' };
const taskInitial = { title: '', description: '', priority: 'MEDIUM', dueAt: '' };

function Panel({ eyebrow, title, children, className = '' }) {
  return <section className={`admin-panel ${className}`}><div className="admin-panel-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div></div>{children}</section>;
}

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [userForm, setUserForm] = useState(userInitial);
  const [ticketForm, setTicketForm] = useState(ticketInitial);
  const [taskForm, setTaskForm] = useState(taskInitial);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const loadAdminData = async () => {
    const [userPage, ticketPage] = await Promise.all([getUsers(token), getTickets(token)]);
    setUsers(userPage.content || []);
    setTickets(ticketPage.content || []);
  };

  useEffect(() => { loadAdminData().catch((err) => setError(err.message)); }, [token]);

  const openTickets = useMemo(() => tickets.filter((ticket) => !['CLOSED', 'CANCELLED'].includes(ticket.status)), [tickets]);
  const setForm = (setter, field) => (event) => setter((current) => ({ ...current, [field]: event.target.value }));
  const clearMessage = () => { setError(''); setSuccess(''); };

  const submitUser = async (event) => {
    event.preventDefault(); clearMessage(); setIsBusy(true);
    try { const created = await createUser(token, userForm); setUsers((current) => [created, ...current]); setUserForm(userInitial); setSuccess('Worker account created securely inside this tenant.'); }
    catch (err) { setError(err.message); } finally { setIsBusy(false); }
  };

  const submitTicket = async (event) => {
    event.preventDefault(); clearMessage(); setIsBusy(true);
    try { const created = await createTicket(token, ticketForm); setTickets((current) => [created, ...current]); setTicketForm(ticketInitial); setSuccess('Open ticket created.'); }
    catch (err) { setError(err.message); } finally { setIsBusy(false); }
  };

  const submitTask = async (event) => {
    event.preventDefault(); clearMessage(); setIsBusy(true);
    try { await createTask(token, { ...taskForm, dueAt: taskForm.dueAt ? new Date(taskForm.dueAt).toISOString() : null }); setTaskForm(taskInitial); setSuccess('Open team work created.'); }
    catch (err) { setError(err.message); } finally { setIsBusy(false); }
  };

  const changeRole = async (user, role) => { clearMessage(); try { const updated = await updateUserRole(token, user.id, role); setUsers((current) => current.map((item) => item.id === updated.id ? updated : item)); setSuccess(`${user.name}'s role updated.`); } catch (err) { setError(err.message); } };
  const toggleStatus = async (user) => { clearMessage(); try { const updated = await updateUserStatus(token, user.id, !user.active); setUsers((current) => current.map((item) => item.id === updated.id ? updated : item)); setSuccess(`${user.name} is now ${updated.active ? 'active' : 'inactive'}.`); } catch (err) { setError(err.message); } };
  const changeStatus = async (ticket, status) => { clearMessage(); try { const updated = await changeTicketStatus(token, ticket.id, status); setTickets((current) => current.map((item) => item.id === updated.id ? updated : item)); setSuccess(`${ticket.ticketNumber} moved to ${status}.`); } catch (err) { setError(err.message); } };

  return <section className="admin-page">
    <div className="admin-hero"><div><span className="eyebrow">Tenant administration</span><h1>Keep the work moving.</h1><p>Manage people, create work and keep an eye on every open request from one secure control room.</p><div className="admin-shortcuts"><Link to="/app/admin/sla">SLA policies</Link><Link to="/app/admin/audit">Audit history</Link><Link to="/app/admin/teams">Teams & queues</Link></div></div><div className="admin-security"><span>⌁</span><div><b>Tenant boundary active</b><small>All actions stay inside your authenticated tenant.</small></div></div></div>
    {error && <div className="error admin-message" role="alert">{error}</div>}{success && <div className="success admin-message" role="status">{success}</div>}
    <div className="admin-grid admin-forms">
      <Panel eyebrow="People" title="Register a worker"><form className="admin-form" onSubmit={submitUser}><div className="admin-form-grid"><label>Name<input placeholder="Worker name" value={userForm.name} onChange={setForm(setUserForm, 'name')} required /></label><label>Email<input type="email" placeholder="worker@company.com" value={userForm.email} onChange={setForm(setUserForm, 'email')} required /></label><label>Password<input type="password" placeholder="At least 12 characters" value={userForm.password} onChange={setForm(setUserForm, 'password')} minLength="12" required /></label><label>Role<select value={userForm.role} onChange={setForm(setUserForm, 'role')}>{roles.filter((role) => role !== 'TENANT_ADMIN').map((role) => <option key={role}>{role}</option>)}</select></label></div><button className="button button-primary" disabled={isBusy}>Create worker <span>↗</span></button><small className="form-hint">Tenant ID is resolved on the server from your JWT. It is never submitted by this form.</small></form></Panel>
      <Panel eyebrow="New work" title="Open a ticket"><form className="admin-form" onSubmit={submitTicket}><label>Title<input placeholder="Short request title" value={ticketForm.title} onChange={setForm(setTicketForm, 'title')} required /></label><label>Description<textarea placeholder="What does the team need to know?" value={ticketForm.description} onChange={setForm(setTicketForm, 'description')} required /></label><div className="admin-form-grid"><label>Priority<select value={ticketForm.priority} onChange={setForm(setTicketForm, 'priority')}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label><span /></div><button className="button button-primary" disabled={isBusy}>Open ticket <span>↗</span></button></form></Panel>
      <Panel eyebrow="Team work" title="Add open work"><form className="admin-form" onSubmit={submitTask}><label>Title<input placeholder="Work item title" value={taskForm.title} onChange={setForm(setTaskForm, 'title')} required /></label><label>Description<textarea placeholder="What needs to be done?" value={taskForm.description} onChange={setForm(setTaskForm, 'description')} /></label><div className="admin-form-grid"><label>Priority<select value={taskForm.priority} onChange={setForm(setTaskForm, 'priority')}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label><label>Due date<input type="datetime-local" value={taskForm.dueAt} onChange={setForm(setTaskForm, 'dueAt')} /></label></div><button className="button button-primary" disabled={isBusy}>Add open work <span>↗</span></button></form></Panel>
    </div>
    <Panel eyebrow="Directory" title={`Tenant users · ${users.length}`}><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Person</th><th>Role</th><th>Status</th><th>Security action</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><b>{user.name}</b><small>{user.email}</small></td><td><select value={user.role} onChange={(event) => changeRole(user, event.target.value)} disabled={user.role === 'TENANT_ADMIN' && users.filter((item) => item.role === 'TENANT_ADMIN').length === 1}><option>{user.role}</option>{roles.filter((role) => role !== user.role && role !== 'PLATFORM_ADMIN').map((role) => <option key={role}>{role}</option>)}</select></td><td><span className={`status-tag ${user.active ? 'status-active' : 'status-inactive'}`}>{user.active ? 'Active' : 'Inactive'}</span></td><td><button className="table-action" onClick={() => toggleStatus(user)}>{user.active ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table></div></Panel>
    <Panel eyebrow="Open queue" title={`Tickets in motion · ${openTickets.length}`}><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Ticket</th><th>Priority</th><th>Status</th><th>Transition</th></tr></thead><tbody>{openTickets.map((ticket) => <tr key={ticket.id}><td><b>{ticket.ticketNumber}</b><small>{ticket.title}</small></td><td><span className={`priority-tag priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></td><td><span className="status-tag status-active">{ticket.status}</span></td><td><select value={ticket.status} onChange={(event) => changeStatus(ticket, event.target.value)}><option>{ticket.status}</option>{ticket.status === 'OPEN' && <option>IN_PROGRESS</option>}{ticket.status === 'IN_PROGRESS' && <><option>WAITING_FOR_REQUESTER</option><option>RESOLVED</option></>}{ticket.status === 'WAITING_FOR_REQUESTER' && <option>IN_PROGRESS</option>}{ticket.status === 'RESOLVED' && <option>CLOSED</option>}</select></td></tr>)}</tbody></table>{openTickets.length === 0 && <div className="admin-empty">No open tickets in this tenant.</div>}</div></Panel>
  </section>;
}
