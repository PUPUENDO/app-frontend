import api from '@/lib/api';
import type { Exercise, Attempt, SubmitAnswerForm } from './types';

export const ExerciseApiService = {
  generateExercise: async (lessonId: string): Promise<Exercise> => {
    try {
      console.log(`📡 Generando ejercicio para lesson ${lessonId}...`);
      const response = await api.get(`/lessons/${lessonId}/exercise`);
      console.log('📦 Ejercicio generado:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error generando ejercicio para lesson ${lessonId}:`, error);
      throw error;
    }
  },

  validateAnswer: async (lessonId: string, answer: string): Promise<{ isCorrect: boolean; feedback: string }> => {
    try {
      console.log(`📡 Validando respuesta para lesson ${lessonId}...`);
      const response = await api.post(`/lessons/${lessonId}/exercise/validate`, { answer });
      console.log('📦 Validación recibida:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error validando respuesta para lesson ${lessonId}:`, error);
      throw error;
    }
  },

  submitAnswer: async (lessonId: string, data: SubmitAnswerForm): Promise<Attempt> => {
    try {
      console.log(`📡 Enviando respuesta para lesson ${lessonId}:`, data);
      const response = await api.post(`/lessons/${lessonId}/exercise/submit`, data);
      console.log('📦 Intento creado:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error) {
      console.error(`❌ Error enviando respuesta para lesson ${lessonId}:`, error);
      throw error;
    }
  },

  getAttemptStatus: async (lessonId: string): Promise<Attempt | null> => {
    try {
      console.log(`📡 Obteniendo estado del intento para lesson ${lessonId}...`);
      const response = await api.get(`/lessons/${lessonId}/exercise/attempt-status`);
      console.log('📦 Estado del intento:', response.data);
      
      // El backend retorna el objeto directo
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`ℹ️ No hay intento activo para lesson ${lessonId}`);
        return null;
      }
      console.error(`❌ Error obteniendo estado del intento para lesson ${lessonId}:`, error);
      throw error;
    }
  },
};
