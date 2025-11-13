import api from '@/lib/api';
import type { Course, CreateCourseForm, UpdateCourseForm } from './types';

// Adaptador: Backend → Frontend
const adaptCourseFromBackend = (backendCourse: any): Course => {  
  // Manejar tanto el formato con __id como con id
  const id = backendCourse.__id || backendCourse.id;
  const name = backendCourse.title;
  const description = backendCourse.description || 'Sin descripción';
  const createdAt = backendCourse.createdAt || new Date().toISOString();

  // Incluir campos adicionales del backend
  const totalTopics = backendCourse.totalTopics || 0;
  const totalLessons = backendCourse.totalLessons || 0;

  const adaptedCourse: Course = {
    id: id,
    name: name,
    description: description,
    imageUrl: undefined,
    createdAt: new Date(createdAt),
    updatedAt: new Date(createdAt),
    totalTopics: totalTopics,
    totalLessons: totalLessons,
  };

  return adaptedCourse;
};

// Adaptador: Frontend → Backend
const adaptCourseToBackend = (course: CreateCourseForm | UpdateCourseForm) => {
  return {
    title: course.name, // Frontend usa "name", backend usa "title"
    description: course.description,
  };
};

export const CourseApiService = {
  findAll: async (): Promise<Course[]> => {
    try {      
      const response = await api.get('/courses', {
        // Forzar la recarga sin caché
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      // El backend retorna un array directo
      const backendCourses = Array.isArray(response.data) 
        ? response.data 
        : [];
      
      const adaptedCourses = backendCourses.map(adaptCourseFromBackend);
      
      return adaptedCourses;
    } catch (error: any) {
      console.error('❌ Error fetching courses:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  findById: async (id: string): Promise<Course> => {
    try {
      const response = await api.get(`/courses/${id}`);
      return adaptCourseFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo curso ${id}:`, error);
      throw error;
    }
  },

  create: async (course: CreateCourseForm): Promise<Course> => {
    try {
      const backendData = adaptCourseToBackend(course);
      
      const response = await api.post('/courses', backendData);
      
      return adaptCourseFromBackend(response.data);
    } catch (error: any) {
      console.error('❌ Error creando curso:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  update: async (id: string, course: UpdateCourseForm): Promise<Course> => {
    try {
      const backendData = adaptCourseToBackend(course);
      
      const response = await api.put(`/courses/${id}`, backendData);
      
      return adaptCourseFromBackend(response.data);
    } catch (error: any) {
      console.error(`❌ Error actualizando curso ${id}:`, error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error: any) {
      console.error(`❌ Error eliminando curso ${id}:`, error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },
};
