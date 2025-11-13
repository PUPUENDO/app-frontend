import { z } from 'zod';

export const achievementRarityEnum = z.enum(['common', 'rare', 'epic', 'legendary']);

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  createdAt: Date;
}

export type AchievementRarity = z.infer<typeof achievementRarityEnum>;
