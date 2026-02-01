import { db } from '@/services/firebase';
import { doc, collection, writeBatch, serverTimestamp, Timestamp, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Game } from '@/types/Game';
import { GameHistorySummary, GameHistoryPlayer, GameHistoryMetadata } from '@/types/GameHistory';
import log from '@/services/logger';

/**
 * Archive une partie terminée vers game-history
 * Supprime la partie de la collection games
 */
export async function archiveFinishedGame(gameId: string): Promise<boolean> {
    try {
        // 1. Récupérer la partie
        const gameRef = doc(db, 'games', gameId);
        const gameSnap = await getDoc(gameRef);
        
        if (!gameSnap.exists()) {
            log.warn(`Game ${gameId} not found for archiving`);
            return false;
        }
        
        const game = { id: gameSnap.id, ...gameSnap.data() } as Game;
        
        // Vérifier que la partie est bien terminée
        if (game.status !== 'FINISHED') {
            log.warn(`Game ${gameId} is not finished (status: ${game.status})`);
            return false;
        }
        
        // 2. Calculer les statistiques
        const winner = game.players.find(p => p.finalRank === 1);
        if (!winner) {
            log.error(`No winner found for game ${gameId}`);
            return false;
        }
        
        const duration = game.finishedAt && game.createdAt 
            ? calculateDuration(game.createdAt, game.finishedAt)
            : 0;
        
        const metadata = calculateGameMetadata(game);
        
        // 3. Créer le résumé
        const summary: Omit<GameHistorySummary, 'id'> = {
            hostId: game.hostId,
            groupId: game.groupId,
            config: game.config,
            totalPot: game.totalPot,
            playerCount: game.players.length,
            winnerId: winner.id,
            winnerName: winner.name,
            duration,
            createdAt: game.createdAt as Timestamp,
            finishedAt: game.finishedAt as Timestamp,
            archivedAt: serverTimestamp(),
        };
        
        // 4. Utiliser batch pour atomicité
        const batch = writeBatch(db);
        
        // Créer le document summary dans game-history
        const historyRef = doc(db, 'game-history', gameId);
        batch.set(historyRef, summary);
        
        // Créer les sous-documents players
        game.players.forEach(player => {
            const playerData: GameHistoryPlayer = {
                id: player.id,
                name: player.name,
                avatarUrl: player.avatarUrl,
                isGuest: player.isGuest,
                totalInvested: player.totalInvested,
                payout: player.payout || 0,
                profit: (player.payout || 0) - player.totalInvested,
                buyInCount: player.buyInCount,
                finalRank: player.finalRank || 999,
                playTime: player.eliminatedAt 
                    ? calculateDuration(game.createdAt, player.eliminatedAt)
                    : duration,
            };
            
            const playerRef = doc(db, 'game-history', gameId, 'players', player.id);
            batch.set(playerRef, playerData);
        });
        
        // Créer le document metadata
        const metadataRef = doc(db, 'game-history', gameId, 'metadata', 'stats');
        batch.set(metadataRef, metadata);
        
        // Supprimer la partie active
        batch.delete(gameRef);
        
        // 5. Commit
        await batch.commit();
        
        log.info(`Game ${gameId} archived successfully`);
        return true;
        
    } catch (error) {
        log.error(`Error archiving game ${gameId}:`, error);
        return false;
    }
}

/**
 * Archive toutes les parties terminées depuis plus de X heures
 */
export async function archiveOldFinishedGames(hoursOld: number = 24): Promise<number> {
    try {
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - hoursOld);
        
        const q = query(
            collection(db, 'games'),
            where('status', '==', 'FINISHED'),
            where('finishedAt', '<', Timestamp.fromDate(cutoffTime))
        );
        
        const snapshot = await getDocs(q);
        let archivedCount = 0;
        
        // Archiver chaque partie (en série pour éviter surcharge)
        for (const doc of snapshot.docs) {
            const success = await archiveFinishedGame(doc.id);
            if (success) archivedCount++;
            
            // Petit délai pour ne pas surcharger Firestore
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        log.info(`Archived ${archivedCount} old finished games`);
        return archivedCount;
        
    } catch (error) {
        log.error('Error archiving old games:', error);
        return 0;
    }
}

/**
 * Supprime les parties actives abandonnées (>7 jours sans activité)
 */
export async function cleanupAbandonedGames(daysInactive: number = 7): Promise<number> {
    try {
        const cutoffTime = new Date();
        cutoffTime.setDate(cutoffTime.getDate() - daysInactive);
        
        const q = query(
            collection(db, 'games'),
            where('status', '==', 'PLAYING'),
            where('metadata.lastActivity', '<', Timestamp.fromDate(cutoffTime))
        );
        
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            log.info('No abandoned games to cleanup');
            return 0;
        }
        
        // Batch delete
        const batch = writeBatch(db);
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        log.info(`Cleaned up ${snapshot.size} abandoned games`);
        return snapshot.size;
        
    } catch (error) {
        log.error('Error cleaning up abandoned games:', error);
        return 0;
    }
}

/**
 * Helpers
 */
function calculateDuration(start: any, end: any): number {
    try {
        const startTime = start.toDate ? start.toDate() : new Date(start);
        const endTime = end.toDate ? end.toDate() : new Date(end);
        return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    } catch {
        return 0;
    }
}

function calculateGameMetadata(game: Game): GameHistoryMetadata {
    const buyIns = game.players.map(p => p.totalInvested);
    const profits = game.players.map(p => (p.payout || 0) - p.totalInvested);
    
    return {
        avgBuyIn: buyIns.reduce((a, b) => a + b, 0) / game.players.length,
        biggestProfit: Math.max(...profits),
        biggestLoss: Math.min(...profits),
        totalRebuys: game.players.reduce((sum, p) => sum + p.buyInCount - 1, 0),
    };
}
