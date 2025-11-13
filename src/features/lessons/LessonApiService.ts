import api from '@/lib/api';
import type { Lesson, CreateLessonForm, UpdateLessonForm } from './types';

// Adaptador: Backend → Frontend
const adaptLessonFromBackend = (backendLesson: any): Lesson => {
  const adapted: Lesson = {
    id: backendLesson.id,
    topicId: backendLesson.topicId,
    subtopicId: backendLesson.subtopicId,
    title: backendLesson.title,
    content: backendLesson.content,
    order: 0, // El backend no maneja order todavía
    description: backendLesson.description,
    exerciseConfig: backendLesson.exerciseConfig,
    createdAt: backendLesson.createdAt ? new Date(backendLesson.createdAt) : new Date(),
    updatedAt: backendLesson.createdAt ? new Date(backendLesson.createdAt) : new Date(),
  };

  return adapted;
};

// Helper para parsear campos JSON
const parseJSONField = (value: any) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

// Adaptador: Frontend → Backend
const adaptLessonToBackend = (lesson: CreateLessonForm | UpdateLessonForm) => {
  const baseData: any = {
    topicId: (lesson as CreateLessonForm).topicId,
    subtopicId: (lesson as CreateLessonForm).subtopicId,
    title: lesson.title,
    content: lesson.content,
    description: lesson.description,
    // El backend no maneja 'order' todavía, no enviarlo
  };

  // Si hay exerciseConfig, parsear los campos JSON
  if (lesson.exerciseConfig) {
    baseData.exerciseConfig = {
      ...lesson.exerciseConfig,
      options: parseJSONField(lesson.exerciseConfig.options),
      blanks: parseJSONField(lesson.exerciseConfig.blanks),
      pairs: parseJSONField(lesson.exerciseConfig.pairs),
    };
  }

  return baseData;
};

export const LessonApiService = {
  findAll: async (): Promise<Lesson[]> => {
    try {
      const response = await api.get('/lessons');
      
      // El backend retorna un array directo
      const backendLessons = Array.isArray(response.data) ? response.data : [];
      return backendLessons.map(adaptLessonFromBackend);
    } catch (error) {
      console.error('❌ Error fetching lessons:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<Lesson> => {
    try {
      const response = await api.get(`/lessons/${id}`);
      
      // El backend retorna el objeto directo
      return adaptLessonFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo lesson ${id}:`, error);
      throw error;
    }
  },

  findByTopicId: async (topicId: string): Promise<Lesson[]> => {
    try {
      const response = await api.get(`/topics/${topicId}/lessons`);
      
      // El backend retorna un array directo
      const backendLessons = Array.isArray(response.data) ? response.data : [];
      
      return backendLessons.map(adaptLessonFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo lessons del topic ${topicId}:`, error);
      throw error;
    }
  },

  findBySubtopicId: async (subtopicId: string, topicId: string): Promise<Lesson[]> => {
    try {
      const response = await api.get(`/topics/${topicId}/subtopics/${subtopicId}/lessons`);
      
      // El backend retorna un array directo
      const backendLessons = Array.isArray(response.data) ? response.data : [];
      
      return backendLessons.map(adaptLessonFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo lessons del subtopic ${subtopicId}:`, error);
      throw error;
    }
  },

  create: async (lesson: CreateLessonForm): Promise<Lesson> => {
    try {
      const backendData = adaptLessonToBackend(lesson);
      
      const response = await api.post('/lessons', backendData);
      
      return adaptLessonFromBackend(response.data);
    } catch (error) {
      console.error('❌ Error creando lesson:', error);
      throw error;
    }
  },

  update: async (id: string, lesson: UpdateLessonForm): Promise<Lesson> => {
    try {
      const backendData = adaptLessonToBackend(lesson);
      
      const response = await api.put(`/lessons/${id}`, backendData);
      
      return adaptLessonFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error actualizando lesson ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/lessons/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando lesson ${id}:`, error);
      throw error;
    }
  },
};
