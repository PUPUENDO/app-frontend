import api from '@/lib/api';
import type { User, CreateUserForm, UpdateUserForm } from './types';

export const UserApiService = {
  findAll: async (): Promise<User[]> => {
    try {
      const response = await api.get('/users');
      
      const users = Array.isArray(response.data) ? response.data : [];
      
      return users;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo usuario ${id}:`, error);
      throw error;
    }
  },

  create: async (user: CreateUserForm): Promise<User> => {
    try {
      const response = await api.post('/users', user);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw error;
    }
  },

  update: async (id: string, user: UpdateUserForm): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, user);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando usuario ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando usuario ${id}:`, error);
      throw error;
    }
  },

  updateXP: async (id: string, xp: number): Promise<User> => {
    try {
      const response = await api.patch(`/users/${id}/xp`, { xp });
      
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando XP del usuario ${id}:`, error);
      throw error;
    }
  },
};
