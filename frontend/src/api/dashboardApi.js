import { apiRequest, authHeaders } from './apiClient';
export const getSummary = token => apiRequest('/dashboard/summary', { headers: authHeaders(token) });
