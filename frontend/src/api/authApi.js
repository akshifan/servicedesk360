import { apiRequest, authHeaders } from './apiClient';

export const login = body => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const register = body => apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify(body)
});
export const me = token => apiRequest('/users/me', { headers: authHeaders(token) });
