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

