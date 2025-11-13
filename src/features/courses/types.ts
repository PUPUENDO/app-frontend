import { z } from 'zod';

export const createCourseSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  imageUrl: z.string().url('URL inválida').optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseForm = z.infer<typeof createCourseSchema>;
export type UpdateCourseForm = z.infer<typeof updateCourseSchema>;

export interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  totalTopics?: number;
  totalLessons?: number;
}
