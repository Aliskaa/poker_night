import { Timestamp } from 'firebase/firestore';

/**
 * Joueur dans une partie (subcollection games/{gameId}/players)
 * Évite la limite de 1MB sur le document principal
 */
export interface GamePlayer {
    id: string; // ID du document
    userId: string | null; // ID de l'utilisateur (null pour invités)
    name: string;
    avatarUrl?: string;
    
    // État dans la partie
    buyInAmount: number;
    totalInvested: number;
    rebuyCount: number;
    winnings: number;
    isActive: boolean;
    
    // Position et classement
    position?: number;
    finalRank: number | null;
    
    // Métadonnées
    joinedAt: Timestamp;
    leftAt?: Timestamp;
}

/**
 * Document Game simplifié (sans le tableau players[])
 */
export interface GameWithSubcollection {
    id: string;
    groupId: string;
    hostId: string;
    status: 'ACTIVE' | 'FINISHED' | 'CANCELLED';
    
    // Configuration
    blindStructure: string;
    startingStack: number;
    buyInAmount: number;
    smallBlind: number;
    bigBlind: number;
    
    // État du jeu
    currentBlindLevel: number;
    totalPot: number;
    dealerPosition: number;
    
    // Timestamps
    createdAt: Timestamp;
    startedAt?: Timestamp;
    finishedAt?: Timestamp;
    
    // Metadata (cache)
    metadata?: {
        lastActivity: Timestamp;
        playerCount: number;
        activePlayers: number;
    };
    
    // Statistiques simplifiées (cache)
    stats?: {
        totalBuyIns: number;
        totalCashOuts: number;
        winnerId?: string;
        winnerName?: string;
    };
}

/**
 * Fonction helper pour convertir Game legacy vers nouvelle structure
 */
export const shouldMigrateToSubcollection = (playerCount: number): boolean => {
    // Migrer si >6 joueurs ou approche de 500KB (estimé à ~8 joueurs)
    return playerCount >= 6;
};
