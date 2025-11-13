import api from '@/lib/api';
import type {
  Subtopic,
  CreateSubtopicRequest,
  UpdateSubtopicRequest,
  CreateSubtopicForm,
  UpdateSubtopicForm
} from './types';

export const SubtopicApiService = {
  /**
   * Obtiene todos los subtopics
   */
  findAll: async (): Promise<Subtopic[]> => {
    const response = await api.get<Subtopic[]>('/subtopics');
    return response.data;
  },

  /**
   * Obtiene un subtopic por ID
   */
  findById: async (id: string): Promise<Subtopic> => {
    const response = await api.get<Subtopic>(`/subtopics/${id}`);
    return response.data;
  },

  /**
   * Obtiene todos los subtopics de un topic específico
   */
  findByTopicId: async (topicId: string): Promise<Subtopic[]> => {
    const response = await api.get<Subtopic[]>(`/topics/${topicId}/subtopics`);
    return response.data;
  },

  /**
   * Crea un nuevo subtopic
   */
  create: async (data: CreateSubtopicForm): Promise<Subtopic> => {
    const request: CreateSubtopicRequest = {
      topicId: data.topicId,
      title: data.title,
      order: data.order,
      description: data.description,
    };

    const response = await api.post<Subtopic>('/subtopics', request);
    return response.data;
  },

  /**
   * Actualiza un subtopic existente
   */
  update: async (id: string, data: UpdateSubtopicForm): Promise<Subtopic> => {
    const request: UpdateSubtopicRequest = {
      title: data.title,
      order: data.order,
      description: data.description,
    };

    const response = await api.put<Subtopic>(`/subtopics/${id}`, request);
    return response.data;
  },

  /**
   * Elimina un subtopic
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/subtopics/${id}`);
  },
};
