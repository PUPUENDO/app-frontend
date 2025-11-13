import api from '@/lib/api';
import type { Achievement } from './types';

export const AchievementApiService = {
  findAll: async (): Promise<Achievement[]> => {
    const response = await api.get('/achievements');
    return response.data.data || [];
  },

  findById: async (id: string): Promise<Achievement> => {
    const response = await api.get(`/achievements/${id}`);
    return response.data.data;
  },

  findByRarity: async (rarity: string): Promise<Achievement[]> => {
    const response = await api.get(`/achievements/rarity/${rarity}`);
    return response.data.data || [];
  },
};
