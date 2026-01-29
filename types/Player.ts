export type PlayerStatus = 'ACTIVE' | 'ELIMINATED';

export type Player = {
    id: string;
    name: string;
    avatarUrl?: string;
    isGuest: boolean;
    buyInCount: number;
    totalInvested: number;
    status: PlayerStatus;
    eliminatedAt?: number | null;
    finalRank?: number | null;
    payout?: number;
}

export type Guest = {
    id: string;
    name: string;
    netProfit: number;
    gamesPlayed: number;
}