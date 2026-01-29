import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Theme, YStack, Text, XStack } from 'tamagui';
import { Search, Users, Plus, TrendingUp, Trophy, Target } from '@tamagui/lucide-icons';

import { useActiveGames } from '@/hooks/useActiveGamesLogic';
import { useUserLogic } from '@/hooks/useUserLogic';
import { ActiveGamesSlider } from '@/components/home/ActiveGamesSlider';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroPlayCard } from '@/components/home/HeroPlayCard';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { FAB } from '@/components/ui/FAB';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChipStack } from '@/components/ui/ChipStack';
import { CurrentStat } from '@/components/home/CurrentStat';

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
              <Text color="$text60" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>
                Accès Rapide
              </Text>
              <XStack gap="$3">
                <GlassCard
                  flex={1}
                  icon={<Search size={24} />}
                  title="Rejoindre"
                  subtitle="Code PIN"
                  onPress={() => router.push('/(main)/(tabs)/groups')}
                />
                <GlassCard
                  flex={1}
                  icon={<Users size={24} />}
                  title="Mes Clubs"
                  subtitle="Gérer"
                  onPress={() => router.push('/(main)/(tabs)/groups')}
                />
              </XStack>
              <GlassCard
                icon={<TrendingUp size={24} />}
                title="Classement"
                subtitle="Voir ta progression"
                onPress={() => router.push('/(main)/(tabs)/leaderboard')}
              />
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