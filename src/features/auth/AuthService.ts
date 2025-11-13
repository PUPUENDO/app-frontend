// src/features/auth/AuthService.ts
import { 
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/lib/api';
import { useAuthStore, User } from '@/store/auth';

interface LoginResult {
  needsOnboarding: boolean;
  isNewUser: boolean;
}

class AuthService {
  private googleProvider = new GoogleAuthProvider();

  /**
   * Método compartido para autenticar con el backend
   * Funciona tanto para Google OAuth como para Email/Password
   */
  private async authenticateWithBackend(idToken: string): Promise<LoginResult> {
    // Enviar el token al backend
    const response = await api.post('/auth/google', { idToken });
    
    const { user: backendUser, isNewUser, needsOnboarding } = response.data.data;

    // Guardar el usuario en el estado
    const user: User = {
      id: backendUser.__id,
      email: backendUser.email,
      displayName: backendUser.name,
      role: backendUser.role,
      xp: backendUser.xp || 0,
      level: Math.floor((backendUser.xp || 0) / 100) + 1,
    };

    useAuthStore.getState().setUser(user);

    return { needsOnboarding, isNewUser };
  }

  /**
   * Login con Email y Password
   */
  async loginWithEmailAndPassword(email: string, password: string): Promise<LoginResult> {
    try {
      useAuthStore.getState().setLoading(true);
      useAuthStore.getState().setError(null);

      // 1. Autenticar con Firebase usando email/password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Obtener el ID Token de Firebase
      const idToken = await userCredential.user.getIdToken();

      // 3. Establecer el usuario de Firebase
      useAuthStore.getState().setFirebaseUser(userCredential.user);

      // 4. Autenticar con el backend (mismo flujo que Google)
      return await this.authenticateWithBackend(idToken);

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message || 'Error al iniciar sesión';
      useAuthStore.getState().setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  }

  /**
   * Login con Google OAuth
   */
  async loginWithGoogle(): Promise<LoginResult> {
    try {
      useAuthStore.getState().setLoading(true);
      useAuthStore.getState().setError(null);

      // 1. Autenticar con Google usando Firebase
      const result = await signInWithPopup(auth, this.googleProvider);
      
      // 2. Obtener el ID Token de Firebase
      const idToken = await result.user.getIdToken();

      // 3. Establecer el usuario de Firebase
      useAuthStore.getState().setFirebaseUser(result.user);

      // 4. Autenticar con el backend (mismo flujo que Email/Password)
      return await this.authenticateWithBackend(idToken);

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      useAuthStore.getState().setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  }

  /**
   * Completar onboarding (seleccionar curso inicial)
   */
  async completeOnboarding(courseId: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const idToken = await currentUser.getIdToken();
      const userName = currentUser.displayName || 'Usuario';

      await api.post('/auth/complete-onboarding', {
        userId: currentUser.uid,
        name: userName,
        selectedCourseIds: [courseId], // Backend espera un array
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      // Actualizar el usuario en el estado
      const user = useAuthStore.getState().user;
      if (user) {
        useAuthStore.getState().setUser({
          ...user,
          currentCourseId: courseId,
        });
      }

    } catch (error: any) {
      console.error('Onboarding error:', error);
      throw new Error(error.response?.data?.message || 'Error completando onboarding');
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      useAuthStore.getState().reset();
    } catch (error) {
      console.error('Error during logout:', error);
      useAuthStore.getState().reset();
    }
  }

  getCurrentUser(): User | null {
    return useAuthStore.getState().user;
  }

  async fetchCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      return null;
    }

    try {
      // Obtener el token actual
      const idToken = await firebaseUser.getIdToken();

      // Obtener el usuario del backend
      const response = await api.get(`/users/${firebaseUser.uid}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      const backendUser = response.data.data;
      
      const user: User = {
        id: backendUser.__id,
        email: backendUser.email,
        displayName: backendUser.name,
        role: backendUser.role,
        xp: backendUser.xp || 0,
        level: Math.floor((backendUser.xp || 0) / 100) + 1,
      };

      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setFirebaseUser(firebaseUser);

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return false;
      }

      // Verificar que el token sea válido
      await user.getIdToken(true);
      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const isAuth = await this.isAuthenticated();
      if (!isAuth) {
        useAuthStore.getState().reset();
        return false;
      }

      const currentState = useAuthStore.getState();
      if (!currentState.user) {
        const user = await this.fetchCurrentUser();
        return !!user;
      }

      return true;
    } catch (error) {
      console.error('Error checking auth status:', error);
      useAuthStore.getState().reset();
      return false;
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  /**
   * Mensajes de error de Firebase en español
   */
  private getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No existe un usuario con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/popup-closed-by-user': 'Inicio de sesión cancelado',
    };

    return errorMessages[errorCode] || 'Error de autenticación';
  }
}

export const authService = new AuthService();
