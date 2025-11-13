import { z } from 'zod';

export const createSubtopicSchema = z.object({
  topicId: z.string().min(1, 'El ID del tópico es obligatorio'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  order: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
});

export const updateSubtopicSchema = createSubtopicSchema.partial();

export type CreateSubtopicForm = z.infer<typeof createSubtopicSchema>;
export type UpdateSubtopicForm = z.infer<typeof updateSubtopicSchema>;

export interface Subtopic {
  id: string;
  topicId: string;
  name: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  totalLessons?: number;
}
