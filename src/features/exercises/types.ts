import { z } from 'zod';

// Tipos de ejercicios soportados (DEBEN COINCIDIR EXACTAMENTE CON EL BACKEND)
export type ExerciseType = 'fill_blank' | 'multiple_choice' | 'code_completion' | 'true_false' | 'open_ended';

// Contenido específico por tipo de ejercicio
export interface FillBlankContent {
  text: string;
  blanks: {
    id: number;
    correctAnswer?: string; // No viene en GET, solo en validación
  }[];
}

export interface MultipleChoiceContent {
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId?: string; // No viene en GET, solo en validación
}

export interface CodeCompletionContent {
  instruction: string;
  starterCode: string;
  expectedOutput?: string;
  testCases?: {
    input: string;
    expectedOutput: string;
  }[];
}

export interface TrueFalseContent {
  statement: string;
  correctAnswer?: boolean; // No viene en GET, solo en validación
  explanation?: string;
}

export interface OpenEndedContent {
  question: string;
  evaluationCriteria: string[];
  sampleAnswer?: string;
}

// Union type para el contenido del ejercicio (debe coincidir con el backend)
export type ExerciseContent =
  | { type: 'fill_blank'; data: FillBlankContent }
  | { type: 'multiple_choice'; data: MultipleChoiceContent }
  | { type: 'code_completion'; data: CodeCompletionContent }
  | { type: 'true_false'; data: TrueFalseContent }
  | { type: 'open_ended'; data: OpenEndedContent };

// Ejercicio completo recibido del backend
export interface Exercise {
  lessonId: string;
  type: ExerciseType;
  instructions: string;
  content: ExerciseContent;
  maxPoints: number;
  generatedAt: string;
}

// Respuesta del usuario según el tipo de ejercicio
export type UserAnswer =
  | { [key: number]: string } // fill_blank: { 0: "respuesta1", 1: "respuesta2" }
  | string // multiple_choice: "option-id", true_false: "true"/"false", code_completion: código, open_ended: texto
  | boolean; // true_false: true/false

// Resultado de validación del backend
export interface ValidationResult {
  score: number;
  feedback: string;
  suggestions?: string;
  status: 'evaluating' | 'approved_excellent' | 'approved_improve' | 'rejected';
  // Propiedades derivadas para facilitar el uso en UI
  isCorrect?: boolean; // Se calcula: status !== 'rejected'
  details?: any;
}

// Respuestas de la API
export interface ExerciseResponse {
  success: boolean;
  data: Exercise;
  message?: string;
}

export interface ValidationResponse {
  success: boolean;
  data: ValidationResult;
  message?: string;
}

// Schemas de validación
export const submitAnswerSchema = z.object({
  answer: z.any(), // Puede ser string, boolean, objeto, etc.
});

export type SubmitAnswerForm = z.infer<typeof submitAnswerSchema>;
