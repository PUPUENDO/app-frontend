import api from '@/lib/api';
import type { Achievement, CreateAchievementForm, UpdateAchievementForm, RarityType } from './types';

export const AchievementApiService = {
  findAll: async (): Promise<Achievement[]> => {
    try {
      const response = await api.get('/achievements');
      
      // El backend retorna un array directo
      const achievements = Array.isArray(response.data) ? response.data : [];
      
      return achievements;
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<Achievement> => {
    try {
      const response = await api.get(`/achievements/${id}`);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo achievement ${id}:`, error);
      throw error;
    }
  },

  findByRarity: async (rarity: RarityType): Promise<Achievement[]> => {
    try {
      const response = await api.get(`/achievements/rarity/${rarity}`);
      
      // El backend retorna un array directo
      const achievements = Array.isArray(response.data) ? response.data : [];
      
      return achievements;
    } catch (error) {
      console.error(`❌ Error obteniendo achievements con rareza ${rarity}:`, error);
      throw error;
    }
  },

  create: async (data: CreateAchievementForm): Promise<Achievement> => {
    try {
      const response = await api.post('/achievements', data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error('❌ Error creando achievement:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateAchievementForm): Promise<Achievement> => {
    try {
      const response = await api.put(`/achievements/${id}`, data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando achievement ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/achievements/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando achievement ${id}:`, error);
      throw error;
    }
  },
};
