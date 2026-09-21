import { apiRequest, authHeaders } from './apiClient';
export const getTeams = token => apiRequest('/admin/teams', { headers: authHeaders(token) });
export const createTeam = (token,body) => apiRequest('/admin/teams', { method:'POST', headers:authHeaders(token), body:JSON.stringify(body) });
export const getQueues = token => apiRequest('/admin/queues', { headers: authHeaders(token) });
export const createQueue = (token,body) => apiRequest('/admin/queues', { method:'POST', headers:authHeaders(token), body:JSON.stringify(body) });
export const getCategories = token => apiRequest('/admin/categories', { headers: authHeaders(token) });
export const createCategory = (token,body) => apiRequest('/admin/categories', { method:'POST', headers:authHeaders(token), body:JSON.stringify(body) });
