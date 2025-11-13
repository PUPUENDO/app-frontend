import api from '@/lib/api';
import type { User, CreateUserForm, UpdateUserForm } from './types';

export const UserApiService = {
  findAll: async (): Promise<User[]> => {
    try {
      console.log('📡 Obteniendo usuarios...');
      const response = await api.get('/users');
      console.log('📦 Usuarios recibidos:', response.data);
      
      // El backend retorna un array directo
      const users = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total de usuarios: ${users.length}`);
      
      return users;
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<User> => {
    try {
      console.log(`📡 Obteniendo usuario ${id}...`);
      const response = await api.get(`/users/${id}`);
      console.log('📦 Usuario recibido:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo usuario ${id}:`, error);
      throw error;
    }
  },

  create: async (user: CreateUserForm): Promise<User> => {
    try {
      console.log('📡 Creando usuario:', user);
      const response = await api.post('/users', user);
      console.log('📦 Usuario creado:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw error;
    }
  },

  update: async (id: string, user: UpdateUserForm): Promise<User> => {
    try {
      console.log(`📡 Actualizando usuario ${id}:`, user);
      const response = await api.put(`/users/${id}`, user);
      console.log('📦 Usuario actualizado:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando usuario ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`📡 Eliminando usuario ${id}...`);
      await api.delete(`/users/${id}`);
      console.log(`✅ Usuario ${id} eliminado`);
    } catch (error) {
      console.error(`❌ Error eliminando usuario ${id}:`, error);
      throw error;
    }
  },

  updateXP: async (id: string, xp: number): Promise<User> => {
    try {
      console.log(`📡 Actualizando XP del usuario ${id}:`, xp);
      const response = await api.patch(`/users/${id}/xp`, { xp });
      console.log('📦 Usuario actualizado:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando XP del usuario ${id}:`, error);
      throw error;
    }
  },
};
