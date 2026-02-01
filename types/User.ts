import { Timestamp, FieldValue } from 'firebase/firestore';

export type UserStatistics = {
  gamesPlayed: number;
  wins: number;
  totalInvested: number;
  totalWinnings: number;
  netProfit: number;
  bestRank: number;
}

export type User = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  email: string;
  
  // Timestamps Firebase stricts
  createdAt: Timestamp | FieldValue;
  lastLoginAt: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  
  groupIds: string[];
  statistics: UserStatistics;
}