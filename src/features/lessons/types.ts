import { z } from 'zod';

export const createLessonSchema = z.object({
  topicId: z.string().min(1, 'El ID del tópico es obligatorio'),
  subtopicId: z.string().min(1, 'El ID del subtópico es obligatorio'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  order: z.number().min(0, 'El orden debe ser mayor o igual a 0').optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonForm = z.infer<typeof createLessonSchema>;
export type UpdateLessonForm = z.infer<typeof updateLessonSchema>;

export interface Lesson {
  id: string;
  topicId: string;
  subtopicId: string;
  title: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
