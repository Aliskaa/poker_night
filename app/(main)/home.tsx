import { useUser } from '@clerk/clerk-expo';
import { TrendingUp, Users } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { Separator, Theme, YStack } from 'tamagui';

import { useActiveGames } from '@/hooks/useActiveGamesLogic';
import { useUserLogic } from '@/hooks/useUserLogic';

// Import des nouveaux sous-composants
import { ActiveGamesSlider } from '@/components/home/ActiveGamesSlider';
import { BankrollStats } from '@/components/home/BankrollStats';
import { CreateGameCard } from '@/components/home/CreateGameCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { MenuItem } from '@/components/home/MenuItem';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { currentUserStats } = useUserLogic();
  const { activeGames } = useActiveGames();

  return (
    <Theme name="dark">
      <ScrollView style={{ flex: 1, backgroundColor: '#0b0f19' }}>
        <YStack padding="$4" paddingTop="$6" gap="$5">

          <HomeHeader user={user} />

          <CreateGameCard onPress={() => router.push('/(main)/create-game')} />

          <ActiveGamesSlider games={activeGames} />

          <BankrollStats stats={currentUserStats} />

          <Separator borderColor="$borderColor" marginVertical="$2" />

          <YStack gap="$3" paddingBottom="$8">
            <MenuItem 
              icon={<Users />} 
              title="Mes Clubs" 
              subtitle="Rejoins ou crée ton QG de poker" 
              onPress={() => router.push('/(main)/groups')} 
            />
            <MenuItem 
              icon={<TrendingUp />} 
              title="Classement Général" 
              subtitle="Qui est le Shark de la bande ?" 
              onPress={() => router.push('/(main)/leaderboard')} 
            />
          </YStack>

        </YStack>
      </ScrollView>
    </Theme>
  );
}