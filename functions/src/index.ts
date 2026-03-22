/**
 * Cloud Functions for Poker Night
 * 
 * Deploy: firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// ============================================
// GAME ARCHIVING FUNCTIONS
// ============================================

/**
 * Fonction déclenchée quand une partie passe à FINISHED
 * Archive automatiquement la partie après 1 heure
 */
export const scheduleGameArchiving = functions.firestore
    .document('games/{gameId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        
        // Vérifier si la partie vient de se terminer
        if (before.status !== 'FINISHED' && after.status === 'FINISHED') {
            const gameId = context.params.gameId;
            
            functions.logger.info(`Game ${gameId} finished, scheduling archiving in 1 hour`);
            
            // Programmer l'archivage dans 1 heure
            const archiveTime = Date.now() + (60 * 60 * 1000); // 1 heure
            
            await db.collection('scheduled-tasks').add({
                type: 'ARCHIVE_GAME',
                gameId: gameId,
                scheduledFor: admin.firestore.Timestamp.fromMillis(archiveTime),
                status: 'PENDING',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        
        return null;
    });

/**
 * Fonction planifiée : Archive les parties terminées
 * Exécutée toutes les heures
 */
export const archiveFinishedGames = functions.pubsub
    .schedule('0 * * * *') // Toutes les heures
    .timeZone('Europe/Paris')
    .onRun(async (context) => {
        functions.logger.info('Starting archiving of finished games');
        
        const oneHourAgo = admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - 60 * 60 * 1000)
        );
        
        // Récupérer les parties terminées depuis plus d'1 heure
        const finishedGames = await db.collection('games')
            .where('status', '==', 'FINISHED')
            .where('finishedAt', '<', oneHourAgo)
            .limit(50) // Limiter pour éviter timeout
            .get();
        
        if (finishedGames.empty) {
            functions.logger.info('No finished games to archive');
            return null;
        }
        
        let archivedCount = 0;
        
        // Archiver chaque partie
        for (const gameDoc of finishedGames.docs) {
            try {
                await archiveGame(gameDoc.id, gameDoc.data());
                archivedCount++;
            } catch (error) {
                functions.logger.error(`Error archiving game ${gameDoc.id}:`, error);
            }
        }
        
        functions.logger.info(`Archived ${archivedCount} games`);
        return null;
    });

/**
 * Fonction planifiée : Nettoie les parties abandonnées
 * Exécutée tous les jours à 3h du matin
 */
export const cleanupAbandonedGames = functions.pubsub
    .schedule('0 3 * * *') // Tous les jours à 3h
    .timeZone('Europe/Paris')
    .onRun(async (context) => {
        functions.logger.info('Starting cleanup of abandoned games');
        
        const sevenDaysAgo = admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        
        // Récupérer les parties actives sans activité depuis 7 jours
        const abandonedGames = await db.collection('games')
            .where('status', '==', 'PLAYING')
            .where('metadata.lastActivity', '<', sevenDaysAgo)
            .get();
        
        if (abandonedGames.empty) {
            functions.logger.info('No abandoned games to cleanup');
            return null;
        }
        
        // Supprimer en batch
        const batch = db.batch();
        abandonedGames.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        functions.logger.info(`Cleaned up ${abandonedGames.size} abandoned games`);
        return null;
    });

/**
 * Helper: Archive une partie vers game-history
 */
async function archiveGame(gameId: string, gameData: any) {
    const game = { id: gameId, ...gameData };
    
    // Calculer les stats
    const winner = game.players?.find((p: any) => p.finalRank === 1);
    if (!winner) {
        throw new Error(`No winner found for game ${gameId}`);
    }
    
    const duration = game.finishedAt && game.createdAt
        ? Math.floor((game.finishedAt.toMillis() - game.createdAt.toMillis()) / 1000)
        : 0;
    
    // Créer le résumé
    const summary = {
        hostId: game.hostId,
        groupId: game.groupId || null,
        config: game.config,
        totalPot: game.totalPot,
        playerCount: game.players?.length || 0,
        winnerId: winner.id,
        winnerName: winner.name,
        duration,
        createdAt: game.createdAt,
        finishedAt: game.finishedAt,
        archivedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    // Batch write
    const batch = db.batch();
    
    // Summary
    const historyRef = db.collection('game-history').doc(gameId);
    batch.set(historyRef, summary);
    
    // Players (sous-collection)
    game.players?.forEach((player: any) => {
        const playerRef = historyRef.collection('players').doc(player.id);
        batch.set(playerRef, {
            id: player.id,
            name: player.name,
            avatarUrl: player.avatarUrl,
            isGuest: player.isGuest,
            totalInvested: player.totalInvested,
            payout: player.payout || 0,
            profit: (player.payout || 0) - player.totalInvested,
            buyInCount: player.buyInCount,
            finalRank: player.finalRank || 999,
        });
    });
    
    // Metadata
    const profits = game.players?.map((p: any) => (p.payout || 0) - p.totalInvested) || [];
    const metadataRef = historyRef.collection('metadata').doc('stats');
    batch.set(metadataRef, {
        avgBuyIn: game.totalPot / (game.players?.length || 1),
        biggestProfit: Math.max(...profits, 0),
        biggestLoss: Math.min(...profits, 0),
        totalRebuys: game.players?.reduce((sum: number, p: any) => sum + p.buyInCount - 1, 0) || 0,
    });
    
    // Supprimer de games
    const gameRef = db.collection('games').doc(gameId);
    batch.delete(gameRef);
    
    await batch.commit();
}

/**
 * Met à jour les statistiques utilisateur quand une partie est archivée
 */
export const updateUserStatsOnGameEnd = functions.firestore
    .document('game-history/{gameId}')
    .onCreate(async (snapshot, context) => {
        const gameId = context.params.gameId;
        const gameData = snapshot.data();
        
        functions.logger.info(`Updating user stats for game ${gameId}`);
        
        try {
            // Récupérer les joueurs depuis la subcollection
            const playersSnap = await snapshot.ref.collection('players').get();
            
            const batch = db.batch();
            
            for (const playerDoc of playersSnap.docs) {
                const player = playerDoc.data();
                
                // Ne mettre à jour que pour les vrais utilisateurs (pas les guests)
                if (player.isGuest) continue;
                
                const statsRef = db.collection('user-game-stats').doc(player.id);
                const statsSnap = await statsRef.get();
                
                const isWinner = player.finalRank === 1;
                const netProfit = player.profit || 0;
                
                // Initialiser les stats si elles n'existent pas
                if (!statsSnap.exists) {
                    batch.set(statsRef, {
                        userId: player.id,
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
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }
                
                // Préparer les updates
                const updates: any = {
                    totalGames: admin.firestore.FieldValue.increment(1),
                    totalBuyIns: admin.firestore.FieldValue.increment(player.totalInvested || 0),
                    totalCashOuts: admin.firestore.FieldValue.increment(player.payout || 0),
                    totalNetProfit: admin.firestore.FieldValue.increment(netProfit),
                    lastGameId: gameId,
                    lastGameDate: gameData.finishedAt,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                };
                
                if (isWinner) {
                    updates.totalWins = admin.firestore.FieldValue.increment(1);
                }
                
                // Stats par groupe
                if (gameData.groupId) {
                    updates[`statsByGroup.${gameData.groupId}.games`] = admin.firestore.FieldValue.increment(1);
                    updates[`statsByGroup.${gameData.groupId}.netProfit`] = admin.firestore.FieldValue.increment(netProfit);
                    if (isWinner) {
                        updates[`statsByGroup.${gameData.groupId}.wins`] = admin.firestore.FieldValue.increment(1);
                    }
                }
                
                // Stats période (30 et 90 jours)
                const now = Date.now();
                const gameDate = gameData.finishedAt.toMillis();
                const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
                const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
                
                if (gameDate >= thirtyDaysAgo) {
                    updates['last30Days.games'] = admin.firestore.FieldValue.increment(1);
                    updates['last30Days.netProfit'] = admin.firestore.FieldValue.increment(netProfit);
                    if (isWinner) {
                        updates['last30Days.wins'] = admin.firestore.FieldValue.increment(1);
                    }
                }
                
                if (gameDate >= ninetyDaysAgo) {
                    updates['last90Days.games'] = admin.firestore.FieldValue.increment(1);
                    updates['last90Days.netProfit'] = admin.firestore.FieldValue.increment(netProfit);
                    if (isWinner) {
                        updates['last90Days.wins'] = admin.firestore.FieldValue.increment(1);
                    }
                }
                
                batch.update(statsRef, updates);
                
                // Mettre à jour les records séparément (nécessite lecture)
                const currentStats = statsSnap.data();
                if (currentStats) {
                    const recordUpdates: any = {};
                    
                    if (netProfit > (currentStats.biggestWin || 0)) {
                        recordUpdates.biggestWin = netProfit;
                    }
                    if (netProfit < (currentStats.biggestLoss || 0)) {
                        recordUpdates.biggestLoss = netProfit;
                    }
                    
                    // Win streak
                    if (isWinner) {
                        const newStreak = (currentStats.currentWinStreak || 0) + 1;
                        recordUpdates.currentWinStreak = newStreak;
                        if (newStreak > (currentStats.longestWinStreak || 0)) {
                            recordUpdates.longestWinStreak = newStreak;
                        }
                    } else {
                        recordUpdates.currentWinStreak = 0;
                    }
                    
                    if (Object.keys(recordUpdates).length > 0) {
                        batch.update(statsRef, recordUpdates);
                    }
                }
            }
            
            await batch.commit();
            functions.logger.info(`Successfully updated stats for ${playersSnap.size} players`);
            
        } catch (error) {
            functions.logger.error('Error updating user stats:', error);
            throw error;
        }
        
        return null;
    });
