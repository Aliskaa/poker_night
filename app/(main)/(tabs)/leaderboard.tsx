import { useUserLogic } from '@/hooks/useUserLogic';
import { useUser } from '@clerk/clerk-expo';
import { Medal, Minus, TrendingDown, TrendingUp, Trophy, Plus, Award } from '@tamagui/lucide-icons';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Card, H1, H4, Spinner, Text, Theme, XStack, YStack, Tabs } from 'tamagui';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { FAB } from '@/components/ui/FAB';
import { PlayerRankingItem } from '@/components/ui/PlayerRankingItem';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Game } from '@/types/Game';
import { getGroupRankings } from '@/utils/statsHelpers';

export default function LeaderboardScreen() {
  const { user: currentUser } = useUser();
  const { leaderboard: players, loading: loadingUsers } = useUserLogic();
  const router = useRouter();
  
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('global');

  // Charger tous les jeux terminés
  useEffect(() => {
    const loadGames = async () => {
      try {
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef, where('status', '==', 'FINISHED'));
        const snapshot = await getDocs(q);
        const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
        setAllGames(games);
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  // Calculer le classement global
  const globalRankings = players.map((player, index) => ({
    rank: index + 1,
    userId: player.id,
    name: player.name,
    avatarUrl: player.avatarUrl,
    gamesPlayed: player.gamesPlayed,
    netProfit: player.netProfit,
    roi: ((player.totalWinnings - player.totalInvested) / (player.totalInvested || 1)) * 100,
    wins: player.wins,
  }));

  if (loading || loadingUsers) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">

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
          offset={70}
          onPress={() => router.push('/(main)/create-game')}
        />
      </PokerBackground>
    </Theme>
  );
}