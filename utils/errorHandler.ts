import { ZodError } from 'zod';
import { FirebaseError } from 'firebase/app';
import log from '@/services/logger';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError {
  message: string;
  severity: ErrorSeverity;
  code?: string;
  details?: any;
}

/**
 * Gestion centralisée des erreurs avec logging et messages utilisateur
 */
export class ErrorHandler {
  /**
   * Traite une erreur et retourne un message utilisateur approprié
   */
  static handle(error: unknown, context?: string): AppError {
    // Erreur de validation Zod
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      log.warn(`Validation error in ${context}:`, firstError);
      return {
        message: firstError.message,
        severity: 'warning',
        code: 'VALIDATION_ERROR',
        details: error.issues,
      };
    }

    // Erreur Firebase
    if (error instanceof FirebaseError) {
      log.error(`Firebase error in ${context}:`, error);
      
      switch (error.code) {
        case 'permission-denied':
          return {
            message: "Vous n'avez pas les permissions nécessaires",
            severity: 'error',
            code: error.code,
          };
        
        case 'not-found':
          return {
            message: "Ressource introuvable",
            severity: 'warning',
            code: error.code,
          };
        
        case 'already-exists':
          return {
            message: "Cette ressource existe déjà",
            severity: 'warning',
            code: error.code,
          };
        
        case 'failed-precondition':
          return {
            message: "L'opération ne peut pas être effectuée dans l'état actuel",
            severity: 'warning',
            code: error.code,
          };
        
        case 'unavailable':
          return {
            message: "Service temporairement indisponible, réessayez",
            severity: 'error',
            code: error.code,
          };
        
        default:
          return {
            message: "Erreur réseau, vérifiez votre connexion",
            severity: 'error',
            code: error.code,
          };
      }
    }

    // Erreur standard JavaScript
    if (error instanceof Error) {
      log.error(`Error in ${context}:`, error);
      return {
        message: error.message || "Une erreur inattendue s'est produite",
        severity: 'error',
        details: error.stack,
      };
    }

    // Erreur inconnue
    log.error(`Unknown error in ${context}:`, error);
    return {
      message: "Une erreur inattendue s'est produite",
      severity: 'critical',
      details: error,
    };
  }

  /**
   * Wrapper pour les opérations async avec gestion d'erreur
   */
  static async tryAsync<T>(
    operation: () => Promise<T>,
    context: string,
    onError?: (error: AppError) => void
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      const appError = ErrorHandler.handle(error, context);
      if (onError) {
        onError(appError);
      }
      return null;
    }
  }

  /**
   * Retry avec exponential backoff
   */
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    context?: string
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Ne pas retry sur les erreurs de validation ou permissions
        if (error instanceof ZodError || 
            (error instanceof FirebaseError && 
             ['permission-denied', 'not-found', 'already-exists'].includes(error.code))) {
          throw error;
        }
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          log.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms for ${context}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

/**
 * Debounce pour limiter les appels de fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle pour limiter la fréquence d'exécution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Génère un ID unique sécurisé
 */
export function generateSecureId(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const randomExtra = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}_${random}${randomExtra}`;
}
