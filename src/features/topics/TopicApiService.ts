import api from '@/lib/api';
import type { Topic, CreateTopicForm, UpdateTopicForm } from './types';

// Adaptador: Backend → Frontend
const adaptTopicFromBackend = (backendTopic: any): Topic => {
  console.log('🔄 Adaptando topic del backend:', backendTopic);
  
  const adapted: Topic = {
    id: backendTopic.id,
    courseId: backendTopic.courseId,
    name: backendTopic.title, // Backend usa "title"
    description: backendTopic.description || 'Sin descripción',
    order: backendTopic.order,
    createdAt: new Date(backendTopic.createdAt),
    updatedAt: new Date(backendTopic.createdAt),
  };

  console.log('✅ Topic adaptado:', adapted);
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
      console.log('📡 Obteniendo todos los topics...');
      const response = await api.get('/topics');
      console.log('📦 Topics recibidos:', response.data);
      
      // El backend retorna un array directo
      const backendTopics = Array.isArray(response.data) ? response.data : [];
      return backendTopics.map(adaptTopicFromBackend);
    } catch (error) {
      console.error('❌ Error fetching topics:', error);
      throw error;
    }
  },

  findById: async (id: string): Promise<Topic> => {
    try {
      console.log(`📡 Obteniendo topic ${id}...`);
      const response = await api.get(`/topics/${id}`);
      console.log('📦 Topic recibido:', response.data);
      
      // El backend retorna el objeto directo
      return adaptTopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo topic ${id}:`, error);
      throw error;
    }
  },

  findByCourseId: async (courseId: string): Promise<Topic[]> => {
    try {
      console.log(`📡 Obteniendo topics del curso ${courseId}...`);
      const response = await api.get(`/courses/${courseId}/topics`);
      console.log('📦 Topics del curso recibidos:', response.data);
      
      // El backend retorna un array directo
      const backendTopics = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total de topics: ${backendTopics.length}`);
      
      return backendTopics.map(adaptTopicFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo topics del curso ${courseId}:`, error);
      throw error;
    }
  },

  create: async (topic: CreateTopicForm): Promise<Topic> => {
    try {
      console.log('📡 Creando topic:', topic);
      const backendData = adaptTopicToBackend(topic);
      console.log('📤 Datos enviados al backend:', backendData);
      
      const response = await api.post('/topics', backendData);
      console.log('📦 Topic creado:', response.data);
      
      return adaptTopicFromBackend(response.data);
    } catch (error) {
      console.error('❌ Error creando topic:', error);
      throw error;
    }
  },

  update: async (id: string, topic: UpdateTopicForm): Promise<Topic> => {
    try {
      console.log(`📡 Actualizando topic ${id}:`, topic);
      const backendData = adaptTopicToBackend(topic);
      console.log('📤 Datos enviados al backend:', backendData);
      
      const response = await api.put(`/topics/${id}`, backendData);
      console.log('📦 Topic actualizado:', response.data);
      
      return adaptTopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error actualizando topic ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`📡 Eliminando topic ${id}...`);
      await api.delete(`/topics/${id}`);
      console.log(`✅ Topic ${id} eliminado`);
    } catch (error) {
      console.error(`❌ Error eliminando topic ${id}:`, error);
      throw error;
    }
  },
};
