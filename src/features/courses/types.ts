import { z } from 'zod';

// Tipos basados en el backend (CoursePrimitives)
export interface Course {
  id: string;
  title: string;
  totalTopics: number;
  totalLessons: number;
  description?: string;
  createdAt: string; // ISO string desde el backend
}

// Request types para crear curso (basado en CreateCourseRequest del backend)
export interface CreateCourseRequest {
  title: string;
  description?: string;
}

// Request types para actualizar curso (basado en UpdateCourseRequest del backend)
export interface UpdateCourseRequest {
  title?: string;
  description?: string;
}

// Schemas de validación con Zod (alineados con el backend)
export const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, 'El título del curso debe tener al menos 3 caracteres')
    .max(200, 'El título del curso no puede exceder 200 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción del curso debe tener al menos 10 caracteres')
    .max(1000, 'La descripción del curso no puede exceder 1000 caracteres')
    .optional(),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .min(3, 'El título del curso debe tener al menos 3 caracteres')
    .max(200, 'El título del curso no puede exceder 200 caracteres')
    .optional(),
  description: z
    .string()
    .min(10, 'La descripción del curso debe tener al menos 10 caracteres')
    .max(1000, 'La descripción del curso no puede exceder 1000 caracteres')
    .optional(),
});

export type CreateCourseForm = z.infer<typeof createCourseSchema>;
export type UpdateCourseForm = z.infer<typeof updateCourseSchema>;
