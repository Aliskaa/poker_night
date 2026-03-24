/**
 * Cloud Functions for Poker Night
 *
 * Deploy: firebase deploy --only functions
 *
 * Coût usage faible (ex. 1 partie / semaine, ≤10 joueurs) : reste typiquement dans les quotas
 * gratuits Firestore + Functions si tu restes sur Blaze sans dépasser les paliers (facturation à 0 €).
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

type PlayerSnap = { id: string; data: admin.firestore.DocumentData };

/**
 * Applique users.statistics + user-game-stats à partir de games/{id}/players,
 * une seule fois par partie (serverStatsAppliedAt).
 */
async function syncStatsOnGameFinished(gameId: string): Promise<void> {
    const gameRef = db.collection('games').doc(gameId);

    const playerListSnap = await gameRef.collection('players').get();
    const playerIds = playerListSnap.docs.map((d) => d.id);
    if (playerIds.length === 0) {
        functions.logger.warn(`syncStatsOnGameFinished: no players for ${gameId}`);
    }

    await db.runTransaction(async (t) => {
        const gameSnap = await t.get(gameRef);
        if (!gameSnap.exists) {
            functions.logger.warn(`syncStatsOnGameFinished: game ${gameId} missing`);
            return;
        }
        const g = gameSnap.data()!;
        if (g.status !== 'FINISHED') {
            return;
        }
        if (g.serverStatsAppliedAt) {
            functions.logger.info(`syncStatsOnGameFinished: already applied for ${gameId}`);
            return;
        }

        const players: PlayerSnap[] = [];
        for (const pid of playerIds) {
            const pSnap = await t.get(gameRef.collection('players').doc(pid));
            if (pSnap.exists) {
                players.push({ id: pSnap.id, data: pSnap.data()! });
            }
        }

        const finishedAt = g.finishedAt as admin.firestore.Timestamp | undefined;
        const groupId = (g.groupId as string | null | undefined) || null;

        const withUserIds = players.filter((x) => x.data.userId);
        const userSnaps = await Promise.all(
            withUserIds.map((x) => t.get(db.collection('users').doc(x.data.userId as string)))
        );
        const statsSnaps = await Promise.all(
            withUserIds.map((x) => t.get(db.collection('user-game-stats').doc(x.data.userId as string)))
        );

        let idx = 0;
        for (const { data: p } of withUserIds) {
            const userId = p.userId as string;
            const userSnap = userSnaps[idx];
            const statsSnap = statsSnaps[idx];
            idx++;

            const payout = Number(p.winnings ?? 0);
            const totalInvested = Number(p.totalInvested ?? 0);
            const finalRank = typeof p.finalRank === 'number' ? p.finalRank : 999;
            const netProfit = payout - totalInvested;
            const isWinner = finalRank === 1;

            if (userSnap.exists) {
                const stats = userSnap.data()?.statistics as Record<string, unknown> | undefined;
                const bestRank =
                    typeof stats?.bestRank === 'number' ? stats.bestRank : 9999;
                const newBestRank = Math.min(bestRank, finalRank);

                const userUpdate: Record<string, unknown> = {
                    'statistics.gamesPlayed': admin.firestore.FieldValue.increment(1),
                    'statistics.totalInvested': admin.firestore.FieldValue.increment(totalInvested),
                    'statistics.totalWinnings': admin.firestore.FieldValue.increment(payout),
                    'statistics.netProfit': admin.firestore.FieldValue.increment(netProfit),
                    'statistics.bestRank': newBestRank,
                    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
                };
                if (isWinner) {
                    userUpdate['statistics.wins'] = admin.firestore.FieldValue.increment(1);
                }
                t.update(userSnap.ref, userUpdate);
            } else {
                functions.logger.warn(`syncStatsOnGameFinished: users/${userId} missing, skipping user doc`);
            }

            const statsRef = db.collection('user-game-stats').doc(userId);

            if (!statsSnap.exists) {
                t.set(
                    statsRef,
                    {
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
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
            }

            const updates: Record<string, unknown> = {
                totalGames: admin.firestore.FieldValue.increment(1),
                totalBuyIns: admin.firestore.FieldValue.increment(totalInvested),
                totalCashOuts: admin.firestore.FieldValue.increment(payout),
                totalNetProfit: admin.firestore.FieldValue.increment(netProfit),
                lastGameId: gameId,
                lastGameDate: finishedAt ?? admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            if (isWinner) {
                updates.totalWins = admin.firestore.FieldValue.increment(1);
            }

            if (groupId) {
                updates[`statsByGroup.${groupId}.games`] = admin.firestore.FieldValue.increment(1);
                updates[`statsByGroup.${groupId}.netProfit`] =
                    admin.firestore.FieldValue.increment(netProfit);
                if (isWinner) {
                    updates[`statsByGroup.${groupId}.wins`] = admin.firestore.FieldValue.increment(1);
                }
            }

            if (finishedAt && typeof finishedAt.toMillis === 'function') {
                const now = Date.now();
                const gameDate = finishedAt.toMillis();
                const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
                const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;

                if (gameDate >= thirtyDaysAgo) {
                    updates['last30Days.games'] = admin.firestore.FieldValue.increment(1);
                    updates['last30Days.netProfit'] =
                        admin.firestore.FieldValue.increment(netProfit);
                    if (isWinner) {
                        updates['last30Days.wins'] = admin.firestore.FieldValue.increment(1);
                    }
                }
                if (gameDate >= ninetyDaysAgo) {
                    updates['last90Days.games'] = admin.firestore.FieldValue.increment(1);
                    updates['last90Days.netProfit'] =
                        admin.firestore.FieldValue.increment(netProfit);
                    if (isWinner) {
                        updates['last90Days.wins'] = admin.firestore.FieldValue.increment(1);
                    }
                }
            }

            t.set(statsRef, updates, { merge: true });

            const currentStats = statsSnap.exists ? statsSnap.data() : undefined;
            const recordUpdates: Record<string, unknown> = {};

            if (currentStats) {
                if (netProfit > (Number(currentStats.biggestWin) || 0)) {
                    recordUpdates.biggestWin = netProfit;
                }
                if (netProfit < (Number(currentStats.biggestLoss) || 0)) {
                    recordUpdates.biggestLoss = netProfit;
                }
                if (isWinner) {
                    const newStreak = (Number(currentStats.currentWinStreak) || 0) + 1;
                    recordUpdates.currentWinStreak = newStreak;
                    if (newStreak > (Number(currentStats.longestWinStreak) || 0)) {
                        recordUpdates.longestWinStreak = newStreak;
                    }
                } else {
                    recordUpdates.currentWinStreak = 0;
                }
            } else {
                if (isWinner) {
                    recordUpdates.currentWinStreak = 1;
                    recordUpdates.longestWinStreak = 1;
                } else {
                    recordUpdates.currentWinStreak = 0;
                }
                recordUpdates.biggestWin = netProfit > 0 ? netProfit : 0;
                recordUpdates.biggestLoss = netProfit < 0 ? netProfit : 0;
            }

            if (Object.keys(recordUpdates).length > 0) {
                t.set(statsRef, recordUpdates, { merge: true });
            }
        }

        t.update(gameRef, {
            serverStatsAppliedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    });
}

// ============================================
// GAME ARCHIVING + STATS (on FINISHED)
// ============================================

/**
 * Fin de partie : stats serveur + planification archivage (comportement historique).
 */
export const scheduleGameArchiving = functions.firestore
    .document('games/{gameId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        const gameId = context.params.gameId as string;

        if (before.status !== 'FINISHED' && after.status === 'FINISHED') {
            functions.logger.info(`Game ${gameId} finished: server stats + schedule archive`);

            try {
                await syncStatsOnGameFinished(gameId);
            } catch (e) {
                functions.logger.error(`syncStatsOnGameFinished failed for ${gameId}`, e);
                throw e;
            }

            const archiveTime = Date.now() + 60 * 60 * 1000;

            await db.collection('scheduled-tasks').add({
                type: 'ARCHIVE_GAME',
                gameId,
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
    .schedule('0 * * * *')
    .timeZone('Europe/Paris')
    .onRun(async () => {
        functions.logger.info('Starting archiving of finished games');

        const oneHourAgo = admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - 60 * 60 * 1000)
        );

        const finishedGames = await db
            .collection('games')
            .where('status', '==', 'FINISHED')
            .where('finishedAt', '<', oneHourAgo)
            .limit(50)
            .get();

        if (finishedGames.empty) {
            functions.logger.info('No finished games to archive');
            return null;
        }

        let archivedCount = 0;

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
 */
export const cleanupAbandonedGames = functions.pubsub
    .schedule('0 3 * * *')
    .timeZone('Europe/Paris')
    .onRun(async () => {
        functions.logger.info('Starting cleanup of abandoned games');

        const sevenDaysAgo = admin.firestore.Timestamp.fromDate(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );

        const abandonedGames = await db
            .collection('games')
            .where('status', '==', 'PLAYING')
            .where('metadata.lastActivity', '<', sevenDaysAgo)
            .get();

        if (abandonedGames.empty) {
            functions.logger.info('No abandoned games to cleanup');
            return null;
        }

        const batch = db.batch();
        abandonedGames.docs.forEach((d) => {
            batch.delete(d.ref);
        });

        await batch.commit();

        functions.logger.info(`Cleaned up ${abandonedGames.size} abandoned games`);
        return null;
    });

/**
 * Copie games/**players vers game-history puis supprime la partie.
 * Utilise la sous-collection players (plus le champ embarqué game.players).
 */
async function archiveGame(gameId: string, gameData: admin.firestore.DocumentData) {
    const gameRef = db.collection('games').doc(gameId);
    const playersSnap = await gameRef.collection('players').get();

    const players: admin.firestore.DocumentData[] = playersSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));

    const winner = players.find((p: admin.firestore.DocumentData) => p.finalRank === 1);
    if (!winner) {
        throw new Error(`No winner found for game ${gameId}`);
    }

    const createdAt = gameData.createdAt as admin.firestore.Timestamp | undefined;
    const finishedAt = gameData.finishedAt as admin.firestore.Timestamp | undefined;
    const duration =
        finishedAt && createdAt
            ? Math.floor((finishedAt.toMillis() - createdAt.toMillis()) / 1000)
            : 0;

    const summary = {
        hostId: gameData.hostId,
        groupId: gameData.groupId || null,
        config: gameData.config,
        totalPot: gameData.totalPot,
        playerCount: players.length,
        winnerId: winner.id,
        winnerName: winner.name,
        duration,
        createdAt: gameData.createdAt,
        finishedAt: gameData.finishedAt,
        archivedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    const historyRef = db.collection('game-history').doc(gameId);
    batch.set(historyRef, summary);

    players.forEach((player: admin.firestore.DocumentData) => {
        const isGuest = !player.userId;
        const payout = Number(player.winnings ?? player.payout ?? 0);
        const totalInvested = Number(player.totalInvested ?? 0);
        const rebuy = Number(player.rebuyCount ?? 0);
        const buyInCount = rebuy + 1;

        const playerRef = historyRef.collection('players').doc(String(player.id));
        batch.set(playerRef, {
            id: player.id,
            name: player.name,
            avatarUrl: player.avatarUrl,
            isGuest,
            totalInvested,
            payout,
            profit: payout - totalInvested,
            buyInCount,
            finalRank: player.finalRank ?? 999,
        });

        const livePlayerRef = gameRef.collection('players').doc(String(player.id));
        batch.delete(livePlayerRef);
    });

    const profits = players.map(
        (p: admin.firestore.DocumentData) =>
            Number(p.winnings ?? p.payout ?? 0) - Number(p.totalInvested ?? 0)
    );
    const metadataRef = historyRef.collection('metadata').doc('stats');
    batch.set(metadataRef, {
        avgBuyIn: Number(gameData.totalPot) / (players.length || 1),
        biggestProfit: profits.length ? Math.max(...profits) : 0,
        biggestLoss: profits.length ? Math.min(...profits) : 0,
        totalRebuys: players.reduce(
            (sum: number, p: admin.firestore.DocumentData) =>
                sum + Math.max(0, Number(p.rebuyCount ?? 0)),
            0
        ),
    });

    batch.delete(gameRef);

    await batch.commit();
}

/**
 * Les stats sont appliquées à FINISHED (syncStatsOnGameFinished).
 * Ancien trigger sur game-history : conservé pour ne pas casser le déploiement, sans double comptage.
 */
export const updateUserStatsOnGameEnd = functions.firestore
    .document('game-history/{gameId}')
    .onCreate(async (_snapshot, context) => {
        functions.logger.info(
            `updateUserStatsOnGameEnd skipped for ${context.params.gameId} (stats already at FINISHED)`
        );
        return null;
    });
