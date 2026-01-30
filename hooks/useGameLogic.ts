import { db } from "@/services/firebase";
import log from "@/services/logger";
import { Game, GameConfig } from "@/types/Game";
import { Player, PlayerStatus } from "@/types/Player";
import { useUser } from "@clerk/clerk-expo"
import { addDoc, collection, doc, increment, onSnapshot, serverTimestamp, updateDoc, writeBatch, runTransaction, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { GameConfigSchema, RebuySchema, EliminatePlayerSchema, AddGuestSchema } from "@/lib/validations/game";
import { isLateRegOpen as checkLateRegOpen } from "@/utils/timestampHelpers";
import { z, ZodError } from "zod";

export const useGameLogic = (gameId?: string) => {
    const { user } = useUser();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
    const createGame = async (config: GameConfig, groupId?: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            // ✅ VALIDATION des données
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
                createdAt: serverTimestamp(), // ✅ CORRIGÉ : serverTimestamp au lieu de new Date()
                currentBlindLevel: 0, // ✅ AJOUTÉ
                blindLevelStartedAt: serverTimestamp(), // ✅ AJOUTÉ
                isPaused: false, // ✅ AJOUTÉ
            }

            const docRef = await addDoc(collection(db, "games"), newGameData);
            log.info(`useGameLogic: Nouvelle partie créée avec l'ID ${docRef.id}`);
            return docRef.id;
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                log.error(`Validation error: ${firstError.message}`);
                return null;
            }
            log.error("useGameLogic: Erreur lors de la création de la partie:", error);
            return null;
        }
    }

    // ----------------------------------------------------------------------
    // 3. ACTIONS: Gérer les joueurs (Ajout, Recave, Élimination)
    // ----------------------------------------------------------------------

    const joinGame = async () => {
        if (!game || !gameId) return;

        if (!isLateRegOpen()) {
            alert("Impossible de rejoindre : Inscriptions fermées.");
            return;
        }

        // 1. Vérifier si le joueur est déjà à la table (pour éviter les doublons)
        const isAlreadyPlaying = game.players.some(p => p.id === user?.id);
        if (isAlreadyPlaying) {
            log.warn("useGameLogic: Le joueur est déjà à la table.");
            return;
        }

        // 2. Ajouter le joueur à la partie
        const newPlayer: Player = {
            id: user!.id,
            avatarUrl: user!.imageUrl,
            name: user!.firstName || user!.username || "Joueur",
            isGuest: false,
            buyInCount: 1,
            totalInvested: game.config.defaultBuyIn,
            status: 'ACTIVE'
        };

        // 3. L'ajouter a Firestore et augmenter le pot
        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
            players: [...game.players, newPlayer],
            totalPot: increment(game.config.defaultBuyIn),
        });
    };

    // Ajouter un nouvel invité à la table
    const addGuestPlayer = async (guestName: string, buyIn: number) => {
        if (!game || !gameId) return;

        try {
            // ✅ VALIDATION
            const validatedData = AddGuestSchema.parse({ name: guestName, amount: buyIn });

            if (!isLateRegOpen()) {
                alert("Les inscriptions sont fermées (Late Reg terminé) !");
                return;
            }

            const newGuest: Player = {
                id: `guest_${Date.now()}`,
                name: validatedData.name,
                isGuest: true,
                buyInCount: 1,
                totalInvested: validatedData.amount,
                status: 'ACTIVE'
            };

            const gameRef = doc(db, "games", gameId);

            // ✅ UTILISATION DE TRANSACTION pour garantir l'atomicité
            await runTransaction(db, async (transaction) => {
                const gameSnap = await transaction.get(gameRef);
                if (!gameSnap.exists()) {
                    throw new Error('Game not found');
                }

                const currentGame = gameSnap.data() as Game;
                
                transaction.update(gameRef, {
                    players: [...currentGame.players, newGuest],
                    totalPot: currentGame.totalPot + validatedData.amount,
                });
            });

            log.info("Invité ajouté avec succès");
        } catch (error) {
            if (error instanceof ZodError) {
                log.error(`Validation error: ${error.issues[0].message}`);
                alert(`Erreur: ${error.issues[0].message}`);
            } else {
                log.error("Erreur lors de l'ajout de l'invité:", error);
            }
        }
    };

    // Ajouter une recave (Add-on) à un joueur existant
    const addRebuy = async (playerId: string, amount: number) => {
        if (!game || !gameId) return;

        try {
            // ✅ VALIDATION
            const validatedData = RebuySchema.parse({ playerId, amount });

            if (!isLateRegOpen()) {
                alert("Les recaves sont terminées !");
                return;
            }

            const gameRef = doc(db, "games", gameId);
            const rebuyAmount = validatedData.amount || game.config.defaultBuyIn;

            // ✅ UTILISATION DE TRANSACTION
            await runTransaction(db, async (transaction) => {
                const gameSnap = await transaction.get(gameRef);
                if (!gameSnap.exists()) {
                    throw new Error('Game not found');
                }

                const currentGame = gameSnap.data() as Game;
                const updatedPlayers = currentGame.players.map(player => {
                    if (player.id === validatedData.playerId) {
                        return {
                            ...player,
                            buyInCount: player.buyInCount + 1,
                            totalInvested: player.totalInvested + rebuyAmount,
                            status: 'ACTIVE' as PlayerStatus, // Au cas où il était éliminé
                        };
                    }
                    return player;
                });

                transaction.update(gameRef, {
                    players: updatedPlayers,
                    totalPot: currentGame.totalPot + rebuyAmount,
                });
            });

            log.info("Rebuy ajouté avec succès");
        } catch (error) {
            if (error instanceof ZodError) {
                log.error(`Validation error: ${error.issues[0].message}`);
            } else {
                log.error("Erreur lors de l'ajout du rebuy:", error);
            }
        }
    };

    // Eliminer un joueur
    const eliminatePlayer = async (playerId: string) => {
        if (!game || !gameId) return;

        try {
            // ✅ VALIDATION
            const validatedData = EliminatePlayerSchema.parse({ playerId });

            const gameRef = doc(db, "games", gameId);

            // ✅ UTILISATION DE TRANSACTION
            await runTransaction(db, async (transaction) => {
                const gameSnap = await transaction.get(gameRef);
                if (!gameSnap.exists()) {
                    throw new Error('Game not found');
                }

                const currentGame = gameSnap.data() as Game;
                
                // On compte combien de joueurs sont DÉJÀ éliminés pour calculer le rang de celui qui sort.
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

            log.info("Joueur éliminé avec succès");
        } catch (error) {
            if (error instanceof ZodError) {
                log.error(`Validation error: ${error.issues[0].message}`);
            } else {
                log.error("Erreur lors de l'élimination:", error);
            }
        }
    };

    // --- UTILITAIRE : Vérifier si les inscriptions/recaves sont encore ouvertes ---
    const isLateRegOpen = (): boolean => {
        if (!game) return false;
        // ✅ UTILISATION DE L'HELPER
        return checkLateRegOpen(game.createdAt, game.config.lateRegLimit);
    };

    // ----------------------------------------------------------------------
    // 4. ACTION: Terminer la partie et distribuer les gains (50/30/20)
    //            Ajout des stats
    // ----------------------------------------------------------------------
    const endGame = async () => {
        if (!game || !gameId) return;

        // Calcul des gains selon la structure 50 % / 30 % / 20 %
        const totalPot = game.totalPot;
        const payout1 = Math.round(totalPot * 0.5);
        const payout2 = Math.round(totalPot * 0.3);
        const payout3 = totalPot - payout1 - payout2; // Reste pour le 3ème

        // Attribution des gains et du rang final au dernier survivant
        const updatedPlayers = game.players.map(player => {
            // 1. Le dernier joueur actif est forcément 1er
            if (player.status === 'ACTIVE') {
                return {
                    ...player,
                    status: 'ELIMINATED' as PlayerStatus,
                    finalRank: 1,
                    payout: payout1
                };
            }

            // 2. Les autres ont déja leur rang (calculé lors de l'élimination)
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
            finishedAt: serverTimestamp(), // ✅ AJOUTÉ
        });

        updatedPlayers.forEach(player => {
            if (!player.isGuest) {
                const playerRef = doc(db, "users", player.id);
                const profit = (player.payout || 0) - player.totalInvested;

                // increment() permet d'ajouter une valeur à un champ numérique existant
                batch.update(playerRef, {
                    'statistics.gamesPlayed': increment(1),
                    'statistics.totalInvested': increment(player.totalInvested),
                    'statistics.totalWinnings': increment(player.payout || 0),
                    'statistics.netProfit': increment(profit),
                    'statistics.wins': player.finalRank === 1 ? increment(1) : increment(0),
                    lastLoginAt: serverTimestamp(), // ✅ AJOUTÉ
                });
            }
        });

        // Commit de toutes les modifications en une seule opération
        await batch.commit();
    }

    // ✅ AJOUTÉ : Fonctions pour gérer les blinds
    const pauseBlindTimer = async () => {
        if (!game || !gameId) return;

        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
            isPaused: true,
            pausedAt: serverTimestamp(),
        });
    };

    const resumeBlindTimer = async () => {
        if (!game || !gameId) return;

        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
            isPaused: false,
            pausedAt: null,
        });
    };

    const nextBlindLevel = async () => {
        if (!game || !gameId) return;

        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
            currentBlindLevel: (game.currentBlindLevel || 0) + 1,
            blindLevelStartedAt: serverTimestamp(),
        });
    };

    return {
        game,
        loading,
        createGame,
        joinGame,
        addGuestPlayer,
        addRebuy,
        eliminatePlayer,
        endGame,
        pauseBlindTimer,    // ✅ AJOUTÉ
        resumeBlindTimer,   // ✅ AJOUTÉ
        nextBlindLevel,     // ✅ AJOUTÉ
        isLateRegOpen: isLateRegOpen()
    };
}