import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth } from '@/services/firebase'; // On importe l'auth configurée avec persistance
import log from '@/services/logger'; // Assure-toi que ce service existe ou remplace par console.log

// Type pour l'utilisateur exposé
export interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  fullName: string | null;
  imageUrl: string | null;
  emailVerified: boolean;
}

// Convertir User Firebase en AuthUser
const mapFirebaseUser = (firebaseUser: User | null): AuthUser | null => {
  if (!firebaseUser) return null;

  const displayName = firebaseUser.displayName || '';
  const firstName = displayName.split(' ')[0] || null;

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    firstName,
    fullName: displayName || null,
    imageUrl: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
  };
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Si user n'est pas null, on est signé
  const isSignedIn = user !== null;

  useEffect(() => {
    // onAuthStateChanged détecte automatiquement la session restaurée grâce à firebase.ts
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const mappedUser = mapFirebaseUser(firebaseUser);
      setUser(mappedUser);
      setIsLoaded(true);

      if (firebaseUser) {
        log.debug('🟢 Auth: User signed in', { uid: firebaseUser.uid })
      } else {
        log.debug('🔴 Auth: User signed out')
      }
    });

    return () => unsubscribe();
  }, []);

  // Connexion email/mot de passe
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Pas besoin de setPersistence ici, c'est géré par firebase.ts
      return { success: true, user: result.user };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  };

  // Inscription email/mot de passe
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      // Note: sendEmailVerification peut échouer si le domaine n'est pas autorisé, on catch à part si besoin
      await sendEmailVerification(result.user).catch(e => console.log("Email verif error", e));

      return { success: true, user: result.user };
    } catch (error: any) {
      return {
        success: false,
        error: getAuthErrorMessage(error.code)
      };
    }
  };

  // Connexion Google : voir components/auth/GoogleSignInButton.tsx (web + natif).

  // Déconnexion
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    isLoaded,
    isSignedIn,
    signIn,
    signUp,
    signOut,
  };
};

// Messages d'erreur en français
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Adresse email invalide.',
    'auth/user-disabled': 'Ce compte a été désactivé.',
    'auth/user-not-found': 'Aucun compte trouvé avec cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/invalid-credential': 'Identifiants incorrects.',
    'auth/email-already-in-use': 'Cet email est déjà utilisé.',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
    'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
  };

  return errorMessages[errorCode] || `Erreur: ${errorCode}`;
};

export default useAuth;