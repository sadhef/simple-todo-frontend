import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers['x-auth-token'] = token;
      console.log('Token added to request headers');
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response);
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access, redirecting to login');
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