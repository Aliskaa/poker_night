import { PAYOUT_MODELS } from "@/constants/game";
import { Player } from "./Player";
import { Timestamp, FieldValue } from "firebase/firestore";

export type GameStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export type GameConfig = {
    defaultBuyIn: number;
    payoutModel: keyof typeof PAYOUT_MODELS;
    defaultTimeBlindDuration: number;
    lateRegLimit: number; // en minutes
}

export type Game = {
    id: string;
    hostId: string;
    groupId: string | null;
    status: GameStatus;
    config: GameConfig;
    totalPot: number;
    players: Player[];
    
    // Timestamps Firebase stricts
    createdAt: Timestamp | FieldValue;
    startedAt?: Timestamp | null;
    finishedAt?: Timestamp | FieldValue | null;
    
    // Gestion des blinds
    currentBlindLevel?: number;
    blindLevelStartedAt?: Timestamp | FieldValue;
    isPaused?: boolean;
    pausedAt?: Timestamp | FieldValue | null;
}