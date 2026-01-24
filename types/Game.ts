import { Player } from "./Player";

export type GameStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export type GameConfig = {
    defaultBuyIn: number;
    payoutModel: string;
    defaultTimeBlindDuration: number;
    lateRegLimit: number; // en minutes
}

export type Game = {
    id: string;
    hostId: string;
    status: GameStatus;
    groupId: string | null;
    config: GameConfig;
    totalPot: number;
    players: Player[];
    createdAt: Date;
    startedAt?: Date | null;
    finishedAt?: Date | null;
}