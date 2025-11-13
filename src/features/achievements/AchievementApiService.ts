import api from '@/lib/api';
import type { Achievement, CreateAchievementForm, UpdateAchievementForm, RarityType } from './types';

export const AchievementApiService = {
  // Find all achievements
  findAll: async (): Promise<Achievement[]> => {
    const response = await api.get('/achievements');
    return response.data;
  },

  findById: async (id: string): Promise<Achievement> => {
    const response = await api.get(`/achievements/${id}`);
    return response.data;
  },

  findByRarity: async (rarity: RarityType): Promise<Achievement[]> => {
    const response = await api.get(`/achievements/rarity/${rarity}`);
    return response.data;
  },

  create: async (data: CreateAchievementForm): Promise<Achievement> => {
    const response = await api.post('/achievements', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAchievementForm): Promise<Achievement> => {
    const response = await api.put(`/achievements/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/achievements/${id}`);
  },
};
