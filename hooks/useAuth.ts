import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import log from '@/services/logger';
import { Platform } from 'react-native';

// Type pour l'utilisateur exposé (compatible avec l'ancien useUser de Clerk)
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
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const mappedUser = mapFirebaseUser(firebaseUser);
      setUser(mappedUser);
      setIsSignedIn(!!firebaseUser);
      setIsLoaded(true);
      
      if (firebaseUser) {
        log.debug('🟢 Auth: User signed in', { uid: firebaseUser.uid });
      } else {
        log.debug('🔴 Auth: User signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  // Connexion email/mot de passe
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      log.debug('🟢 SignIn successful', { uid: result.user.uid });
      return { success: true, user: result.user };
    } catch (error: any) {
      log.error('🔴 SignIn error:', error.code, error.message);
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
      
      // Mettre à jour le profil avec le nom
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Envoyer email de vérification
      await sendEmailVerification(result.user);
      
      log.debug('🟢 SignUp successful', { uid: result.user.uid });
      return { success: true, user: result.user };
    } catch (error: any) {
      log.error('🔴 SignUp error:', error.code, error.message);
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      };
    }
  };

  // Connexion avec Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);

      if (result?.user) {
        log.debug('🟢 Google SignIn successful', { uid: result.user.uid });
        return { success: true, user: result.user };
      }
      
      return { success: false, error: 'Connexion annulée' };
    } catch (error: any) {
      log.error('🔴 Google SignIn error:', error.code, error.message);
      
      // Message spécifique pour auth/unauthorized-domain
      if (error.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'Domaine non autorisé. Configure localhost dans Firebase Console > Authentication > Settings > Authorized domains'
        };
      }
      
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      };
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      log.debug('🟢 SignOut successful');
      return { success: true };
    } catch (error: any) {
      log.error('🔴 SignOut error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    isLoaded,
    isSignedIn,
    signIn,
    signUp,
    signInWithGoogle,
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
    'auth/operation-not-allowed': 'Cette méthode de connexion n\'est pas activée dans Firebase Console.',
    'auth/popup-closed-by-user': 'Fenêtre de connexion fermée.',
    'auth/cancelled-popup-request': 'Connexion annulée.',
    'auth/popup-blocked': 'Popup bloquée par le navigateur. Autorisez les popups pour ce site.',
    'auth/argument-error': 'Erreur de configuration. Vérifiez que Google Sign-In est activé dans Firebase Console.',
  };
  
  return errorMessages[errorCode] || 'Une erreur est survenue. Veuillez réessayer.';
};

export default useAuth;
