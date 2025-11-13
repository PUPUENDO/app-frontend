import api from '@/lib/api';
import type { Exercise, ExerciseResponse, ValidationResponse, UserAnswer, ValidationResult } from './types';

export const ExerciseApiService = {
  /**
   * Obtener ejercicio generado para una lección
   * GET /lessons/:lessonId/exercise
   */
  generateExercise: async (lessonId: string): Promise<Exercise> => {
    try {
      console.log(`📡 Generando ejercicio para lección ${lessonId}...`);
      const response = await api.get<ExerciseResponse>(`/lessons/${lessonId}/exercise`);
      console.log('📦 Ejercicio generado:', response.data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Error al generar ejercicio');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Error generando ejercicio para lección ${lessonId}:`, error);
      throw new Error(error.response?.data?.message || 'Error al generar el ejercicio');
    }
  },

  /**
   * Validar respuesta de un ejercicio
   * POST /lessons/:lessonId/exercise/validate
   * Body: { userAnswer: string | boolean | object }
   */
  validateAnswer: async (lessonId: string, userAnswer: UserAnswer): Promise<ValidationResult> => {
    try {
      console.log(`📡 Validando respuesta para lección ${lessonId}`);
      console.log('📝 Tipo de respuesta:', typeof userAnswer);
      console.log('📝 Contenido de userAnswer:', JSON.stringify(userAnswer, null, 2));
      
      const response = await api.post<ValidationResponse>(`/lessons/${lessonId}/exercise/validate`, { userAnswer });
      console.log('📦 Validación recibida:', response.data);
      
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
