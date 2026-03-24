import { useUserLogic } from '@/hooks/useUserLogic';
import { useUser } from '@/providers/AuthProvider';
import { Award, Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { Platform, ScrollView } from 'react-native';
import { H1, Spinner, Text, Theme, YStack } from 'tamagui';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { FAB } from '@/components/ui/FAB';
import { PlayerRankingItem } from '@/components/ui/PlayerRankingItem';
import { useRouter } from 'expo-router';

export default function LeaderboardScreen() {
  const { user: currentUser } = useUser();
  const { leaderboard: players, loading: loadingUsers } = useUserLogic();
  const router = useRouter();
  const topSpacing = Platform.OS === 'web' ? '$6' : '$10';
  const fabOffset = Platform.OS === 'web' ? 78 : 70;

  const globalRankings = players.map((u, index) => ({
    rank: index + 1,
    userId: u.id,
    name: u.name,
    avatarUrl: u.avatarUrl,
    gamesPlayed: u.gamesPlayed,
    netProfit: u.netProfit,
    roi: u.totalBuyins > 0 ? (u.netProfit / u.totalBuyins) * 100 : 0,
    wins: u.wins,
  }));

  if (loadingUsers) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop={topSpacing}>

          <YStack alignItems="center" marginBottom="$4" paddingHorizontal="$4">
            <Award size={56} color="$primary" />
            <H1 color="$primary" marginTop="$2" fontWeight="900" letterSpacing={-1}>
              Classement
            </H1>
            <Text color="$text60" letterSpacing={1} textTransform="uppercase" fontSize="$3">
              Les meilleurs joueurs
            </Text>
          </YStack>

          <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$3" paddingBottom="$20">
              {globalRankings.map((player) => (
                <PlayerRankingItem
                  key={player.userId}
                  rank={player.rank}
                  userId={player.userId}
                  name={player.name}
                  avatarUrl={player.avatarUrl}
                  gamesPlayed={player.gamesPlayed}
                  netProfit={player.netProfit}
                  roi={player.roi}
                  wins={player.wins}
                  isCurrentUser={player.userId === currentUser?.id}
                />
              ))}
            </YStack>
          </ScrollView>
        </YStack>
        
        {/* FAB flottant pour créer une partie */}
        <FAB 
          icon={<Plus size={28} color="$night900" />}
          fabPosition="bottom-right"
          offset={fabOffset}
          onPress={() => router.push('/(main)/create-game')}
        />
      </PokerBackground>
    </Theme>
  );
}