import { z } from 'zod';

// Tipos basados en el backend (TopicPrimitives)
export interface Topic {
  id: string;
  courseId: string;
  title: string;
  order: number;
  description?: string;
  createdAt: string; // ISO string desde el backend
}

// Request types para crear topic (basado en CreateTopicRequest del backend)
export interface CreateTopicRequest {
  courseId: string;
  title: string;
  order: number;
  description?: string;
}

// Request types para actualizar topic (basado en UpdateTopicRequest del backend)
export interface UpdateTopicRequest {
  title?: string;
  order?: number;
  description?: string;
}

// Schemas de validación con Zod (alineados con el backend)
export const createTopicSchema = z.object({
  courseId: z
    .string()
    .min(1, 'ID del curso es requerido'),
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder los 200 caracteres'),
  order: z
    .number()
    .int('El orden debe ser un número entero')
    .min(1, 'El orden debe ser mayor o igual a 1'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder los 1000 caracteres')
    .optional(),
});

export const updateTopicSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder los 200 caracteres')
    .optional(),
  order: z
    .number()
    .int('El orden debe ser un número entero')
    .min(1, 'El orden debe ser mayor o igual a 1')
    .optional(),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder los 1000 caracteres')
    .optional(),
});

export type CreateTopicForm = z.infer<typeof createTopicSchema>;
export type UpdateTopicForm = z.infer<typeof updateTopicSchema>;
