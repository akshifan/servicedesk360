import { apiRequest, authHeaders } from './apiClient';
export const getAuditLogs = token => apiRequest('/audit-logs', { headers: authHeaders(token) });
