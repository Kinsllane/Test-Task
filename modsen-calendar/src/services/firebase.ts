import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? ''
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);
let authInstance: Auth | null = null;

export const getFirebaseAuth = () => {
  if (!hasFirebaseConfig) {
    throw new Error('Firebase config is missing. Fill .env values.');
  }
  if (!authInstance) {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  }
  return authInstance;
};
