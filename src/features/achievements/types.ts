import { z } from 'zod';

// Rarities according to backend
export const achievementRarityEnum = z.enum(['common', 'special', 'epic', 'legendary']);
export type RarityType = z.infer<typeof achievementRarityEnum>;

// Condition types according to backend
export const conditionTypeEnum = z.enum([
  'complete_lessons',
  'streak_days',
  'xp_total',
  'complete_course',
  'perfect_lesson',
  'level_reached'
]);
export type ConditionType = z.infer<typeof conditionTypeEnum>;

// Condition schema
export const conditionSchema = z.object({
  type: conditionTypeEnum,
  value: z.union([z.number().positive(), z.string().min(1)])
});

export type ConditionProps = z.infer<typeof conditionSchema>;

// Achievement schema
export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  rarity: achievementRarityEnum,
  condition: conditionSchema,
  points: z.number(),
  description: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.string()
});

export type Achievement = z.infer<typeof achievementSchema>;

// Create achievement schema
export const createAchievementSchema = z.object({
  title: z.string().min(1, 'Título es requerido').max(100, 'Título no puede exceder 100 caracteres'),
  rarity: achievementRarityEnum,
  condition: conditionSchema,
  description: z.string().max(500, 'Descripción no puede exceder 500 caracteres').optional(),
  icon: z.string().min(1, 'Ícono no puede estar vacío').optional()
});

export type CreateAchievementForm = z.infer<typeof createAchievementSchema>;

// Update achievement schema (partial)
export const updateAchievementSchema = createAchievementSchema.partial();
export type UpdateAchievementForm = z.infer<typeof updateAchievementSchema>;
