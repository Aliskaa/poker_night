export type PlayerStatus = 'ACTIVE' | 'ELIMINATED';

export interface Player {
    id: string;
    name: string;
    isGuest: boolean;
    buyInCount: number;
    totalInvested: number;
    status: PlayerStatus;
    eliminatedAt?: number | null;
    finalRank?: number | null;
    payout?: number;
}