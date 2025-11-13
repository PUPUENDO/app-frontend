import api from '@/lib/api';
import type {
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  CreateLessonForm,
  UpdateLessonForm
} from './types';

export const LessonApiService = {
  /**
   * Obtiene todas las lessons
   */
  findAll: async (): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>('/lessons');
    return response.data;
  },

  /**
   * Obtiene una lesson por ID
   */
  findById: async (id: string): Promise<Lesson> => {
    const response = await api.get<Lesson>(`/lessons/${id}`);
    return response.data;
  },

  /**
   * Obtiene todas las lessons de un topic específico
   */
  findByTopicId: async (topicId: string): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>(`/topics/${topicId}/lessons`);
    return response.data;
  },

  /**
   * Obtiene todas las lessons de un subtopic específico
   */
  findBySubtopicId: async (topicId: string, subtopicId: string): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>(`/topics/${topicId}/subtopics/${subtopicId}/lessons`);
    return response.data;
  },

  /**
   * Crea una nueva lesson
   */
  create: async (data: CreateLessonForm): Promise<Lesson> => {
    const request: CreateLessonRequest = {
      topicId: data.topicId,
      subtopicId: data.subtopicId,
      title: data.title,
      content: data.content,
      exerciseConfig: data.exerciseConfig,
      description: data.description,
    };

    const response = await api.post<Lesson>('/lessons', request);
    return response.data;
  },

  /**
   * Actualiza una lesson existente
   */
  update: async (id: string, data: UpdateLessonForm): Promise<Lesson> => {
    const request: UpdateLessonRequest = {
      title: data.title,
      content: data.content,
      exerciseConfig: data.exerciseConfig,
      description: data.description,
    };

    const response = await api.put<Lesson>(`/lessons/${id}`, request);
    return response.data;
  },

  /**
   * Elimina una lesson
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/lessons/${id}`);
  },
};
