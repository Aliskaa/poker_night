import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Theme, YStack, Text, XStack, Button } from 'tamagui';
import { Search, Users, Palette } from '@tamagui/lucide-icons';

import { useActiveGames } from '@/hooks/useActiveGamesLogic';
import { ActiveGamesSlider } from '@/components/home/ActiveGamesSlider';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroPlayCard } from '@/components/home/HeroPlayCard';
import { PokerBackground } from '@/components/ui/PokerBackground'; // <-- Import du tapis
import { UIShowcase } from '@/components/ui/UIShowcase';

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
              <Text color="rgba(255,255,255,0.6)" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>
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
              <XStack gap="$3" marginTop="$2">
                <QuickAction 
                  icon={<Palette size={24} />} 
                  label="UI Showcase" 
                  subLabel="Voir composants" 
                  onPress={() => router.push('/(main)/showcase')} 
                />
              </XStack>
            </YStack>

          </YStack>
        </ScrollView>
      </PokerBackground>
    </Theme>
  );
}

// Boutons "Glassmorphism" (Transparents)
const QuickAction = ({ icon, label, subLabel, onPress }: any) => (
  <Button 
    flex={1} 
    height={110} 
    // Fond semi-transparent pour laisser voir le tapis
    backgroundColor="rgba(255, 255, 255, 0.05)" 
    borderColor="rgba(255, 255, 255, 0.1)" 
    borderWidth={1}
    flexDirection="column"
    alignItems="flex-start"
    justifyContent="space-between"
    padding="$4"
    onPress={onPress}
    pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
  >
    <YStack backgroundColor="rgba(0,0,0,0.3)" padding="$2" borderRadius="$3">
      {React.cloneElement(icon, { color: '#fbbf24' })}
    </YStack>
    <YStack>
        <Text color="white" fontWeight="bold" fontSize="$5">{label}</Text>
        <Text color="rgba(255,255,255,0.5)" fontSize="$2">{subLabel}</Text>
    </YStack>
  </Button>
);