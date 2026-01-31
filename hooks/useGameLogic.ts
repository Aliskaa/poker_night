import { db } from "@/services/firebase";
import log from "@/services/logger";
import { Game, GameConfig } from "@/types/Game";
import { Player, PlayerStatus } from "@/types/Player";
import { useUser } from "@clerk/clerk-expo"
import { addDoc, collection, doc, increment, onSnapshot, serverTimestamp, updateDoc, writeBatch, runTransaction, Timestamp } from "firebase/firestore";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { GameConfigSchema, RebuySchema, EliminatePlayerSchema, AddGuestSchema } from "@/lib/validations/game";
import { isLateRegOpen as checkLateRegOpen } from "@/utils/timestampHelpers";
import { ErrorHandler, generateSecureId } from "@/utils/errorHandler";
import { useToast } from "@/hooks/useToast";

export const useGameLogic = (gameId?: string) => {
    const { user } = useUser();
    const { success: successToast, error: errorToast } = useToast();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const hasJoinedRef = useRef<boolean>(false);

    // ----------------------------------------------------------------------
    // 1. ECOUTEUR TEMPS REEL (Si un gameId est fourni)
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (!gameId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const gameRef = doc(db, "games", gameId);

        // onSnapshot écoute les changement en direct
        const unsubscribe = onSnapshot(gameRef, (docSnap) => {
            if (docSnap.exists()) {
                setGame({ id: docSnap.id, ...docSnap.data() } as Game);
            } else {
                log.warn("useGameLogic: La partie n'existe pas ou a été supprimée.");
                setGame(null);
            }
            setLoading(false);
        });


        return () => unsubscribe();
    }, [gameId]);

    // ----------------------------------------------------------------------
    // 2. ACTION: CREATION DE PARTIE
    // ----------------------------------------------------------------------
    const createGame = useCallback(async (config: GameConfig, groupId?: string) => {
        if (!user) {
            errorToast('Vous devez être connecté');
            return null;
        }

        return ErrorHandler.tryAsync(
            async () => {
                const validatedConfig = GameConfigSchema.parse(config);

                const newGameData: Omit<Game, 'id'> = {
                    hostId: user.id,
                    status: 'PLAYING',
                    groupId: groupId || null,
                    config: validatedConfig,
                    totalPot: validatedConfig.defaultBuyIn,
                    players: [
                        {
                            id: user.id,
                            avatarUrl: user.imageUrl,
                            name: user.firstName || user.username || "Hôte",
                            isGuest: false,
                            buyInCount: 1,
                            totalInvested: validatedConfig.defaultBuyIn,
                            status: 'ACTIVE',
                            finalRank: null,
                            payout: 0,
                        },
                    ],
                    createdAt: serverTimestamp(),
                    currentBlindLevel: 0,
                    blindLevelStartedAt: serverTimestamp(),
                    isPaused: false,
                }

                const docRef = await ErrorHandler.retryWithBackoff(
                    () => addDoc(collection(db, "games"), newGameData),
                    3,
                    1000,
                    'createGame'
                );
                
                successToast('Partie créée avec succès !');
                log.info(`Nouvelle partie créée avec l'ID ${docRef.id}`);
                return docRef.id;
            },
            'createGame',
            (error) => errorToast(error.message)
        );
    }, [user, successToast, errorToast]);

    // ----------------------------------------------------------------------
    // 3. ACTIONS: Gérer les joueurs (Ajout, Recave, Élimination)
    // ----------------------------------------------------------------------

    const joinGame = useCallback(async () => {
        if (!game || !gameId || !user || hasJoinedRef.current) return;

        if (!checkLateRegOpen(game.createdAt, game.config.lateRegLimit)) {
            errorToast("Inscriptions fermées");
            return;
        }

        const isAlreadyPlaying = game.players.some(p => p.id === user.id);
        if (isAlreadyPlaying) {
            hasJoinedRef.current = true;
            return;
        }

        hasJoinedRef.current = true;

        return ErrorHandler.tryAsync(
            async () => {
                const newPlayer: Player = {
                    id: user.id,
                    avatarUrl: user.imageUrl,
                    name: user.firstName || user.username || "Joueur",
                    isGuest: false,
                    buyInCount: 1,
                    totalInvested: game.config.defaultBuyIn,
                    status: 'ACTIVE'
                };

                const gameRef = doc(db, "games", gameId);
                await runTransaction(db, async (transaction) => {
                    const gameSnap = await transaction.get(gameRef);
                    if (!gameSnap.exists()) throw new Error('Game not found');
                    
                    const currentGame = gameSnap.data() as Game;
                    if (currentGame.players.some(p => p.id === user.id)) {
                        return; // Déjà rejoint
                    }

                    transaction.update(gameRef, {
                        players: [...currentGame.players, newPlayer],
                        totalPot: currentGame.totalPot + game.config.defaultBuyIn,
                    });
                });
                
                successToast('Vous avez rejoint la partie');
            },
            'joinGame',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, user, successToast, errorToast]);

    // Ajouter un nouvel invité à la table
    const addGuestPlayer = useCallback(async (guestName: string, buyIn: number) => {
        if (!game || !gameId) return;

        if (!checkLateRegOpen(game.createdAt, game.config.lateRegLimit)) {
            errorToast("Les inscriptions sont fermées");
            return;
        }

        return ErrorHandler.tryAsync(
            async () => {
                const validatedData = AddGuestSchema.parse({ name: guestName, amount: buyIn });

                const newGuest: Player = {
                    id: generateSecureId('guest_'),
                    name: validatedData.name,
                    isGuest: true,
                    buyInCount: 1,
                    totalInvested: validatedData.amount,
                    status: 'ACTIVE'
                };

                const gameRef = doc(db, "games", gameId);
                await runTransaction(db, async (transaction) => {
                    const gameSnap = await transaction.get(gameRef);
                    if (!gameSnap.exists()) throw new Error('Game not found');

                    const currentGame = gameSnap.data() as Game;
                    transaction.update(gameRef, {
                        players: [...currentGame.players, newGuest],
                        totalPot: currentGame.totalPot + validatedData.amount,
                    });
                });

                successToast(`${validatedData.name} a été ajouté`);
            },
            'addGuestPlayer',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, successToast, errorToast]);

    // Ajouter une recave (Add-on) à un joueur existant
    const addRebuy = useCallback(async (playerId: string, amount: number) => {
        if (!game || !gameId) return;

        if (!checkLateRegOpen(game.createdAt, game.config.lateRegLimit)) {
            errorToast("Les recaves sont terminées");
            return;
        }

        return ErrorHandler.tryAsync(
            async () => {
                const validatedData = RebuySchema.parse({ playerId, amount });
                const gameRef = doc(db, "games", gameId);
                const rebuyAmount = validatedData.amount || game.config.defaultBuyIn;

                await runTransaction(db, async (transaction) => {
                    const gameSnap = await transaction.get(gameRef);
                    if (!gameSnap.exists()) throw new Error('Game not found');

                    const currentGame = gameSnap.data() as Game;
                    const updatedPlayers = currentGame.players.map(player => {
                        if (player.id === validatedData.playerId) {
                            return {
                                ...player,
                                buyInCount: player.buyInCount + 1,
                                totalInvested: player.totalInvested + rebuyAmount,
                                status: 'ACTIVE' as PlayerStatus,
                            };
                        }
                        return player;
                    });

                    transaction.update(gameRef, {
                        players: updatedPlayers,
                        totalPot: currentGame.totalPot + rebuyAmount,
                    });
                });

                successToast('Recave ajoutée');
            },
            'addRebuy',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, successToast, errorToast]);

    // Eliminer un joueur
    const eliminatePlayer = useCallback(async (playerId: string) => {
        if (!game || !gameId) return;

        return ErrorHandler.tryAsync(
            async () => {
                const validatedData = EliminatePlayerSchema.parse({ playerId });
                const gameRef = doc(db, "games", gameId);

                await runTransaction(db, async (transaction) => {
                    const gameSnap = await transaction.get(gameRef);
                    if (!gameSnap.exists()) throw new Error('Game not found');

                    const currentGame = gameSnap.data() as Game;
                    const eliminatedCount = currentGame.players.filter(p => p.status === 'ELIMINATED').length;
                    const totalPlayers = currentGame.players.length;
                    const currentRank = totalPlayers - eliminatedCount;

                    const updatedPlayers = currentGame.players.map(player => {
                        if (player.id === validatedData.playerId) {
                            return {
                                ...player,
                                status: 'ELIMINATED' as PlayerStatus,
                                finalRank: currentRank,
                                eliminatedAt: Timestamp.now(), 
                            };
                        }
                        return player;
                    });

                    transaction.update(gameRef, {
                        players: updatedPlayers,
                    });
                });

                successToast('Joueur éliminé');
            },
            'eliminatePlayer',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, successToast, errorToast]);

    // --- UTILITAIRE : Vérifier si les inscriptions/recaves sont encore ouvertes ---
    const isLateRegOpen = useMemo(() => {
        if (!game) return false;
        return checkLateRegOpen(game.createdAt, game.config.lateRegLimit);
    }, [game?.createdAt, game?.config.lateRegLimit]);

    // ----------------------------------------------------------------------
    // 4. ACTION: Terminer la partie et distribuer les gains (50/30/20)
    //            Ajout des stats
    // ----------------------------------------------------------------------
    const endGame = useCallback(async () => {
        if (!game || !gameId) return;

        return ErrorHandler.tryAsync(
            async () => {
                const totalPot = game.totalPot;
                const payout1 = Math.round(totalPot * 0.5);
                const payout2 = Math.round(totalPot * 0.3);
                const payout3 = totalPot - payout1 - payout2;

                const updatedPlayers = game.players.map(player => {
                    if (player.status === 'ACTIVE') {
                        return {
                            ...player,
                            status: 'ELIMINATED' as PlayerStatus,
                            finalRank: 1,
                            payout: payout1
                        };
                    }

                    let finalPayout = 0;
                    if (player.finalRank === 2) finalPayout = payout2;
                    if (player.finalRank === 3) finalPayout = payout3;

                    return { ...player, payout: finalPayout };
                });

                const batch = writeBatch(db);
                const gameRef = doc(db, "games", gameId);
                
                batch.update(gameRef, {
                    status: 'FINISHED',
                    players: updatedPlayers,
                    finishedAt: serverTimestamp(),
                });

                updatedPlayers.forEach(player => {
                    if (!player.isGuest) {
                        const playerRef = doc(db, "users", player.id);
                        const profit = (player.payout || 0) - player.totalInvested;

                        batch.update(playerRef, {
                            'statistics.gamesPlayed': increment(1),
                            'statistics.totalInvested': increment(player.totalInvested),
                            'statistics.totalWinnings': increment(player.payout || 0),
                            'statistics.netProfit': increment(profit),
                            'statistics.wins': player.finalRank === 1 ? increment(1) : increment(0),
                            lastLoginAt: serverTimestamp(),
                        });
                    }
                });

                await batch.commit();
                successToast('Partie terminée !');
            },
            'endGame',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, successToast, errorToast]);

    // ✅ AJOUTÉ : Fonctions pour gérer les blinds
    const pauseBlindTimer = useCallback(async () => {
        if (!game || !gameId) return;

        return ErrorHandler.tryAsync(
            async () => {
                const gameRef = doc(db, "games", gameId);
                await updateDoc(gameRef, {
                    isPaused: true,
                    pausedAt: serverTimestamp(),
                });
            },
            'pauseBlindTimer',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, errorToast]);

    const resumeBlindTimer = useCallback(async () => {
        if (!game || !gameId) return;

        return ErrorHandler.tryAsync(
            async () => {
                const gameRef = doc(db, "games", gameId);
                await updateDoc(gameRef, {
                    isPaused: false,
                    pausedAt: null,
                });
            },
            'resumeBlindTimer',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, errorToast]);

    const nextBlindLevel = useCallback(async () => {
        if (!game || !gameId) return;

        return ErrorHandler.tryAsync(
            async () => {
                const gameRef = doc(db, "games", gameId);
                await updateDoc(gameRef, {
                    currentBlindLevel: (game.currentBlindLevel || 0) + 1,
                    blindLevelStartedAt: serverTimestamp(),
                });
            },
            'nextBlindLevel',
            (error) => errorToast(error.message)
        );
    }, [game, gameId, errorToast]);

    return {
        game,
        loading,
        createGame,
        joinGame,
        addGuestPlayer,
        addRebuy,
        eliminatePlayer,
        endGame,
        pauseBlindTimer,
        resumeBlindTimer,
        nextBlindLevel,
        isLateRegOpen
    };
}