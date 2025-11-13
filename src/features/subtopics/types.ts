import { z } from 'zod';

// Tipos basados en el backend (SubtopicPrimitives)
export interface Subtopic {
  id: string;
  topicId: string;
  title: string;
  order: number;
  description?: string;
  createdAt: string; // ISO string desde el backend
}

// Request types para crear subtopic (basado en CreateSubtopicRequest del backend)
export interface CreateSubtopicRequest {
  topicId: string;
  title: string;
  order: number;
  description?: string;
}

// Request types para actualizar subtopic (basado en UpdateSubtopicRequest del backend)
export interface UpdateSubtopicRequest {
  title?: string;
  order?: number;
  description?: string;
}

// Schemas de validación con Zod (alineados con el backend)
export const createSubtopicSchema = z.object({
  topicId: z
    .string()
    .min(1, 'ID del tema es requerido'),
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

export const updateSubtopicSchema = z.object({
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

export type CreateSubtopicForm = z.infer<typeof createSubtopicSchema>;
export type UpdateSubtopicForm = z.infer<typeof updateSubtopicSchema>;
