import api from '@/lib/api';
import type { Subtopic, CreateSubtopicForm, UpdateSubtopicForm } from './types';

// Adaptador: Backend → Frontend
const adaptSubtopicFromBackend = (backendSubtopic: any): Subtopic => {
  console.log('🔄 Adaptando subtopic del backend:', backendSubtopic);
  
  const adapted: Subtopic = {
    id: backendSubtopic.id,
    topicId: backendSubtopic.topicId,
    name: backendSubtopic.title, // Backend usa "title"
    description: backendSubtopic.description || 'Sin descripción',
    order: backendSubtopic.order,
    createdAt: new Date(backendSubtopic.createdAt),
    updatedAt: new Date(backendSubtopic.createdAt),
  };

  console.log('✅ Subtopic adaptado:', adapted);
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
      console.log('📡 Obteniendo todos los subtopics...');
      const response = await api.get('/subtopics');
      console.log('📦 Subtopics recibidos:', response.data);
      
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
      console.log(`📡 Obteniendo subtopic ${id}...`);
      const response = await api.get(`/subtopics/${id}`);
      console.log('📦 Subtopic recibido:', response.data);
      
      // El backend retorna el objeto directo
      return adaptSubtopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo subtopic ${id}:`, error);
      throw error;
    }
  },

  findByTopicId: async (topicId: string): Promise<Subtopic[]> => {
    try {
      console.log(`📡 Obteniendo subtopics del topic ${topicId}...`);
      const response = await api.get(`/topics/${topicId}/subtopics`);
      console.log('📦 Subtopics del topic recibidos:', response.data);
      
      // El backend retorna un array directo
      const backendSubtopics = Array.isArray(response.data) ? response.data : [];
      console.log(`✅ Total de subtopics: ${backendSubtopics.length}`);
      
      return backendSubtopics.map(adaptSubtopicFromBackend);
    } catch (error) {
      console.error(`❌ Error obteniendo subtopics del topic ${topicId}:`, error);
      throw error;
    }
  },

  create: async (subtopic: CreateSubtopicForm): Promise<Subtopic> => {
    try {
      console.log('📡 Creando subtopic:', subtopic);
      const backendData = adaptSubtopicToBackend(subtopic);
      console.log('📤 Datos enviados al backend:', backendData);
      
      const response = await api.post('/subtopics', backendData);
      console.log('📦 Subtopic creado:', response.data);
      
      return adaptSubtopicFromBackend(response.data);
    } catch (error) {
      console.error('❌ Error creando subtopic:', error);
      throw error;
    }
  },

  update: async (id: string, subtopic: UpdateSubtopicForm): Promise<Subtopic> => {
    try {
      console.log(`📡 Actualizando subtopic ${id}:`, subtopic);
      const backendData = adaptSubtopicToBackend(subtopic);
      console.log('📤 Datos enviados al backend:', backendData);
      
      const response = await api.put(`/subtopics/${id}`, backendData);
      console.log('📦 Subtopic actualizado:', response.data);
      
      return adaptSubtopicFromBackend(response.data);
    } catch (error) {
      console.error(`❌ Error actualizando subtopic ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`📡 Eliminando subtopic ${id}...`);
      await api.delete(`/subtopics/${id}`);
      console.log(`✅ Subtopic ${id} eliminado`);
    } catch (error) {
      console.error(`❌ Error eliminando subtopic ${id}:`, error);
      throw error;
    }
  },
};
