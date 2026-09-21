import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const value = localStorage.getItem('servicedesk360.session');
    return value ? JSON.parse(value) : null;
  });
  const saveSession = (result) => { localStorage.setItem('servicedesk360.session', JSON.stringify(result)); setSession(result); return result; };
  const login = async (body) => saveSession(await loginRequest(body));
  const register = async (body) => saveSession(await registerRequest(body));
  const logout = () => { localStorage.removeItem('servicedesk360.session'); setSession(null); };
  const value = useMemo(() => ({ session, token: session?.accessToken, user: session?.user, login, register, logout }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
