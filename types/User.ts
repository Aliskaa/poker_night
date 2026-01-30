import { Timestamp } from 'firebase/firestore';

export type UserStatistics = {
  gamesPlayed: number;
  wins: number;          // Nombre de fois 1er
  totalInvested: number;
  totalWinnings: number;
  netProfit: number;
  bestRank: number;
}

export type User = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  
  // Timestamps (Firebase Timestamp ou number pour compatibilité)
  createdAt: Timestamp | Date | number;
  lastLoginAt: Timestamp | Date | number;
  updatedAt?: Timestamp | Date | number;
  
  groupIds: string[];
  statistics: UserStatistics;
}