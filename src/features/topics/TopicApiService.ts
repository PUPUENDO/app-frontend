import api from '@/lib/api';
import type { Topic, CreateTopicForm, UpdateTopicForm } from './types';

// Adaptador: Backend → Frontend
const adaptTopicFromBackend = (backendTopic: any): Topic => {
  const adapted: Topic = {
    id: backendTopic.id,
    courseId: backendTopic.courseId,
    name: backendTopic.title, // Backend usa "title"
    description: backendTopic.description || 'Sin descripción',
    order: backendTopic.order,
    createdAt: new Date(backendTopic.createdAt),
    updatedAt: new Date(backendTopic.createdAt),
  };
  return adapted;
};

// Adaptador: Frontend → Backend
const adaptTopicToBackend = (topic: CreateTopicForm | UpdateTopicForm) => {
  return {
    courseId: (topic as CreateTopicForm).courseId,
    title: topic.name, // Frontend usa "name", backend usa "title"
    description: topic.description,
    order: topic.order,
  };
};

export const TopicApiService = {
  findAll: async (): Promise<Topic[]> => {
    try {
      const response = await api.get('/topics');
      
      const backendTopics = Array.isArray(response.data) ? response.data : [];
      return backendTopics.map(adaptTopicFromBackend);
    } catch (error) {
      console.error('❌ Error fetching topics:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<Topic> => {
    try {
      const response = await api.get(`/topics/${id}`);
      return adaptTopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo topic ${id}:`, error);
      throw error;
    }
  },

  findByCourseId: async (courseId: string): Promise<Topic[]> => {
    try {
      const response = await api.get(`/courses/${courseId}/topics`);
      const backendTopics = Array.isArray(response.data) ? response.data : [];
      return backendTopics.map(adaptTopicFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo topics del curso ${courseId}:`, error);
      throw error;
    }
  },

  create: async (topic: CreateTopicForm): Promise<Topic> => {
    try {
      const backendData = adaptTopicToBackend(topic);
      
      const response = await api.post('/topics', backendData);
      
      return adaptTopicFromBackend(response.data);
    } catch (error) {
      console.error('❌ Error creando topic:', error);
      throw error;
    }
  },

  update: async (id: string, topic: UpdateTopicForm): Promise<Topic> => {
    try {
      const backendData = adaptTopicToBackend(topic);
      
      const response = await api.put(`/topics/${id}`, backendData);
      
      return adaptTopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error actualizando topic ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/topics/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando topic ${id}:`, error);
      throw error;
    }
  },
};
