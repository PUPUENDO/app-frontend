import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDPR_FmlX8STFkATwH3xQ-0pfS8vL65eZQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "plataforma-estudio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "plataforma-estudio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "plataforma-estudio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "186382297235",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:186382297235:web:568622ecbb2f63dab38566",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NWZ2MWWY9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Analytics (solo en producción)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
