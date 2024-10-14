import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);
export const getTodos = () => api.get('/api/todos');
export const createTodo = (todoData) => api.post('/api/todos', todoData);
export const updateTodo = (id, updates) => api.put(`/api/todos/${id}`, updates);
export const deleteTodo = (id) => api.delete(`/api/todos/${id}`);

export default api;