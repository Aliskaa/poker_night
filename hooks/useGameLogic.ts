import { db } from "@/services/firebase";
import log from "@/services/logger";
import { Game, GameConfig } from "@/types/Game";
import { Player, PlayerStatus } from "@/types/Player";
import { useUser } from "@clerk/clerk-expo"
import { addDoc, collection, doc, increment, onSnapshot, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";

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
        if (!user) return null;

        try {
            const newGameData: Omit<Game, 'id'> = {
                hostId: user.id,
                status: 'PLAYING',
                groupId: groupId || null,
                config: config,
                totalPot: config.defaultBuyIn,
                players: [
                    {
                        id: user.id,
                        avatarUrl: user.imageUrl,
                        name: user.firstName || user.username || "Hôte",
                        isGuest: false,
                        buyInCount: 1,
                        totalInvested: config.defaultBuyIn,
                        status: 'ACTIVE',
                        finalRank: null,
                        payout: 0,
                    },
                ],
                createdAt: new Date(),
            }

            const docRef = await addDoc(collection(db, "games"), newGameData);
            log.info(`useGameLogic: Nouvelle partie créée avec l'ID ${docRef.id}`);
            return docRef.id;
        } catch (error) {
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

        if (!isLateRegOpen()) {
            alert("Les inscriptions sont fermées (Late Reg terminé) !");
            return;
        }

        const newGuest: Player = {
            id: `guest_${Date.now()}`,
            name: guestName,
            isGuest: true,
            buyInCount: 1,
            totalInvested: buyIn,
            status: 'ACTIVE'
        };

        const gameRef = doc(db, "games", gameId);

        // On ajoute le joueur à la liste et on augmente le pot
        await updateDoc(gameRef, {
            players: [...game.players, newGuest],
            totalPot: increment(buyIn),
        });
    };

    // Ajouter une recave (Add-on) à un joueur existant
    const addRebuy = async (playerId: string, amount: number) => {
        if (!game || !gameId) return;

        if (!isLateRegOpen()) {
            alert("Les recaves sont terminées !");
            return;
        }

        const updatePlayers = game.players.map(player => {
            if (player.id === playerId) {
                return {
                    ...player,
                    buyInCount: player.buyInCount + 1,
                    totalInvested: player.totalInvested + amount,
                    status: 'ACTIVE', // Au cas où il était éliminé
                };
            }
            return player;
        });

        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
            players: updatePlayers,
            totalPot: increment(amount),
        });
    };

    // Eliminer un joueur
    const eliminatePlayer = async (playerId: string) => {
        if (!game || !gameId) return;

        // On compte combien de joueurs sont DÉJÀ éliminés pour calculer le rang de celui qui sort.
        // Si on est 5, et que 0 sont éliminés, le premier qui sort est 5ème.
        const eliminatedCount = game.players.filter(p => p.status === 'ELIMINATED').length;
        const totalPlayers = game.players.length;
        const currentRank = totalPlayers - eliminatedCount;

        const updatePlayers = game.players.map(player => {
            if (player.id === playerId) {
                return {
                    ...player,
                    status: 'ELIMINATED',
                    finalRank: currentRank,
                    eliminatedAt: new Date().getTime(),
                };
            }
            return player;
        });

        const gameRef = doc(db, "games", gameId);
        await updateDoc(gameRef, {
            players: updatePlayers,
        });

    }

    // --- UTILITAIRE : Vérifier si les inscriptions/recaves sont encore ouvertes ---
    const isLateRegOpen = (): boolean => {
        if (!game) return false;
        // Si la limite est 0, c'est illimité ("Ouvert")
        if (game.config.lateRegLimit === 0) return true;

        let startTime = Date.now();

        if (game.createdAt) {
            // 1. Si c'est un vrai objet Timestamp Firebase (il a la méthode toDate)
            if (typeof (game.createdAt as any).toDate === 'function') {
                startTime = (game.createdAt as any).toDate().getTime();
            } 
            // 2. Si c'est un objet brut contenant "seconds" (Firebase Timestamp brut)
            else if ((game.createdAt as any).seconds) {
                startTime = (game.createdAt as any).seconds * 1000;
            }
            // 3. Si c'est déjà une date JS (en local avant l'envoi au serveur)
            else if (game.createdAt instanceof Date) {
                startTime = game.createdAt.getTime();
            }
        }

        const now = Date.now();
        const minutesElapsed = (now - startTime) / (1000 * 60);

        return minutesElapsed < game.config.lateRegLimit;
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
        });

        updatedPlayers.forEach(player => {
            if (!player.isGuest) {
                const playerRef = doc(db, "users", player.id);
                const profit = (player.payout || 0) - player.totalInvested;

                // increment() permet d'ajouter une valeur à un champ numérique existant
                batch.set(playerRef, {
                    statistics: {
                        gamesPlayed: increment(1),
                        totalInvested: increment(player.totalInvested),
                        totalWinnings: increment(player.payout || 0),
                        netProfit: increment(profit),
                    }
                }, { merge: true }); // 'merge: true' pour ne pas écraser les autres données utilisateur
            }
        });

        // Commit de toutes les modifications en une seule opération
        await batch.commit();
    }

    return {
        game,
        loading,
        createGame,
        joinGame,
        addGuestPlayer,
        addRebuy,
        eliminatePlayer,
        endGame,
        isLateRegOpen: isLateRegOpen()
    };
}