import { Player } from "./Player";

export type GameStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export type Game = {
    id: string;
    hostId: string;
    status: GameStatus;
    config: {
        defaultBuyIn: number;
    };
    totalPot: number;
    players: Player[];
    createdAt: number;
    startedAt?: number | null;
    finishedAt?: number | null;
}