import { apiRequest, authHeaders } from './apiClient';
export const getNotifications = token => apiRequest('/notifications', { headers: authHeaders(token) });
export const getUnreadCount = token => apiRequest('/notifications/unread-count', { headers: authHeaders(token) });
export const markNotificationRead = (token,id) => apiRequest(`/notifications/${id}/read`, { method:'PATCH', headers:authHeaders(token) });
