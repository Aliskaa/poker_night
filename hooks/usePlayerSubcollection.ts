import { useState, useCallback, useEffect } from 'react';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, Timestamp, increment } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { GamePlayer } from '@/types/PlayerSubcollection';
import { useToast } from '@/hooks/useToast';
import { ErrorHandler } from '@/utils/errorHandler';
import log from '@/services/logger';

/**
 * Hook pour gérer les joueurs en subcollection
 * Utilisé quand game.players.length >= 6
 */
export const usePlayerSubcollection = (gameId: string | undefined) => {
    const [players, setPlayers] = useState<GamePlayer[]>([]);
    const [loading, setLoading] = useState(false);
    const { error: errorToast, success: successToast } = useToast();

    // Écouter les changements en temps réel
    useEffect(() => {
        if (!gameId) {
            setPlayers([]);
            return;
        }

        setLoading(true);
        const playersRef = collection(db, 'games', gameId, 'players');

        const unsubscribe = onSnapshot(
            playersRef,
            (snapshot) => {
                const playersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as GamePlayer));

                setPlayers(playersList.sort((a, b) => {
                    // Trier par position, puis par joinedAt
                    if (a.position !== undefined && b.position !== undefined) {
                        return a.position - b.position;
                    }
                    return a.joinedAt.toMillis() - b.joinedAt.toMillis();
                }));

                setLoading(false);
            },
            (error) => {
                log.error('Error listening to players subcollection:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [gameId]);

    /**
     * Ajouter un joueur
     */
    const addPlayer = useCallback(
        async (player: Omit<GamePlayer, 'id' | 'joinedAt'>) => {
            if (!gameId) return null;

            return ErrorHandler.tryAsync(
                async () => {
                    const playerData: Omit<GamePlayer, 'id'> = {
                        ...player, 
                        joinedAt: Timestamp.now(),
                    };

                    // Remove undefined values (Firebase doesn't support them)
                    const cleanedData = Object.fromEntries(
                        Object.entries(playerData).filter(([_, v]) => v !== undefined)
                    );

                    const playerRef = await addDoc(
                        collection(db, 'games', gameId, 'players'),
                        cleanedData
                    );

                    // Mettre à jour metadata du game + totalPot
                    await updateDoc(doc(db, 'games', gameId), {
                        totalPot: increment(player.buyInAmount),
                        'metadata.playerCount': players.length + 1,
                        'metadata.activePlayers': players.filter(p => p.isActive).length + 1,
                        'metadata.lastActivity': Timestamp.now(),
                    });

                    successToast(`${player.name} a rejoint la partie`);
                    return playerRef.id;
                },
                'addPlayer',
                (error) => {
                    errorToast('Erreur lors de l\'ajout du joueur');
                    log.error('Error adding player to subcollection:', error);
                }
            );
        },
        [gameId, players, successToast, errorToast]
    );

    /**
     * Mettre à jour un joueur
     */
    const updatePlayer = useCallback(
        async (playerId: string, updates: Partial<GamePlayer>) => {
            if (!gameId) return;

            return ErrorHandler.tryAsync(
                async () => {
                    const player = players.find(p => p.id === playerId);
                    if (!player) return;

                    await updateDoc(doc(db, 'games', gameId, 'players', playerId), {
                        ...updates,
                    });

                    const gameUpdates: any = {
                        'metadata.lastActivity': Timestamp.now(),
                    };

                    // Mettre à jour totalPot si rebuy
                    if (updates.rebuyCount !== undefined && updates.totalInvested !== undefined) {
                        const rebuyAmount = updates.totalInvested - player.totalInvested;
                        if (rebuyAmount > 0) {
                            gameUpdates.totalPot = increment(rebuyAmount);
                        }
                    }

                    // Mettre à jour metadata si changement d'état
                    if (updates.isActive !== undefined) {
                        const activeCount = players.filter(p => 
                            p.id === playerId ? updates.isActive : p.isActive
                        ).length;
                        gameUpdates['metadata.activePlayers'] = activeCount;
                    }

                    await updateDoc(doc(db, 'games', gameId), gameUpdates);
                },
                'updatePlayer',
                (error) => {
                    errorToast('Erreur lors de la mise à jour du joueur');
                    log.error('Error updating player in subcollection:', error);
                }
            );
        },
        [gameId, players, errorToast]
    );

    /**
     * Retirer un joueur (soft delete)
     */
    const removePlayer = useCallback(
        async (playerId: string) => {
            if (!gameId) return;

            return ErrorHandler.tryAsync(
                async () => {
                    const player = players.find(p => p.id === playerId);
                    if (!player) return;

                    await updateDoc(doc(db, 'games', gameId, 'players', playerId), {
                        isActive: false,
                        leftAt: Timestamp.now(),
                    });

                    await updateDoc(doc(db, 'games', gameId), {
                        'metadata.activePlayers': players.filter(p => p.isActive && p.id !== playerId).length,
                        'metadata.lastActivity': Timestamp.now(),
                    });

                    successToast(`${player.name} a quitté la partie`);
                },
                'removePlayer',
                (error) => {
                    errorToast('Erreur lors du retrait du joueur');
                    log.error('Error removing player from subcollection:', error);
                }
            );
        },
        [gameId, players, successToast, errorToast]
    );

    /**
     * Supprimer définitivement un joueur
     */
    const deletePlayer = useCallback(
        async (playerId: string) => {
            if (!gameId) return;

            return ErrorHandler.tryAsync(
                async () => {
                    await deleteDoc(doc(db, 'games', gameId, 'players', playerId));

                    await updateDoc(doc(db, 'games', gameId), {
                        'metadata.playerCount': players.length - 1,
                        'metadata.activePlayers': players.filter(p => p.isActive && p.id !== playerId).length,
                        'metadata.lastActivity': Timestamp.now(),
                    });
                },
                'deletePlayer',
                (error) => {
                    errorToast('Erreur lors de la suppression du joueur');
                    log.error('Error deleting player from subcollection:', error);
                }
            );
        },
        [gameId, players, errorToast]
    );

    return {
        players,
        loading,
        addPlayer,
        updatePlayer,
        removePlayer,
        deletePlayer,
    };
};
