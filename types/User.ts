export type UserStatistics = {
  gamesPlayed: number;
  wins: number;          // Nombre de fois 1er
  totalInvested: number;
  totalWinnings: number;
  netProfit: number;
  bestRank: number;
}

export type User = {
  displayName: string;
  avatarUrl?: string;
  createdAt: number;
  lastLoginAt: number;
  groupIds: string[];
  statistics: UserStatistics;
}