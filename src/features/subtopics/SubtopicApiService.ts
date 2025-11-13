import api from '@/lib/api';
import type { Subtopic, CreateSubtopicForm, UpdateSubtopicForm } from './types';

// Adaptador: Backend → Frontend
const adaptSubtopicFromBackend = (backendSubtopic: any): Subtopic => {
  const adapted: Subtopic = {
    id: backendSubtopic.id,
    topicId: backendSubtopic.topicId,
    name: backendSubtopic.title, // Backend usa "title"
    description: backendSubtopic.description || 'Sin descripción',
    order: backendSubtopic.order,
    createdAt: new Date(backendSubtopic.createdAt),
    updatedAt: new Date(backendSubtopic.createdAt),
  };

  return adapted;
};

// Adaptador: Frontend → Backend
const adaptSubtopicToBackend = (subtopic: CreateSubtopicForm | UpdateSubtopicForm) => {
  return {
    topicId: (subtopic as CreateSubtopicForm).topicId,
    title: subtopic.name, // Frontend usa "name", backend usa "title"
    description: subtopic.description,
    order: subtopic.order,
  };
};

export const SubtopicApiService = {
  findAll: async (): Promise<Subtopic[]> => {
    try {
      const response = await api.get('/subtopics');
      
      // El backend retorna un array directo
      const backendSubtopics = Array.isArray(response.data) ? response.data : [];
      return backendSubtopics.map(adaptSubtopicFromBackend);
    } catch (error) {
      console.error('❌ Error fetching subtopics:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<Subtopic> => {
    try {
      const response = await api.get(`/subtopics/${id}`);
      
      // El backend retorna el objeto directo
      return adaptSubtopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo subtopic ${id}:`, error);
      throw error;
    }
  },

  findByTopicId: async (topicId: string): Promise<Subtopic[]> => {
    try {
      const response = await api.get(`/topics/${topicId}/subtopics`);
      
      const backendSubtopics = Array.isArray(response.data) ? response.data : [];
      
      return backendSubtopics.map(adaptSubtopicFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo subtopics del topic ${topicId}:`, error);
      throw error;
    }
  },

  create: async (subtopic: CreateSubtopicForm): Promise<Subtopic> => {
    try {
      const backendData = adaptSubtopicToBackend(subtopic);
      
      const response = await api.post('/subtopics', backendData);
      
      return adaptSubtopicFromBackend(response.data);
    } catch (error) {
      console.error('❌ Error creando subtopic:', error);
      throw error;
    }
  },

  update: async (id: string, subtopic: UpdateSubtopicForm): Promise<Subtopic> => {
    try {
      const backendData = adaptSubtopicToBackend(subtopic);
      
      const response = await api.put(`/subtopics/${id}`, backendData);
      
      return adaptSubtopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error actualizando subtopic ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/subtopics/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando subtopic ${id}:`, error);
      throw error;
    }
  },
};
