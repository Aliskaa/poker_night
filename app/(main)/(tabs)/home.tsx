import { useUser } from '@/providers/AuthProvider';
import { Plus, Trophy, Users } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { Theme, XStack, YStack } from 'tamagui';

import { ActiveGamesSlider } from '@/components/home/ActiveGamesSlider';
import { CurrentStat } from '@/components/home/CurrentStat';
import { HeroPlayCard } from '@/components/home/HeroPlayCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { Heading } from '@/components/ui';
import { FAB } from '@/components/ui/FAB';
import { GlassCard } from '@/components/ui/GlassCard';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { useActiveGames } from '@/hooks/useActiveGamesLogic';
import { useUserLogic } from '@/hooks/useUserLogic';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { activeGames } = useActiveGames();
  const { currentUserStats } = useUserLogic();

  return (
    <Theme name="dark">
      <PokerBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          <YStack padding="$4" paddingTop="$8" gap="$6">

            {/* 1. HEADER */}
            <HomeHeader user={user} />

            {/* 2. QUICK STATS */}
            {currentUserStats && <CurrentStat currentUserStats={currentUserStats} />}

            {/* 3. RADAR (Parties en cours) */}
            <ActiveGamesSlider games={activeGames} />

            {/* 4. HERO ACTION */}
            <HeroPlayCard onPress={() => router.push('/(main)/create-game')} />

            {/* 5. ACTIONS SECONDAIRES */}
            <YStack gap="$3">
              <Heading size="md">Accès Rapide</Heading>
              <XStack gap="$3">
                <GlassCard
                  flex={1}
                  icon={<Users size={24} />}
                  title="Clubs"
                  subtitle="Gérer"
                  onPress={() => router.push('/(main)/(tabs)/groups')}
                />
                <GlassCard
                  flex={1}
                  icon={<Trophy size={24} />}
                  title="Stats"
                  subtitle="Voir"
                  onPress={() => router.push('/(main)/(tabs)/profile')}
                />
              </XStack>
            </YStack>

          </YStack>
        </ScrollView>

        {/* FAB flottant */}
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