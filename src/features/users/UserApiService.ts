import api from '@/lib/api';
import type { User, CreateUserForm, UpdateUserForm } from './types';

export const UserApiService = {
  findAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.data || [];
  },

  findById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  create: async (user: CreateUserForm): Promise<User> => {
    const response = await api.post('/users', user);
    return response.data.data;
  },

  update: async (id: string, user: UpdateUserForm): Promise<User> => {
    const response = await api.put(`/users/${id}`, user);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updateXP: async (id: string, xp: number): Promise<User> => {
    const response = await api.patch(`/users/${id}/xp`, { xp });
    return response.data.data;
  },
};
