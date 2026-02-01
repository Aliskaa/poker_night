import { Timestamp } from 'firebase/firestore';

/**
 * Statistiques agrégées par utilisateur
 * Collection: user-game-stats/{userId}
 * 
 * Évite de recalculer à chaque fois les stats depuis toutes les parties
 */
export interface UserGameStats {
    userId: string;
    
    // Statistiques globales
    totalGames: number;
    totalWins: number;
    totalBuyIns: number;
    totalCashOuts: number;
    totalNetProfit: number;
    
    // Périodes
    last30Days: {
        games: number;
        wins: number;
        netProfit: number;
    };
    
    last90Days: {
        games: number;
        wins: number;
        netProfit: number;
    };
    
    // Records
    biggestWin: number;
    biggestLoss: number;
    longestWinStreak: number;
    currentWinStreak: number;
    
    // Par groupe
    statsByGroup: {
        [groupId: string]: {
            games: number;
            wins: number;
            netProfit: number;
        };
    };
    
    // Dernière mise à jour
    lastGameId?: string;
    lastGameDate?: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Helper pour initialiser les stats d'un nouvel utilisateur
 */
export const createEmptyUserStats = (userId: string): UserGameStats => ({
    userId,
    totalGames: 0,
    totalWins: 0,
    totalBuyIns: 0,
    totalCashOuts: 0,
    totalNetProfit: 0,
    last30Days: { games: 0, wins: 0, netProfit: 0 },
    last90Days: { games: 0, wins: 0, netProfit: 0 },
    biggestWin: 0,
    biggestLoss: 0,
    longestWinStreak: 0,
    currentWinStreak: 0,
    statsByGroup: {},
    updatedAt: Timestamp.now(),
});

/**
 * Événement pour mettre à jour les stats (utilisé par Cloud Functions)
 */
export interface StatsUpdateEvent {
    userId: string;
    gameId: string;
    groupId: string;
    netProfit: number;
    buyIn: number;
    cashOut: number;
    isWinner: boolean;
    gameDate: Timestamp;
}
