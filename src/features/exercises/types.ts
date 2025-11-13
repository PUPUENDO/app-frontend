import { z } from 'zod';

export interface Exercise {
  id: string;
  lessonId: string;
  question: string;
  type: 'multiple_choice' | 'open_ended' | 'code';
  options?: string[];
  correctAnswer?: string;
  createdAt: Date;
}

export interface Attempt {
  id: string;
  userId: string;
  lessonId: string;
  answer: string;
  status: 'pending' | 'correct' | 'incorrect';
  feedback?: string;
  score?: number;
  createdAt: Date;
  evaluatedAt?: Date;
}

export const submitAnswerSchema = z.object({
  answer: z.string().min(1, 'La respuesta no puede estar vacía'),
});

export type SubmitAnswerForm = z.infer<typeof submitAnswerSchema>;
