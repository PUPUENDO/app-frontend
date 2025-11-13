import { z } from 'zod';

// Tipos de ejercicios válidos (basados en el backend)
export const EXERCISE_TYPES = [
  'fill_blank',
  'multiple_choice',
  'code_completion',
  'true_false',
  'open_ended'
] as const;

export type ExerciseType = typeof EXERCISE_TYPES[number];

// Configuración de ejercicio (basada en ExerciseConfigProps del backend)
export interface ExerciseConfigProps {
  instructions: string;
  type: ExerciseType;
  maxPoints: number;
}

// Tipos basados en el backend (LessonPrimitives)
export interface Lesson {
  id: string;
  topicId: string;
  subtopicId: string | null; // null = lección final
  title: string;
  content: string; // Markdown
  exerciseConfig?: ExerciseConfigProps;
  description?: string;
  createdAt: Date;
}

// Request types para crear lesson (basado en CreateLessonRequest del backend)
export interface CreateLessonRequest {
  topicId: string;
  subtopicId: string;
  title: string;
  content: string;
  exerciseConfig?: ExerciseConfigProps;
  description?: string;
}

// Request types para actualizar lesson (basado en UpdateLessonRequest del backend)
export interface UpdateLessonRequest {
  title?: string;
  content?: string;
  exerciseConfig?: ExerciseConfigProps;
  description?: string;
}

// Schemas de validación con Zod (alineados con el backend)
export const exerciseConfigSchema = z.object({
  instructions: z
    .string()
    .min(1, 'Las instrucciones del ejercicio son requeridas'),
  type: z.enum(EXERCISE_TYPES, {
    errorMap: () => ({ message: 'Tipo de ejercicio inválido' })
  }),
  maxPoints: z
    .number()
    .min(1, 'Los puntos máximos deben ser mayores a 0')
    .max(100, 'Los puntos máximos no pueden exceder 100'),
});

export const createLessonSchema = z.object({
  topicId: z
    .string()
    .min(1, 'ID de tema es requerido'),
  subtopicId: z
    .string()
    .min(1, 'ID de subtema es requerido'),
  title: z
    .string()
    .min(1, 'Título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  content: z
    .string()
    .min(1, 'Contenido es requerido'),
  exerciseConfig: exerciseConfigSchema.optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
});

export const updateLessonSchema = z.object({
  title: z
    .string()
    .min(1, 'El título no puede estar vacío')
    .max(200, 'El título no puede exceder 200 caracteres')
    .optional(),
  content: z
    .string()
    .min(1, 'El contenido no puede estar vacío')
    .optional(),
  exerciseConfig: exerciseConfigSchema.optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
});

export type CreateLessonForm = z.infer<typeof createLessonSchema>;
export type UpdateLessonForm = z.infer<typeof updateLessonSchema>;
