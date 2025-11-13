import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('🔧 Configurando API con URL:', API_URL);

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

// ✅ Helper para asegurar que Firebase esté listo
const waitForAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      console.log('✅ Usuario de Firebase ya disponible:', auth.currentUser.email);
      resolve();
    } else {
      console.log('⏳ Esperando autenticación de Firebase...');
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          console.log('✅ Usuario de Firebase autenticado:', user.email);
          unsubscribe();
          resolve();
        }
      });
      // Timeout de seguridad (5 segundos)
      setTimeout(() => {
        console.warn('⚠️ Timeout esperando autenticación de Firebase');
        unsubscribe();
        resolve();
      }, 5000);
    }
  });
};

// Request interceptor para agregar el token de Firebase
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // ✅ Esperar a que Firebase Auth esté listo
      await waitForAuth();
      
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token agregado a la petición:', {
          url: config.url,
          method: config.method?.toUpperCase(),
          email: user.email
        });
      } else {
        console.warn('⚠️ No hay usuario autenticado para:', config.url);
      }
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores y logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
    });
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Error en respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      console.error('❌ Error 401: Token inválido o expirado');
      // Token inválido o expirado - redirigir al login
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('❌ Error 403: Acceso denegado');
    }

    if (error.response?.status === 404) {
      console.error('❌ Error 404: Recurso no encontrado');
    }

    if (error.response?.status === 500) {
      console.error('❌ Error 500: Error interno del servidor');
    }

    return Promise.reject(error);
  }
);

export default api;
