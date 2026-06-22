import axios from 'axios';

const API_BASE_URL = 'https://creadx-admin-agent-system.onrender.com';

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every outgoing request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired/invalid token)
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const fetchDashboardData = async (endpoint: string) => {
  const response = await adminApi.get(endpoint);
  return response.data;
};