import axios from 'axios';
import type { AuthResponse, LoginData, Media, MediaFormData, MediaResponse, RegisterData, SearchFilters, User } from '../types/media';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Media API
export const mediaApi = {
  getAll: async (page: number = 1, limit: number = 10, filters: SearchFilters = { search: '', type: '' }): Promise<MediaResponse> => {
   const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.type ? { type: filters.type } : {}),
    });
    
    const response = await api.get('/media', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Media> => {
    const response = await api.get(`/media/${id}`);
    return response.data;
  },

  create: async (data: MediaFormData): Promise<Media> => {
    const response = await api.post('/media', data);
    return response.data;
  },

  update: async (id: string, data: MediaFormData): Promise<Media> => {
    const response = await api.put(`/media/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
  },
};