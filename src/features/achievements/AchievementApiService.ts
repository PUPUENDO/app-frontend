import api from '@/lib/api';
import type { Achievement, CreateAchievementForm, UpdateAchievementForm, RarityType } from './types';

export const AchievementApiService = {
  // Find all achievements
  findAll: async (): Promise<Achievement[]> => {
    const response = await api.get('/achievements');
    return response.data;
  },

  // Find achievement by ID
  findById: async (id: string): Promise<Achievement> => {
    const response = await api.get(`/achievements/${id}`);
    return response.data;
  },

  // Find achievements by rarity
  findByRarity: async (rarity: RarityType): Promise<Achievement[]> => {
    const response = await api.get(`/achievements/rarity/${rarity}`);
    return response.data;
  },

  // Create new achievement
  create: async (data: CreateAchievementForm): Promise<Achievement> => {
    const response = await api.post('/achievements', data);
    return response.data;
  },

  // Update achievement
  update: async (id: string, data: UpdateAchievementForm): Promise<Achievement> => {
    const response = await api.put(`/achievements/${id}`, data);
    return response.data;
  },

  // Delete achievement
  delete: async (id: string): Promise<void> => {
    await api.delete(`/achievements/${id}`);
  },
};
