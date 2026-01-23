import { Player } from "./Player";

export type GameStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export type Game = {
    id: string;
    hostId: string;
    status: GameStatus;
    groupId: string | null;
    config: {
        defaultBuyIn: number;
        payoutModel?: string; // TODO: définir un type pour les modèles de payout
        //       Exemple : 50_30_20 (defaut), 60_25_15, etc.
        defaultTimeBlindDuration?: number;
    };
    totalPot: number;
    players: Player[];
    createdAt: number;
    startedAt?: number | null;
    finishedAt?: number | null;
}