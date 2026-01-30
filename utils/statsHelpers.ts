import type { User } from '@/types/User';
import type { Game } from '@/types/Game';

/**
 * Utilitaires de calcul de statistiques avancées pour le poker
 */

/**
 * Calcule le ROI (Return On Investment) en pourcentage
 * ROI = ((Gains - Investissement) / Investissement) * 100
 */
export const calculateROI = (totalWinnings: number, totalInvested: number): number => {
  if (totalInvested === 0) return 0;
  return ((totalWinnings - totalInvested) / totalInvested) * 100;
};

/**
 * Calcule le winrate (pourcentage de victoires)
 */
export const calculateWinrate = (wins: number, gamesPlayed: number): number => {
  if (gamesPlayed === 0) return 0;
  return (wins / gamesPlayed) * 100;
};

/**
 * Calcule le pourcentage ITM (In The Money - finit dans les places payées)
 */
export const calculateITM = (cashes: number, gamesPlayed: number): number => {
  if (gamesPlayed === 0) return 0;
  return (cashes / gamesPlayed) * 100;
};

/**
 * Calcule le profit moyen par partie
 */
export const calculateAvgProfit = (netProfit: number, gamesPlayed: number): number => {
  if (gamesPlayed === 0) return 0;
  return netProfit / gamesPlayed;
};

/**
 * Calcule le buy-in moyen
 */
export const calculateAvgBuyIn = (totalInvested: number, gamesPlayed: number): number => {
  if (gamesPlayed === 0) return 0;
  return totalInvested / gamesPlayed;
};

/**
 * Calcule les statistiques complètes d'un joueur
 */
export const calculatePlayerStats = (user: User) => {
  const stats = user.statistics || {
    gamesPlayed: 0,
    wins: 0,
    totalInvested: 0,
    totalWinnings: 0,
    netProfit: 0,
  };

  return {
    gamesPlayed: stats.gamesPlayed,
    wins: stats.wins,
    totalInvested: stats.totalInvested,
    totalWinnings: stats.totalWinnings,
    netProfit: stats.netProfit,
    roi: calculateROI(stats.totalWinnings, stats.totalInvested),
    winrate: calculateWinrate(stats.wins, stats.gamesPlayed),
    avgProfit: calculateAvgProfit(stats.netProfit, stats.gamesPlayed),
    avgBuyIn: calculateAvgBuyIn(stats.totalInvested, stats.gamesPlayed),
  };
};

/**
 * Détermine la couleur en fonction du ROI
 */
export const getROIColor = (roi: number): string => {
  if (roi > 50) return '$success'; // Très bon
  if (roi > 20) return '$primary'; // Bon
  if (roi > 0) return '$warning'; // Légèrement positif
  return '$danger'; // Négatif
};

/**
 * Détermine l'emoji en fonction du ROI
 */
export const getROIEmoji = (roi: number): string => {
  if (roi > 50) return '🚀';
  if (roi > 20) return '💰';
  if (roi > 0) return '📈';
  if (roi === 0) return '😐';
  return '📉';
};

/**
 * Formate un nombre en pourcentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Formate un montant en euros
 */
export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('fr-FR').format(Math.abs(amount));
  return amount >= 0 ? `+${formatted}€` : `-${formatted}€`;
};

/**
 * Calcule la tendance (en hausse/baisse) sur les dernières parties
 */
export interface TrendData {
  value: number;
  direction: 'up' | 'down' | 'stable';
  percentage: number;
}

export const calculateTrend = (recentProfit: number, previousProfit: number): TrendData => {
  if (previousProfit === 0) {
    return {
      value: recentProfit,
      direction: recentProfit > 0 ? 'up' : recentProfit < 0 ? 'down' : 'stable',
      percentage: 0,
    };
  }

  const percentage = ((recentProfit - previousProfit) / Math.abs(previousProfit)) * 100;
  
  return {
    value: recentProfit - previousProfit,
    direction: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable',
    percentage: Math.abs(percentage),
  };
};

/**
 * Génère des données pour graphique d'évolution de bankroll
 */
export interface BankrollDataPoint {
  date: Date;
  profit: number;
  cumulativeProfit: number;
}

export const generateBankrollHistory = (
  games: Game[],
  userId: string
): BankrollDataPoint[] => {
  // Trier les parties par date
  const sortedGames = [...games].sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as any);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as any);
    return dateA.getTime() - dateB.getTime();
  });

  let cumulativeProfit = 0;
  const dataPoints: BankrollDataPoint[] = [];

  sortedGames.forEach((game) => {
    const player = game.players.find((p) => p.id === userId);
    if (!player) return;

    const profit = (player.payout || 0) - player.totalInvested;
    cumulativeProfit += profit;

    dataPoints.push({
      date: game.createdAt instanceof Date ? game.createdAt : new Date(game.createdAt as any),
      profit,
      cumulativeProfit,
    });
  });

  return dataPoints;
};

/**
 * Calcule les statistiques par groupe
 */
export const calculateGroupStats = (games: Game[], userId: string) => {
  const userGames = games.filter((game) =>
    game.players.some((p) => p.id === userId)
  );

  const totalInvested = userGames.reduce((sum, game) => {
    const player = game.players.find((p) => p.id === userId);
    return sum + (player?.totalInvested || 0);
  }, 0);

  const totalWinnings = userGames.reduce((sum, game) => {
    const player = game.players.find((p) => p.id === userId);
    return sum + (player?.payout || 0);
  }, 0);

  const wins = userGames.filter((game) => {
    const player = game.players.find((p) => p.id === userId);
    return player?.finalRank === 1;
  }).length;

  const cashes = userGames.filter((game) => {
    const player = game.players.find((p) => p.id === userId);
    return (player?.payout || 0) > 0;
  }).length;

  return {
    gamesPlayed: userGames.length,
    wins,
    cashes,
    totalInvested,
    totalWinnings,
    netProfit: totalWinnings - totalInvested,
    roi: calculateROI(totalWinnings, totalInvested),
    winrate: calculateWinrate(wins, userGames.length),
    itm: calculateITM(cashes, userGames.length),
  };
};

/**
 * Obtient le classement des joueurs d'un groupe
 */
export interface PlayerRanking {
  userId: string;
  name: string;
  avatarUrl?: string;
  gamesPlayed: number;
  netProfit: number;
  roi: number;
  wins: number;
}

export const getGroupRankings = (
  games: Game[],
  users: { id: string; name: string; avatarUrl?: string }[]
): PlayerRanking[] => {
  const rankings: PlayerRanking[] = users.map((user) => {
    const stats = calculateGroupStats(games, user.id);
    return {
      userId: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      gamesPlayed: stats.gamesPlayed,
      netProfit: stats.netProfit,
      roi: stats.roi,
      wins: stats.wins,
    };
  });

  // Trier par profit net décroissant
  return rankings.sort((a, b) => b.netProfit - a.netProfit);
};
