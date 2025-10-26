import axios from 'axios';
import type { Campaign, FormSubmission, Integration } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const campaignService = {
  getAll: () => api.get<Campaign[]>('/campaigns'),
  getById: (id: string) => api.get<Campaign>(`/campaigns/${id}`),
  create: (data: Partial<Campaign>) => api.post<Campaign>('/campaigns', data),
  update: (id: string, data: Partial<Campaign>) => api.put<Campaign>(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

export const submissionService = {
  create: (campaignId: string, data: Record<string, any>) =>
    api.post<FormSubmission>('/submissions', { campaignId, data }),
  getByCampaign: (campaignId: string) =>
    api.get<FormSubmission[]>(`/submissions/campaign/${campaignId}`),
  export: (campaignId: string) =>
    api.get(`/submissions/campaign/${campaignId}/export`, { responseType: 'blob' }),
};

export const integrationService = {
  getAll: () => api.get<Integration[]>('/integrations'),
  create: (data: Partial<Integration>) => api.post<Integration>('/integrations', data),
  update: (id: string, data: Partial<Integration>) =>
    api.put<Integration>(`/integrations/${id}`, data),
  delete: (id: string) => api.delete(`/integrations/${id}`),
  test: (id: string) => api.post(`/integrations/${id}/test`),
};

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('authToken');
  },
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;
