import { doc, collection, writeBatch, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Game } from '@/types/Game';
import { GamePlayer, GameWithSubcollection } from '@/types/PlayerSubcollection';
import log from '@/services/logger';

/**
 * Migre les joueurs d'un game du tableau players[] vers une subcollection
 */
export const migratePlayersToSubcollection = async (gameId: string): Promise<void> => {
    try {
        const gameRef = doc(db, 'games', gameId);
        const gameSnap = await getDoc(gameRef);

        if (!gameSnap.exists()) {
            throw new Error(`Game ${gameId} not found`);
        }

        const game = { id: gameSnap.id, ...gameSnap.data() } as Game;

        // Vérifier si déjà migré
        if (!game.players || game.players.length === 0) {
            log.info(`Game ${gameId} already migrated or has no players`);
            return;
        }

        const batch = writeBatch(db);

        // 1. Créer les documents dans players subcollection
        game.players.forEach((player) => {
            const playerRef = doc(db, 'games', gameId, 'players', player.id);
            const gamePlayer: GamePlayer = {
                id: player.id,
                name: player.name,
                avatar: player.avatar,
                buyIn: player.buyIn,
                cashOut: player.cashOut,
                netProfit: player.netProfit,
                isActive: player.isActive,
                isGuest: player.isGuest,
                joinedAt: game.createdAt,
                position: player.position,
            };
            batch.set(playerRef, gamePlayer);
        });

        // 2. Mettre à jour le document game (retirer players[], ajouter stats cache)
        const stats = {
            totalBuyIns: game.players.reduce((sum, p) => sum + p.buyIn, 0),
            totalCashOuts: game.players.reduce((sum, p) => sum + p.cashOut, 0),
            winnerId: game.players.find(p => p.position === 1)?.id,
            winnerName: game.players.find(p => p.position === 1)?.name,
        };

        batch.update(gameRef, {
            players: [], // Vider l'array
            'metadata.playerCount': game.players.length,
            'metadata.activePlayers': game.players.filter(p => p.isActive).length,
            stats,
        });

        await batch.commit();
        log.info(`Successfully migrated ${game.players.length} players for game ${gameId}`);
    } catch (error) {
        log.error('Error migrating players to subcollection:', error);
        throw error;
    }
};

/**
 * Récupère les joueurs depuis la subcollection
 */
export const getPlayersFromSubcollection = async (gameId: string): Promise<GamePlayer[]> => {
    try {
        const playersRef = collection(db, 'games', gameId, 'players');
        const snapshot = await getDocs(playersRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GamePlayer));
    } catch (error) {
        log.error('Error fetching players from subcollection:', error);
        return [];
    }
};

/**
 * Migre tous les games actifs avec >6 joueurs
 */
export const migrateAllLargeGames = async (): Promise<void> => {
    try {
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef, where('status', '==', 'ACTIVE'));
        const snapshot = await getDocs(q);

        let migrated = 0;
        for (const docSnap of snapshot.docs) {
            const game = { id: docSnap.id, ...docSnap.data() } as Game;
            if (game.players && game.players.length >= 6) {
                await migratePlayersToSubcollection(game.id);
                migrated++;
            }
        }

        log.info(`Migrated ${migrated} games to player subcollections`);
    } catch (error) {
        log.error('Error migrating all large games:', error);
        throw error;
    }
};
