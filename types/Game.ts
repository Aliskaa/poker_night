import { PAYOUT_MODELS } from "@/constants/game";
import { Player } from "./Player";
import { Timestamp } from "firebase/firestore";

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
    
    // Timestamps (Firebase Timestamp ou Date pour compatibilité)
    createdAt: Timestamp | Date | any;
    startedAt?: Timestamp | Date | null;
    finishedAt?: Timestamp | Date | null;
    
    // Gestion des blinds (ajouté pour P0)
    currentBlindLevel?: number; // Index du niveau actuel (0-based)
    blindLevelStartedAt?: Timestamp | Date | any; // Quand le niveau a commencé
    isPaused?: boolean; // Si le timer est en pause
    pausedAt?: Timestamp | Date | null; // Quand la pause a commencé
}