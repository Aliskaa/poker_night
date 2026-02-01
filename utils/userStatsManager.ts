import { doc, setDoc, updateDoc, increment, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { UserGameStats, createEmptyUserStats, StatsUpdateEvent } from '@/types/UserGameStats';
import log from '@/services/logger';

/**
 * Met à jour les stats d'un utilisateur après une partie
 */
export const updateUserStats = async (event: StatsUpdateEvent): Promise<void> => {
    try {
        const statsRef = doc(db, 'user-game-stats', event.userId);
        const statsSnap = await getDoc(statsRef);

        if (!statsSnap.exists()) {
            // Créer les stats initiales
            const newStats = createEmptyUserStats(event.userId);
            await setDoc(statsRef, newStats);
        }

        const now = Timestamp.now();
        const thirtyDaysAgo = new Date(now.toMillis() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.toMillis() - 90 * 24 * 60 * 60 * 1000);
        const gameDate = event.gameDate.toDate();

        const updates: any = {
            totalGames: increment(1),
            totalBuyIns: increment(event.buyIn),
            totalCashOuts: increment(event.cashOut),
            totalNetProfit: increment(event.netProfit),
            lastGameId: event.gameId,
            lastGameDate: event.gameDate,
            updatedAt: now,
        };

        // Incrémenter les wins si gagnant
        if (event.isWinner) {
            updates.totalWins = increment(1);
        }

        // Stats 30 derniers jours
        if (gameDate >= thirtyDaysAgo) {
            updates['last30Days.games'] = increment(1);
            updates['last30Days.netProfit'] = increment(event.netProfit);
            if (event.isWinner) {
                updates['last30Days.wins'] = increment(1);
            }
        }

        // Stats 90 derniers jours
        if (gameDate >= ninetyDaysAgo) {
            updates['last90Days.games'] = increment(1);
            updates['last90Days.netProfit'] = increment(event.netProfit);
            if (event.isWinner) {
                updates['last90Days.wins'] = increment(1);
            }
        }

        // Stats par groupe
        updates[`statsByGroup.${event.groupId}.games`] = increment(1);
        updates[`statsByGroup.${event.groupId}.netProfit`] = increment(event.netProfit);
        if (event.isWinner) {
            updates[`statsByGroup.${event.groupId}.wins`] = increment(1);
        }

        await updateDoc(statsRef, updates);

        // Mettre à jour les records (nécessite lecture)
        await updateRecords(event.userId, event.netProfit, event.isWinner);

        log.info(`Updated stats for user ${event.userId}`);
    } catch (error) {
        log.error('Error updating user stats:', error);
        throw error;
    }
};

/**
 * Met à jour les records (biggest win/loss, streaks)
 */
const updateRecords = async (userId: string, netProfit: number, isWinner: boolean): Promise<void> => {
    try {
        const statsRef = doc(db, 'user-game-stats', userId);
        const statsSnap = await getDoc(statsRef);

        if (!statsSnap.exists()) return;

        const stats = statsSnap.data() as UserGameStats;
        const updates: any = {};

        // Biggest win/loss
        if (netProfit > stats.biggestWin) {
            updates.biggestWin = netProfit;
        }
        if (netProfit < stats.biggestLoss) {
            updates.biggestLoss = netProfit;
        }

        // Win streak
        if (isWinner) {
            const newStreak = stats.currentWinStreak + 1;
            updates.currentWinStreak = newStreak;
            if (newStreak > stats.longestWinStreak) {
                updates.longestWinStreak = newStreak;
            }
        } else {
            updates.currentWinStreak = 0;
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(statsRef, updates);
        }
    } catch (error) {
        log.error('Error updating records:', error);
    }
};

/**
 * Récupère les stats d'un utilisateur
 */
export const getUserStats = async (userId: string): Promise<UserGameStats | null> => {
    try {
        const statsRef = doc(db, 'user-game-stats', userId);
        const statsSnap = await getDoc(statsRef);

        if (!statsSnap.exists()) {
            return null;
        }

        return { userId, ...statsSnap.data() } as UserGameStats;
    } catch (error) {
        log.error('Error fetching user stats:', error);
        return null;
    }
};

/**
 * Recalcule les stats d'un utilisateur depuis zéro (migration/correction)
 */
export const recalculateUserStats = async (userId: string): Promise<void> => {
    // Cette fonction sera implémentée via Cloud Function
    // car elle nécessite de parcourir toutes les parties de l'utilisateur
    log.info(`Recalculation of stats for user ${userId} should be done via Cloud Function`);
};
