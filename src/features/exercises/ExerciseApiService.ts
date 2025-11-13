import api from '@/lib/api';
import type { Exercise, ExerciseResponse, ValidationResponse, UserAnswer, ValidationResult } from './types';

export const ExerciseApiService = {
  generateExercise: async (lessonId: string): Promise<Exercise> => {
    try {
      const response = await api.get<ExerciseResponse>(`/lessons/${lessonId}/exercise`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Error al generar ejercicio');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Error generando ejercicio para lección ${lessonId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al generar el ejercicio');
    }
  },

  validateAnswer: async (lessonId: string, userAnswer: UserAnswer): Promise<ValidationResult> => {
    try {
      const response = await api.post<ValidationResponse>(`/lessons/${lessonId}/exercise/validate`, { userAnswer });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Error al validar respuesta');
      }
      
      // Agregar propiedad isCorrect basada en el status
      const result = response.data.data;
      result.isCorrect = result.status !== 'rejected';
      
      return result;
    } catch (error: any) {
      console.error(`❌ Error validando respuesta para lección ${lessonId}:`, error);
      console.error('❌ Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al validar la respuesta';
      throw new Error(errorMessage);
    }
  },
};
