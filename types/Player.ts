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
    eliminatedAt?: Timestamp | Date | number | null;
    finalRank?: number | null;
    payout?: number;
    
    // Champs additionnels (P0)
    currentStack?: number; // Stack actuel (différent de totalInvested)
    seatPosition?: number; // Position à la table (0-9)
}

export type Guest = {
    id: string;
    name: string;
    netProfit: number;
    gamesPlayed: number;
}