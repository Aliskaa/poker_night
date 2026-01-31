import { Timestamp } from 'firebase/firestore';

export type PlayerStatus = 'ACTIVE' | 'ELIMINATED';

export type Player = {
    id: string;
    name: string;
    avatarUrl?: string;
    isGuest: boolean;
    buyInCount: number;
    totalInvested: number;
    status: PlayerStatus;
    eliminatedAt?: Timestamp | null;
    finalRank?: number | null;
    payout?: number;
    
    // Champs additionnels
    currentStack?: number;
    seatPosition?: number;
}

export type Guest = {
    id: string;
    name: string;
    netProfit: number;
    gamesPlayed: number;
}