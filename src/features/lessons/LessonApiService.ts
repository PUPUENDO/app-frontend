import api from '@/lib/api';
import type { Lesson, CreateLessonForm, UpdateLessonForm } from './types';

// Adaptador: Backend → Frontend
const adaptLessonFromBackend = (backendLesson: any): Lesson => {
  console.log('🔄 Adaptando lesson del backend:', backendLesson);
  
  // El backend no guarda el campo 'order', usar un valor por defecto
  const adapted: Lesson = {
    id: backendLesson.id,
    topicId: backendLesson.topicId,
    subtopicId: backendLesson.subtopicId,
    title: backendLesson.title,
    content: backendLesson.content,
    order: 0, // El backend no maneja order todavía
    createdAt: backendLesson.createdAt ? new Date(backendLesson.createdAt) : new Date(),
    updatedAt: backendLesson.createdAt ? new Date(backendLesson.createdAt) : new Date(),
  };

  console.log('✅ Lesson adaptado:', adapted);
  return adapted;
};

// Adaptador: Frontend → Backend
const adaptLessonToBackend = (lesson: CreateLessonForm | UpdateLessonForm) => {
  return {
    topicId: (lesson as CreateLessonForm).topicId,
    subtopicId: (lesson as CreateLessonForm).subtopicId,
    title: lesson.title,
    content: lesson.content,
    // El backend no maneja 'order' todavía, no enviarlo
  };
};

export const LessonApiService = {
  findAll: async (): Promise<Lesson[]> => {
    try {
      console.log('📡 Obteniendo todas las lessons...');
      const response = await api.get('/lessons');
      console.log('📦 Lessons recibidas:', response.data);
      
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
      console.log(`📡 Obteniendo lesson ${id}...`);
      const response = await api.get(`/lessons/${id}`);
      console.log('📦 Lesson recibida:', response.data);
      
      // El backend retorna el objeto directo
      return adaptLessonFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo lesson ${id}:`, error);
      throw error;
    }
  },

  findByTopicId: async (topicId: string): Promise<Lesson[]> => {
    try {
      console.log(`📡 Obteniendo lessons del topic ${topicId}...`);
      const response = await api.get(`/topics/${topicId}/lessons`);
      console.log('📦 Lessons del topic recibidas:', response.data);
      
      // El backend retorna un array directo
      const backendLessons = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total de lessons: ${backendLessons.length}`);
      
      return backendLessons.map(adaptLessonFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo lessons del topic ${topicId}:`, error);
      throw error;
    }
  },

  findBySubtopicId: async (subtopicId: string, topicId: string): Promise<Lesson[]> => {
    try {
      console.log(`📡 Obteniendo lessons del subtopic ${subtopicId} en topic ${topicId}...`);
      const response = await api.get(`/topics/${topicId}/subtopics/${subtopicId}/lessons`);
      console.log('📦 Lessons del subtopic recibidas:', response.data);
      
      // El backend retorna un array directo
      const backendLessons = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total de lessons: ${backendLessons.length}`);
      
      return backendLessons.map(adaptLessonFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo lessons del subtopic ${subtopicId}:`, error);
      throw error;
    }
  },

  create: async (lesson: CreateLessonForm): Promise<Lesson> => {
    try {
      console.log('📡 Creando lesson:', lesson);
      const backendData = adaptLessonToBackend(lesson);
      console.log('📤 Datos enviados al backend:', backendData);
      
      const response = await api.post('/lessons', backendData);
      console.log('📦 Lesson creada:', response.data);
      
      return adaptLessonFromBackend(response.data);
    } catch (error) {
      console.error('❌ Error creando lesson:', error);
      throw error;
    }
  },

  update: async (id: string, lesson: UpdateLessonForm): Promise<Lesson> => {
    try {
      console.log(`📡 Actualizando lesson ${id}:`, lesson);
      const backendData = adaptLessonToBackend(lesson);
      console.log('📤 Datos enviados al backend:', backendData);
      
      const response = await api.put(`/lessons/${id}`, backendData);
      console.log('📦 Lesson actualizada:', response.data);
      
      return adaptLessonFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error actualizando lesson ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`📡 Eliminando lesson ${id}...`);
      await api.delete(`/lessons/${id}`);
      console.log(`✅ Lesson ${id} eliminada`);
    } catch (error) {
      console.error(`❌ Error eliminando lesson ${id}:`, error);
      throw error;
    }
  },
};
