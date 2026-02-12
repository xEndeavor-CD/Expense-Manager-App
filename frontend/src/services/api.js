import axios from 'axios';

const API_URL = 'http://localhost/expense-manager-backend/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Expense API calls
export const expenseAPI = {
  getAll: (params) => api.get('/expenses.php', { params }),
  getById: (id) => api.get(`/expenses.php/${id}`),
  create: (data) => api.post('/expenses.php', data),
  update: (id, data) => api.put(`/expenses.php/${id}`, data),
  delete: (id) => api.delete(`/expenses.php/${id}`),
  getStats: () => api.get('/expenses.php/stats/summary'),
};

export default api;