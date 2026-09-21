import { apiRequest, authHeaders } from './apiClient';
export const getTasks = token => apiRequest('/tasks', { headers: authHeaders(token) });
export const createTask = (token, body) => apiRequest('/tasks', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) });
export const changeTaskStatus = (token, id, status) => apiRequest(`/tasks/${id}/status`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ status }) });
export const updateTask = (token, id, body) => apiRequest(`/tasks/${id}`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(body) });
