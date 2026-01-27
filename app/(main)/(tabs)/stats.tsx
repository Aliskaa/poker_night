import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, Text, Spinner, Theme, XStack } from 'tamagui';
import { useUser } from '@clerk/clerk-expo';
import { useUserLogic } from '@/hooks/useUserLogic';
import { PokerBackground } from '@/components/layouts/PokerBackground';
import { PerformanceStats, ProfitChart, LeaderboardList } from '@/components/features/stats';
import { Title } from '@/components/primitives/Layout';
import { TrendingUp } from '@tamagui/lucide-icons';

export default function StatsScreen() {
  const { user: currentUser } = useUser();
  const { currentUserStats: userData, leaderboard, loading } = useUserLogic();

  // Préparer les données pour le ProfitChart
  const profitData = React.useMemo(() => {
    // TODO: Récupérer l'historique réel depuis Firebase
    // Pour l'instant, données factices basées sur les stats
    if (!userData) return [];

    const mockData = [
      { date: '2024-01-01', profit: 0 },
      { date: '2024-01-08', profit: 50 },
      { date: '2024-01-15', profit: -20 },
      { date: '2024-01-22', profit: 150 },
      { date: '2024-01-29', profit: userData.netProfit || 0 },
    ];

    return mockData;
  }, [userData]);

  // Préparer les joueurs pour le leaderboard
  const leaderboardPlayers = React.useMemo(() => {
    return leaderboard.map((player) => ({
      id: player.id,
      name: player.name || 'Joueur',
      profit: player.netProfit || 0,
      gamesPlayed: player.gamesPlayed || 0,
      winRate: Math.round(((player.gamesWon || 0) / (player.gamesPlayed || 1)) * 100),
      rank: player.rank || 0,
    }));
  }, [leaderboard]);

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$pokerGreenDark">
        <Spinner size="large" color="$potGold" />
      </YStack>
    );
  }

  return (
    <Theme name="dark">
      <PokerBackground>
        <ScrollView>
          <YStack padding="$4" gap="$4" paddingTop="$12" paddingBottom="$10">
            {/* Header */}
            <YStack gap="$2" alignItems="center">
              <XStack alignItems="center" gap="$2">
                <TrendingUp size={32} color="$potGold" />
                <Title color="$potGold">Statistiques</Title>
              </XStack>
              <Text color="$colorMuted" fontSize="$3" textTransform="uppercase" letterSpacing={1}>
                Performances & Classement
              </Text>
            </YStack>

            {/* Performance Stats */}
            {userData && (
              <PerformanceStats
                totalProfit={userData.netProfit || 0}
                totalGames={userData.gamesPlayed || 0}
                winRate={userData.winRate || 0}
                roi={userData.roi || 0}
                avgPosition={userData.avgPosition || 0}
              />
            )}

            {/* Profit Chart */}
            {profitData.length > 0 && (
              <YStack>
                <ProfitChart
                  data={profitData}
                  period="30d"
                />
              </YStack>
            )}

            {/* Leaderboard */}
            {leaderboardPlayers.length > 0 && (
              <LeaderboardList
                players={leaderboardPlayers}
                currentUserId={currentUser?.id}
              />
            )}
          </YStack>
        </ScrollView>
      </PokerBackground>
    </Theme>
  );
}
