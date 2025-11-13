import api from '@/lib/api';
import type { Exercise, Attempt, SubmitAnswerForm } from './types';

export const ExerciseApiService = {
  generateExercise: async (lessonId: string): Promise<Exercise> => {
    const response = await api.get(`/lessons/${lessonId}/exercise`);
    return response.data.data;
  },

  validateAnswer: async (lessonId: string, answer: string): Promise<{ isCorrect: boolean; feedback: string }> => {
    const response = await api.post(`/lessons/${lessonId}/exercise/validate`, { answer });
    return response.data.data;
  },

  submitAnswer: async (lessonId: string, data: SubmitAnswerForm): Promise<Attempt> => {
    const response = await api.post(`/lessons/${lessonId}/exercise/submit`, data);
    return response.data.data;
  },

  getAttemptStatus: async (lessonId: string): Promise<Attempt | null> => {
    try {
      const response = await api.get(`/lessons/${lessonId}/exercise/attempt-status`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
