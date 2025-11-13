import api from '@/lib/api';
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateCourseForm,
  UpdateCourseForm
} from './types';

export const CourseApiService = {
  /**
   * Obtiene todos los cursos
   */
  findAll: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  /**
   * Obtiene un curso por ID
   */
  findById: async (id: string): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo curso
   */
  create: async (data: CreateCourseForm): Promise<Course> => {
    const request: CreateCourseRequest = {
      title: data.title,
      description: data.description,
    };

    const response = await api.post<Course>('/courses', request);
    return response.data;
  },

  /**
   * Actualiza un curso existente
   */
  update: async (id: string, data: UpdateCourseForm): Promise<Course> => {
    const request: UpdateCourseRequest = {
      title: data.title,
      description: data.description,
    };

    const response = await api.put<Course>(`/courses/${id}`, request);
    return response.data;
  },

  /**
   * Elimina un curso
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },
};
