import { useUser } from '@clerk/clerk-expo';
import { Search, Users } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { Text, Theme, XStack, YStack } from 'tamagui';

import { ActiveGamesSlider } from '@/components/home/ActiveGamesSlider';
import { HeroPlayCard } from '@/components/home/HeroPlayCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { QuickAction } from '@/components/home/QuickAction';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { useActiveGames } from '@/hooks/useActiveGamesLogic';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { activeGames } = useActiveGames();

  return (
    <Theme name="dark">
      {/* ON ENGLOBE TOUT DANS LE TAPIS VERT */}
      <PokerBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          <YStack padding="$4" paddingTop="$8" gap="$6">

            {/* 1. HEADER */}
            <HomeHeader user={user} />

            {/* 2. RADAR (Parties en cours) */}
            <ActiveGamesSlider games={activeGames} />

            {/* 3. HERO ACTION : LA CARTE GOLD AVEC LE PIQUE ♠️ */}
            {/* Elle va ressortir magnifiquement sur le fond vert foncé */}
            <HeroPlayCard onPress={() => router.push('/(main)/create-game')} />

            {/* 4. ACTIONS SECONDAIRES (Style Verre Fumé) */}
            <YStack gap="$3">
              <Text color="$textSecondary" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>
                Accès Rapide
              </Text>
              <XStack gap="$3">
                <QuickAction 
                  icon={<Search size={24} />} 
                  label="Rejoindre" 
                  subLabel="Code PIN" 
                  onPress={() => router.push('/(main)/(tabs)/groups')} 
                />
                <QuickAction 
                  icon={<Users size={24} />} 
                  label="Mes Clubs" 
                  subLabel="Gérer" 
                  onPress={() => router.push('/(main)/(tabs)/groups')} 
                />
              </XStack>
            </YStack>

          </YStack>
        </ScrollView>
      </PokerBackground>
    </Theme>
  );
}