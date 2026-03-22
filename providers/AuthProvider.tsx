import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth, type AuthUser } from '@/hooks/useAuth';

interface AuthContextType {
  user: AuthUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte d'authentification
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

/** Profil utilisateur courant (Firebase Auth), pour les écrans qui utilisaient autrefois un nom générique « useUser ». */
export function useUser() {
  const { user, isLoaded, isSignedIn } = useAuthContext();
  return { 
    user, 
    isLoaded, 
    isSignedIn 
  };
}

export default AuthProvider;
