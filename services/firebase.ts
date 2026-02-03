import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Ajoute 'getAuth' aux imports
import { initializeAuth, getAuth, type Auth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// 1. Empêcher la ré-initialisation de l'App (bonne pratique)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

// 2. Initialisation sécurisée de l'Auth
let auth: Auth;

try {
  // On tente d'initialiser avec la persistance React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e: any) {
  // Si l'erreur dit que c'est déjà initialisé, on récupère l'instance existante
  if (e.code === 'auth/already-initialized') {
    auth = getAuth(app); 
  } else {
    // Si c'est une autre erreur, on la fait remonter
    throw e;
  }
}

export { auth };