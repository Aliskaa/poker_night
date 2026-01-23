import { db } from "@/services/firebase";
import log from "@/services/logger";
import { Game } from "@/types/Game";
import { Player, PlayerStatus } from "@/types/Player";
import { useUser } from "@clerk/clerk-expo"
import { addDoc, collection, doc, increment, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
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
    const createGame = async (defaultBuyIn: number = 5) => {
        if (!user) return null;

        try {
            const newGameData: Game = {
                id: '', // L'ID sera généré par Firestore
                hostId: user.id,
                status: 'PLAYING',
                config: {
                    defaultBuyIn,
                },
                totalPot: defaultBuyIn,
                players: [
                    {
                        id: user.id,
                        name: user.firstName || user.username || "Hôte",
                        isGuest: false,
                        buyInCount: 1,
                        totalInvested: defaultBuyIn,
                        status: 'ACTIVE',
                        finalRank: null,
                        payout: 0,
                    },
                ],
                createdAt: new Date().getTime(),
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

    // Ajouter un nouvel invité à la table
    const addGuestPlayer = async (guestName: string, buyIn: number) => {
        if (!game || !gameId) return;

        const newPlayer: Player = {
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
            players: [...game.players, newPlayer],
            totalPot: increment(buyIn),
        });
    };

    // Ajouter une recave (Add-on) à un joueur existant
    const addRebuy = async (playerId: string, amount: number) => {
        if (!game || !gameId) return;

        // Firebase ne permet pas de modifier un élément précis d'un tableau facilement.
        // L'astuce : On modifie le tableau en local (JS) et on réécrit tout le tableau.
        // (Très performant pour < 20 joueurs).

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

    // ----------------------------------------------------------------------
    // 4. ACTION: Terminer la partie et distribuer les gains (50/30/20)
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
            else if (player.finalRank === 3) finalPayout = payout3;

            return {
                ...player,
                payout: finalPayout
            };
        });

        const gameRef = doc(db, "games", gameId);

        // On met à jour le status de la partie à 'FINISHED' et on sauvegarde les gains
        await updateDoc(gameRef, {
            status: 'FINISHED',
            players: updatedPlayers,
        });
    };

    return {
        game,
        loading,
        createGame,
        addGuestPlayer,
        addRebuy,
        eliminatePlayer,
        endGame,
    };
}