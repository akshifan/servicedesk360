import { Link, Navigate, NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import TasksPage from './pages/TasksPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import ManagerPage from './pages/ManagerPage';
import NotificationsPage from './pages/NotificationsPage';
import SlaManagementPage from './pages/admin/SlaManagementPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import TeamQueueManagementPage from './pages/admin/TeamQueueManagementPage';
import AdminPage from './pages/admin/AdminPage';

function WorkspaceLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login'); };

  return <div className="workspace-shell"><header className="workspace-header"><Link to="/app" className="brand-lockup workspace-brand"><span className="brand-mark">S</span><span>ServiceDesk <em>360</em></span></Link><nav className="workspace-nav"><NavLink to="/app" end>Overview</NavLink><NavLink to="/app/tickets">Tickets</NavLink><NavLink to="/app/tasks">Tasks</NavLink>{['MANAGER','TENANT_ADMIN'].includes(user?.role) && <NavLink to="/app/manager">Manager</NavLink>}{user?.role === 'TENANT_ADMIN' && <NavLink to="/app/admin">Admin</NavLink>}<NavLink to="/app/notifications">Notifications</NavLink></nav><div className="workspace-user"><span className="workspace-avatar">{user?.name?.slice(0, 2).toUpperCase()}</span><span className="workspace-user-name">{user?.name}</span><button className="button button-ghost" onClick={signOut}>Log out</button></div></header><main className="workspace-content"><Outlet /></main></div>;
}

export default function App() {
  return <Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route path="/app" element={<ProtectedRoute><WorkspaceLayout /></ProtectedRoute>}><Route index element={<DashboardPage />} /><Route path="tickets" element={<TicketsPage />} /><Route path="tickets/:id" element={<TicketDetailsPage />} /><Route path="tasks" element={<TasksPage />} /><Route path="admin" element={<RoleRoute allowedRoles={['TENANT_ADMIN']}><AdminPage /></RoleRoute>} /><Route path="admin/sla" element={<RoleRoute allowedRoles={['TENANT_ADMIN']}><SlaManagementPage /></RoleRoute>} /><Route path="admin/audit" element={<RoleRoute allowedRoles={['TENANT_ADMIN']}><AuditLogPage /></RoleRoute>} /><Route path="admin/teams" element={<RoleRoute allowedRoles={['TENANT_ADMIN']}><TeamQueueManagementPage /></RoleRoute>} /><Route path="manager" element={<RoleRoute allowedRoles={['MANAGER','TENANT_ADMIN']}><ManagerPage /></RoleRoute>} /><Route path="notifications" element={<NotificationsPage />} /></Route><Route path="/dashboard" element={<Navigate to="/app" replace />} /><Route path="/tickets" element={<Navigate to="/app/tickets" replace />} /><Route path="/tasks" element={<Navigate to="/app/tasks" replace />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
