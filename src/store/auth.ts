import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: 'student' | 'admin';
  xp?: number;
  level?: number;
  currentCourseId?: string;
}

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: 'student' | 'admin') => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: false,
  error: null,

  setUser: (user: User | null) => set({ user, error: null }),
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => set({ firebaseUser }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      user: null,
      firebaseUser: null,
      isLoading: false,
      error: null,
    }),
  isAuthenticated: () => !!get().user && !!get().firebaseUser,
  hasRole: (role: 'student' | 'admin') => {
    const { user } = get();
    return user?.role === role;
  },
}));
