import { z } from 'zod';

// Tipos de ejercicios válidos (basados en el backend)
export type ExerciseType = 'fill_blank' | 'multiple_choice' | 'code_completion' | 'true_false' | 'open_ended';

export const EXERCISE_TYPES: ExerciseType[] = [
  'fill_blank',
  'multiple_choice',
  'code_completion',
  'true_false',
  'open_ended'
];

// Contenido específico para cada tipo de ejercicio (basado en ExerciseContent del backend)
export interface FillBlankContent {
  text: string;
  blanks: {
    id: number;
  }[];
}

export interface MultipleChoiceContent {
  question: string;
  options: {
    id: string;
    text: string;
  }[];
}

export interface CodeCompletionContent {
  instruction: string;
  starterCode: string;
}

export interface TrueFalseContent {
  statement: string;
}

export interface OpenEndedContent {
  question: string;
}

// Unión discriminada para el contenido del ejercicio
export type ExerciseContent =
  | { type: 'fill_blank'; data: FillBlankContent }
  | { type: 'multiple_choice'; data: MultipleChoiceContent }
  | { type: 'code_completion'; data: CodeCompletionContent }
  | { type: 'true_false'; data: TrueFalseContent }
  | { type: 'open_ended'; data: OpenEndedContent };

// Ejercicio (basado en ExercisePrimitives del backend - versión pública sin respuestas)
export interface Exercise {
  lessonId: string;
  type: ExerciseType;
  instructions: string;
  content: ExerciseContent;
  maxPoints: number;
  generatedAt: Date;
}

// Resultado de validación (basado en ValidationResult del backend)
export interface ValidationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  suggestions?: string;
}

// Estado del intento (basado en AttemptStatusResponse del backend)
export type AttemptStatus = 'notStarted' | 'evaluating' | 'approvedExcellent' | 'approvedImprove' | 'rejected';

export interface AIFeedback {
  score: number;
  feedback: string;
  suggestions?: string;
}

export interface AttemptStatusResponse {
  status: AttemptStatus;
  aiFeedback?: AIFeedback;
  canRetry: boolean;
  canAdvance: boolean;
}

// Request para generar ejercicio (basado en GenerateExerciseRequest del backend)
export interface GenerateExerciseRequest {
  lessonId: string;
}

// Request para validar ejercicio (basado en ValidateExerciseRequest del backend)
export interface ValidateExerciseRequest {
  lessonId: string;
  userAnswer: any;
}

// Request para enviar respuesta (basado en SubmitExerciseAnswerRequest del backend)
export interface SubmitExerciseAnswerRequest {
  userId: string;
  lessonId: string;
  courseId: string;
  userAnswer: any;
}

// Response al enviar respuesta (basado en SubmitExerciseAnswerResponse del backend)
export interface SubmitExerciseAnswerResponse {
  attemptId: string;
  status: 'evaluating';
  message: string;
}

// Schemas de validación con Zod
export const submitAnswerSchema = z.object({
  courseId: z.string().min(1, 'El ID del curso es requerido'),
  userAnswer: z.any().refine((val) => val !== undefined && val !== null, {
    message: 'La respuesta no puede estar vacía'
  }),
});

export type SubmitAnswerForm = z.infer<typeof submitAnswerSchema>;
