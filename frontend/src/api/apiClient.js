const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export async function apiRequest(path, options = {}) { const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } }); const text = await response.text(); const data = text ? JSON.parse(text) : null; if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`); return data; }
export function authHeaders(token) { return token ? { Authorization: `Bearer ${token}` } : {}; }
