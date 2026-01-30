// Structure de blinds par défaut pour les tournois
export type BlindLevel = {
  level: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  duration: number; // en minutes
  isBreak?: boolean;
};

// Structure standard pour partie casual/tournament
export const STANDARD_BLIND_STRUCTURE: BlindLevel[] = [
  { level: 1, smallBlind: 25, bigBlind: 50, ante: 0, duration: 15 },
  { level: 2, smallBlind: 50, bigBlind: 100, ante: 0, duration: 15 },
  { level: 3, smallBlind: 75, bigBlind: 150, ante: 25, duration: 15 },
  { level: 4, smallBlind: 100, bigBlind: 200, ante: 25, duration: 15 },
  { level: 5, smallBlind: 150, bigBlind: 300, ante: 50, duration: 15, isBreak: true }, // PAUSE 5min
  { level: 6, smallBlind: 200, bigBlind: 400, ante: 50, duration: 15 },
  { level: 7, smallBlind: 300, bigBlind: 600, ante: 75, duration: 15 },
  { level: 8, smallBlind: 400, bigBlind: 800, ante: 100, duration: 15 },
  { level: 9, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 15 },
  { level: 10, smallBlind: 600, bigBlind: 1200, ante: 200, duration: 15, isBreak: true }, // PAUSE 5min
  { level: 11, smallBlind: 800, bigBlind: 1600, ante: 200, duration: 15 },
  { level: 12, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 15 },
  { level: 13, smallBlind: 1500, bigBlind: 3000, ante: 400, duration: 15 },
  { level: 14, smallBlind: 2000, bigBlind: 4000, ante: 500, duration: 15 },
  { level: 15, smallBlind: 3000, bigBlind: 6000, ante: 1000, duration: 15 },
];

// Structure rapide (10 min par niveau)
export const TURBO_BLIND_STRUCTURE: BlindLevel[] = [
  { level: 1, smallBlind: 25, bigBlind: 50, ante: 0, duration: 10 },
  { level: 2, smallBlind: 50, bigBlind: 100, ante: 0, duration: 10 },
  { level: 3, smallBlind: 100, bigBlind: 200, ante: 25, duration: 10 },
  { level: 4, smallBlind: 150, bigBlind: 300, ante: 50, duration: 10 },
  { level: 5, smallBlind: 200, bigBlind: 400, ante: 50, duration: 10 },
  { level: 6, smallBlind: 300, bigBlind: 600, ante: 100, duration: 10 },
  { level: 7, smallBlind: 500, bigBlind: 1000, ante: 100, duration: 10 },
  { level: 8, smallBlind: 750, bigBlind: 1500, ante: 200, duration: 10 },
  { level: 9, smallBlind: 1000, bigBlind: 2000, ante: 300, duration: 10 },
  { level: 10, smallBlind: 1500, bigBlind: 3000, ante: 500, duration: 10 },
];

// Structure lente (20 min par niveau)
export const SLOW_BLIND_STRUCTURE: BlindLevel[] = [
  { level: 1, smallBlind: 25, bigBlind: 50, ante: 0, duration: 20 },
  { level: 2, smallBlind: 50, bigBlind: 100, ante: 0, duration: 20 },
  { level: 3, smallBlind: 75, bigBlind: 150, ante: 0, duration: 20 },
  { level: 4, smallBlind: 100, bigBlind: 200, ante: 25, duration: 20 },
  { level: 5, smallBlind: 150, bigBlind: 300, ante: 25, duration: 20 },
  { level: 6, smallBlind: 200, bigBlind: 400, ante: 50, duration: 20 },
  { level: 7, smallBlind: 300, bigBlind: 600, ante: 50, duration: 20 },
  { level: 8, smallBlind: 400, bigBlind: 800, ante: 100, duration: 20 },
  { level: 9, smallBlind: 600, bigBlind: 1200, ante: 100, duration: 20 },
  { level: 10, smallBlind: 800, bigBlind: 1600, ante: 200, duration: 20 },
];

/**
 * Récupère le niveau de blind actuel
 */
export const getCurrentBlindLevel = (
  currentLevel: number,
  structure: BlindLevel[] = STANDARD_BLIND_STRUCTURE
): BlindLevel => {
  const level = structure[currentLevel];
  if (!level) {
    // Si on dépasse la structure, on reste au dernier niveau
    return structure[structure.length - 1];
  }
  return level;
};

/**
 * Récupère le prochain niveau de blind
 */
export const getNextBlindLevel = (
  currentLevel: number,
  structure: BlindLevel[] = STANDARD_BLIND_STRUCTURE
): BlindLevel | null => {
  const nextIndex = currentLevel + 1;
  if (nextIndex >= structure.length) {
    return null; // Fin de la structure
  }
  return structure[nextIndex];
};

/**
 * Sélectionne la structure de blinds selon la durée configurée
 */
export const getBlindStructureByDuration = (durationMinutes: number): BlindLevel[] => {
  if (durationMinutes <= 10) return TURBO_BLIND_STRUCTURE;
  if (durationMinutes >= 20) return SLOW_BLIND_STRUCTURE;
  return STANDARD_BLIND_STRUCTURE;
};
