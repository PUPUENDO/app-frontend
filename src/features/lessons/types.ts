import { z } from 'zod';

// Tipos de ejercicios disponibles
export const exerciseTypes = [
  'true_false',
  'multiple_choice',
  'fill_blank',
  'code_completion',
  'matching'
] as const;

export type ExerciseType = typeof exerciseTypes[number];

// Schema para la configuración del ejercicio
export const exerciseConfigSchema = z.object({
  type: z.enum(exerciseTypes),
  instructions: z.string().min(10, 'Las instrucciones deben tener al menos 10 caracteres'),
  maxPoints: z.number().min(1, 'Los puntos máximos deben ser al menos 1').max(100, 'Los puntos máximos no pueden exceder 100'),
  options: z.union([z.array(z.string()), z.string()]).optional(), // Para multiple_choice - acepta array o string JSON
  correctAnswer: z.union([z.string(), z.number(), z.boolean()]).optional(), // Respuesta correcta
  blanks: z.union([z.array(z.any()), z.string()]).optional(), // Para fill_blank - acepta array o string JSON
  codeTemplate: z.string().optional(), // Para code_completion
  pairs: z.union([z.array(z.object({
    left: z.string(),
    right: z.string()
  })), z.string()]).optional(), // Para matching - acepta array o string JSON
}).optional();

export const createLessonSchema = z.object({
  topicId: z.string().min(1, 'El ID del tópico es obligatorio'),
  subtopicId: z.string().min(1, 'El ID del subtópico es obligatorio'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  order: z.number().min(0, 'El orden debe ser mayor o igual a 0').optional(),
  description: z.string().optional(),
  exerciseConfig: exerciseConfigSchema,
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonForm = z.infer<typeof createLessonSchema>;
export type UpdateLessonForm = z.infer<typeof updateLessonSchema>;
export type ExerciseConfig = z.infer<typeof exerciseConfigSchema>;

export interface Lesson {
  id: string;
  topicId: string;
  subtopicId: string;
  title: string;
  content: string;
  order: number;
  description?: string;
  exerciseConfig?: ExerciseConfig;
  createdAt: Date;
  updatedAt: Date;
}

// Labels para los tipos de ejercicio
export const exerciseTypeLabels: Record<ExerciseType, string> = {
  true_false: 'Verdadero/Falso',
  multiple_choice: 'Opción Múltiple',
  fill_blank: 'Llenar Espacios',
  code_completion: 'Completar Código',
  matching: 'Emparejar'
};
