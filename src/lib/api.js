import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tasks API
export const tasksAPI = {
  getAll: (userId = 'default-user') => api.get(`/tasks?userId=${userId}`),
  getByStatus: (status, userId = 'default-user') => api.get(`/tasks/status/${status}?userId=${userId}`),
  create: (task) => api.post('/tasks', task),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  bulkUpdate: (updates) => api.post('/tasks/bulk-update', { updates }),
  getStats: (userId = 'default-user') => api.get(`/tasks/analytics/stats?userId=${userId}`),
};

// Users API
export const usersAPI = {
  get: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  updateSettings: (id, settings) => api.put(`/users/${id}/settings`, settings),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getTasks: () => api.get('/admin/tasks'),
  getStats: () => api.get('/admin/stats'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', message),
  getHistory: (userId = 'default-user', limit = 50) => 
    api.get(`/chat/history?userId=${userId}&limit=${limit}`),
  generateStandup: (userId = 'default-user') => 
    api.post('/chat/standup', { userId }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
