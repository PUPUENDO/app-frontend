import api from '@/lib/api';
import type {
  Exercise,
  ValidationResult,
  SubmitAnswerForm,
  SubmitExerciseAnswerResponse,
  AttemptStatusResponse
} from './types';

export const ExerciseApiService = {
  /**
   * Genera un ejercicio para una lección específica
   */
  generateExercise: async (lessonId: string): Promise<Exercise> => {
    const response = await api.get<{ success: boolean; data: Exercise }>(`/lessons/${lessonId}/exercise`);

    return {
      ...response.data.data,
      generatedAt: new Date(response.data.data.generatedAt),
    };
  },

  /**
   * Valida la respuesta de un ejercicio de forma síncrona
   */
  validateAnswer: async (lessonId: string, userAnswer: any): Promise<ValidationResult> => {
    const response = await api.post<{ success: boolean; data: ValidationResult }>(
      `/lessons/${lessonId}/exercise/validate`,
      { userAnswer }
    );

    return response.data.data;
  },

  /**
   * Envía la respuesta de un ejercicio para evaluación (crea un intento)
   */
  submitAnswer: async (
    lessonId: string,
    data: SubmitAnswerForm
  ): Promise<SubmitExerciseAnswerResponse> => {
    const response = await api.post<{ success: boolean; data: SubmitExerciseAnswerResponse }>(
      `/lessons/${lessonId}/exercise/submit`,
      {
        courseId: data.courseId,
        userAnswer: data.userAnswer,
      }
    );

    return response.data.data;
  },

  /**
   * Consulta el estado del intento actual para una lección
   */
  getAttemptStatus: async (lessonId: string): Promise<AttemptStatusResponse> => {
    const response = await api.get<{ success: boolean; data: AttemptStatusResponse }>(
      `/lessons/${lessonId}/exercise/attempt-status`
    );

    return response.data.data;
  },
};
