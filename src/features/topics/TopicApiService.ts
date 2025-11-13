import api from '@/lib/api';
import type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
  CreateTopicForm,
  UpdateTopicForm
} from './types';

export const TopicApiService = {
  /**
   * Obtiene todos los topics
   */
  findAll: async (): Promise<Topic[]> => {
    const response = await api.get<Topic[]>('/topics');
    return response.data;
  },

  /**
   * Obtiene un topic por ID
   */
  findById: async (id: string): Promise<Topic> => {
    const response = await api.get<Topic>(`/topics/${id}`);
    return response.data;
  },

  /**
   * Obtiene todos los topics de un curso específico
   */
  findByCourseId: async (courseId: string): Promise<Topic[]> => {
    const response = await api.get<Topic[]>(`/courses/${courseId}/topics`);
    return response.data;
  },

  /**
   * Crea un nuevo topic
   */
  create: async (data: CreateTopicForm): Promise<Topic> => {
    const request: CreateTopicRequest = {
      courseId: data.courseId,
      title: data.title,
      order: data.order,
      description: data.description,
    };

    const response = await api.post<Topic>('/topics', request);
    return response.data;
  },

  /**
   * Actualiza un topic existente
   */
  update: async (id: string, data: UpdateTopicForm): Promise<Topic> => {
    const request: UpdateTopicRequest = {
      title: data.title,
      order: data.order,
      description: data.description,
    };

    const response = await api.put<Topic>(`/topics/${id}`, request);
    return response.data;
  },

  /**
   * Elimina un topic
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/topics/${id}`);
  },
};
