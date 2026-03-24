import { db } from "@/services/firebase";
import log from "@/services/logger";
import { Game, GameConfig } from "@/types/Game";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { GameConfigSchema } from "@/lib/validations/game";
import { isLateRegOpen as checkLateRegOpen } from "@/utils/timestampHelpers";
import { ErrorHandler } from "@/utils/errorHandler";
import { useToast } from "@/hooks/useToast";
import { useUserLogic } from "./useUserLogic";

export const useGameLogic = (gameId?: string) => {
    const { user } = useUserLogic();
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
    const createGame = useCallback(async (
        config: GameConfig, 
        groupId?: string
    ) => {
        if (!user) {
            errorToast('Vous devez être connecté');
            return null;
        }

        return ErrorHandler.tryAsync(
            async () => {
                const validatedConfig = GameConfigSchema.parse(config);

                const newGameData: Omit<Game, 'id'> = {
                    hostId: user.id,
                    participantIds: [user.id],
                    status: 'PLAYING',
                    groupId: groupId || null,
                    config: validatedConfig,
                    totalPot: 0,
                    createdAt: serverTimestamp(),
                    currentBlindLevel: 0,
                    blindLevelStartedAt: serverTimestamp(),
                    isPaused: false,
                    metadata: {
                        lastActivity: serverTimestamp(),
                        playerCount: 0,
                        activePlayers: 0,
                    },
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
    // 3. UTILITAIRES
    // ----------------------------------------------------------------------
    // Note: joinGame, addGuestPlayer, addRebuy, eliminatePlayer sont maintenant
    // dans usePlayerSubcollection.addPlayer / updatePlayer

    // --- UTILITAIRE : Vérifier si les inscriptions/recaves sont encore ouvertes ---
    const isLateRegOpen = useMemo(() => {
        if (!game) return false;
        return checkLateRegOpen(game.createdAt, game.config.lateRegLimit);
    }, [game?.createdAt, game?.config.lateRegLimit]);

    // ----------------------------------------------------------------------
    // 4. ACTION: Terminer la partie et distribuer les gains (50/30/20)
    // ----------------------------------------------------------------------
    const endGame = useCallback(async () => {
        if (!game || !gameId) return;

        return ErrorHandler.tryAsync(
            async () => {
                // Lire les joueurs depuis la subcollection
                const playersSnapshot = await ErrorHandler.retryWithBackoff(
                    () => import('firebase/firestore').then(m => 
                        m.getDocs(collection(db, 'games', gameId, 'players'))
                    ),
                    2,
                    500,
                    'getPlayersForEndGame'
                );

                const players = playersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const totalPot = game.totalPot;
                const payout1 = Math.round(totalPot * 0.5);
                const payout2 = Math.round(totalPot * 0.3);
                const payout3 = totalPot - payout1 - payout2;

                const batch = writeBatch(db);
                const gameRef = doc(db, "games", gameId);
                
                // Marquer la partie comme terminée
                batch.update(gameRef, {
                    status: 'FINISHED',
                    finishedAt: serverTimestamp(),
                });

                // Mettre à jour chaque joueur dans la subcollection
                players.forEach((player: any) => {
                    const playerRef = doc(db, 'games', gameId, 'players', player.id);
                    
                    let finalPayout = 0;
                    let finalRank = player.finalRank;

                    // Si toujours actif, c'est le gagnant
                    if (player.isActive) {
                        finalRank = 1;
                        finalPayout = payout1;
                    } else if (player.finalRank === 2) {
                        finalPayout = payout2;
                    } else if (player.finalRank === 3) {
                        finalPayout = payout3;
                    }

                    batch.update(playerRef, {
                        winnings: finalPayout,
                        finalRank,
                        isActive: false,
                    });
                    // Stats utilisateur / user-game-stats : Cloud Function (syncStatsOnGameFinished)
                });

                await batch.commit();
                successToast('Partie terminée ! Classement mis à jour sous peu.');
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
        endGame,
        pauseBlindTimer,
        resumeBlindTimer,
        nextBlindLevel,
        isLateRegOpen
    };
}