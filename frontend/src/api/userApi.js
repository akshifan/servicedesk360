import { apiRequest, authHeaders } from './apiClient';

export const getUsers = (token) => apiRequest('/users', { headers: authHeaders(token) });
export const createUser = (token, body) => apiRequest('/users', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) });
export const updateUserStatus = (token, id, active) => apiRequest(`/users/${id}/status`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ active }) });
export const updateUserRole = (token, id, role) => apiRequest(`/users/${id}/role`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ role }) });

export const updateUserTeam = (
  token,
  id,
  teamId
) =>
  apiRequest(`/users/${id}/team`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({
      teamId
    })
  });
