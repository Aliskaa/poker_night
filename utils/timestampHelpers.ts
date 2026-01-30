import { Timestamp } from 'firebase/firestore';

/**
 * Convertit un Timestamp Firebase en Date JavaScript
 * Gère les différents formats possibles (Timestamp, objet avec seconds, Date)
 */
export const toDate = (timestamp: any): Date => {
  if (!timestamp) {
    return new Date();
  }

  // Timestamp Firebase natif
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }

  // Objet avec propriété seconds (format sérialisé)
  if (typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds || 0).toDate();
  }

  // Date JavaScript directe
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Fallback : timestamp en millisecondes
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }

  // Fallback : string ISO
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }

  console.warn('Unknown timestamp format:', timestamp);
  return new Date();
};

/**
 * Calcule le temps écoulé depuis un timestamp en secondes
 */
export const getElapsedSeconds = (startTime: any): number => {
  const start = toDate(startTime);
  return Math.floor((Date.now() - start.getTime()) / 1000);
};

/**
 * Calcule le temps restant jusqu'à un timestamp en secondes
 */
export const getRemainingSeconds = (endTime: any): number => {
  const end = toDate(endTime);
  return Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000));
};

/**
 * Formate une durée en secondes en format lisible (ex: "5m 30s")
 * showSecondsZero : force l'affichage des secondes même si elles sont à 0
 */
export const formatDuration = (seconds: number, showSecondsZero = false): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 || showSecondsZero ? `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Vérifie si un timestamp est expiré
 */
export const isExpired = (timestamp: any): boolean => {
  return toDate(timestamp).getTime() < Date.now();
};

/**
 * Calcule le temps restant pour la late registration
 */
export const getLateRegRemainingSeconds = (createdAt: any, lateRegLimitMinutes: number): number => {
  if (lateRegLimitMinutes === 0) return Infinity; // Pas de limite
  
  const start = toDate(createdAt);
  const endTime = start.getTime() + (lateRegLimitMinutes * 60 * 1000);
  return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
};

/**
 * Vérifie si la late registration est encore ouverte
 */
export const isLateRegOpen = (createdAt: any, lateRegLimitMinutes: number): boolean => {
  if (lateRegLimitMinutes === 0) return true; // Toujours ouvert
  
  const remainingSeconds = getLateRegRemainingSeconds(createdAt, lateRegLimitMinutes);
  return remainingSeconds > 0;
};

/**
 * Calcule le temps restant pour le niveau de blind actuel
 * Prend en compte la pause et le temps écoulé
 */
export const getBlindLevelRemainingSeconds = (
  blindLevelStartedAt: any,
  blindDurationMinutes: number,
  isPaused: boolean = false,
  pausedAt?: any,
  totalPausedSeconds: number = 0
): number => {
  if (isPaused) {
    // Si en pause, on calcule le temps restant au moment de la pause
    const pauseTime = toDate(pausedAt);
    const startTime = toDate(blindLevelStartedAt);
    const elapsedAtPause = Math.floor((pauseTime.getTime() - startTime.getTime()) / 1000);
    const totalDuration = blindDurationMinutes * 60;
    return Math.max(0, totalDuration - elapsedAtPause - totalPausedSeconds);
  }

  // Temps écoulé depuis le début du niveau
  const elapsedSeconds = getElapsedSeconds(blindLevelStartedAt);
  const totalDuration = blindDurationMinutes * 60;
  
  // Soustraire le temps de pause total et le temps écoulé
  const remaining = totalDuration - (elapsedSeconds - totalPausedSeconds);
  return Math.max(0, remaining);
};
