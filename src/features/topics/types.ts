import { z } from 'zod';

export const createTopicSchema = z.object({
  courseId: z.string().min(1, 'El ID del curso es obligatorio'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  order: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
});

export const updateTopicSchema = createTopicSchema.partial();

export type CreateTopicForm = z.infer<typeof createTopicSchema>;
export type UpdateTopicForm = z.infer<typeof updateTopicSchema>;

export interface Topic {
  id: string;
  courseId: string;
  name: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  totalSubtopics?: number;
  totalLessons?: number;
}
