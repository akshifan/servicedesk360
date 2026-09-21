import { apiRequest, authHeaders } from './apiClient';
export const getTickets = (token, query = '') => apiRequest(`/tickets${query}`, { headers: authHeaders(token) });
export const getTicket = (token, id) => apiRequest(`/tickets/${id}`, { headers: authHeaders(token) });
export const createTicket = (token, body) => apiRequest('/tickets', { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) });
export const changeTicketStatus = (token, id, status) => apiRequest(`/tickets/${id}/status`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ status }) });
export const assignTicket = (token, id, assigneeId) => apiRequest(`/tickets/${id}/assignment`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ assigneeId }) });
export const changeTicketPriority = (token, id, priority) => apiRequest(`/tickets/${id}/priority`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify({ priority }) });
export const getComments = (token, id) => apiRequest(`/tickets/${id}/comments`, { headers: authHeaders(token) });
export const addComment = (token, id, body, visibility = 'REQUESTER') => apiRequest(`/tickets/${id}/comments`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify({ body, visibility }) });
