import { apiRequest, authHeaders } from './apiClient';
export const getSlaPolicies = token => apiRequest('/sla/policies', { headers: authHeaders(token) });
export const createSlaPolicy = (token, body) => apiRequest('/sla/policies', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) });
export const updateSlaPolicy = (token, id, body) => apiRequest(`/sla/policies/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(body) });
