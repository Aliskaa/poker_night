import { Timestamp, FieldValue } from 'firebase/firestore';
import { GameConfig } from './Game';

/**
 * Résumé d'une partie terminée (archivée)
 * Structure légère pour l'historique
 */
export type GameHistorySummary = {
    id: string;
    hostId: string;
    groupId: string | null;
    config: GameConfig;
    totalPot: number;
    
    // Résumé des joueurs
    playerCount: number;
    winnerId: string;
    winnerName: string;
    
    // Durée et timing
    duration: number; // en secondes
    createdAt: Timestamp;
    finishedAt: Timestamp;
    archivedAt: Timestamp | FieldValue;
}

/**
 * Détails d'un joueur dans l'historique
 * Stocké en sous-collection pour éviter limite 1MB
 */
export type GameHistoryPlayer = {
    id: string;
    name: string;
    avatarUrl?: string;
    isGuest: boolean;
    
    // Performance
    totalInvested: number;
    payout: number;
    profit: number;
    buyInCount: number;
    finalRank: number;
    
    // Stats additionelles
    playTime?: number; // temps avant élimination (secondes)
}

/**
 * Métadonnées pour queries et analytics
 */
export type GameHistoryMetadata = {
    avgBuyIn: number;
    biggestProfit: number;
    biggestLoss: number;
    totalRebuys: number;
}
