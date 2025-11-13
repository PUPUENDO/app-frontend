import api from '@/lib/api';
import type { Achievement, CreateAchievementForm, UpdateAchievementForm, RarityType } from './types';

export const AchievementApiService = {
  findAll: async (): Promise<Achievement[]> => {
    try {
      console.log('📡 Obteniendo achievements...');
      const response = await api.get('/achievements');
      console.log('📦 Achievements recibidos:', response.data);
      
      // El backend retorna un array directo
      const achievements = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total de achievements: ${achievements.length}`);
      
      return achievements;
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<Achievement> => {
    try {
      console.log(`📡 Obteniendo achievement ${id}...`);
      const response = await api.get(`/achievements/${id}`);
      console.log('📦 Achievement recibido:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo achievement ${id}:`, error);
      throw error;
    }
  },

  findByRarity: async (rarity: RarityType): Promise<Achievement[]> => {
    try {
      console.log(`📡 Obteniendo achievements con rareza ${rarity}...`);
      const response = await api.get(`/achievements/rarity/${rarity}`);
      console.log('📦 Achievements recibidos:', response.data);
      
      // El backend retorna un array directo
      const achievements = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total de achievements con rareza ${rarity}: ${achievements.length}`);
      
      return achievements;
    } catch (error) {
      console.error(`❌ Error obteniendo achievements con rareza ${rarity}:`, error);
      throw error;
    }
  },

  create: async (data: CreateAchievementForm): Promise<Achievement> => {
    try {
      console.log('📡 Creando achievement:', data);
      const response = await api.post('/achievements', data);
      console.log('📦 Achievement creado:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error('❌ Error creando achievement:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateAchievementForm): Promise<Achievement> => {
    try {
      console.log(`📡 Actualizando achievement ${id}:`, data);
      const response = await api.put(`/achievements/${id}`, data);
      console.log('📦 Achievement actualizado:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando achievement ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`📡 Eliminando achievement ${id}...`);
      await api.delete(`/achievements/${id}`);
      console.log(`✅ Achievement ${id} eliminado`);
    } catch (error) {
      console.error(`❌ Error eliminando achievement ${id}:`, error);
      throw error;
    }
  },
};
