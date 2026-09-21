import { Navigate } from 'react-router-dom'; import { useAuth } from '../context/AuthContext';
export default function RoleRoute({ allowedRoles, children }) { const { session, user } = useAuth(); if (!session) return <Navigate to="/login" replace />; return allowedRoles.includes(user?.role) ? children : <Navigate to="/app" replace />; }
