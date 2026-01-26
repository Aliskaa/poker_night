import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Theme, YStack, XStack, Text, H2, Button, Card, Separator } from 'tamagui';
import { Play, Plus, Search, Users } from '@tamagui/lucide-icons';

import { useActiveGames } from '@/hooks/useActiveGamesLogic';
import { ActiveGamesSlider } from '@/components/home/ActiveGamesSlider';
import { HomeHeader } from '@/components/home/HomeHeader';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { activeGames } = useActiveGames();

  // Salutation dynamique selon l'heure
  const hour = new Date().getHours();
  const greeting = hour < 18 ? "Bonjour" : "Bonsoir";

  return (
    <Theme name="dark">
      <ScrollView style={{ flex: 1, backgroundColor: '#0b0f19' }}>
        <YStack padding="$4" paddingTop="$8" gap="$6">

          {/* 1. HEADER MINIMALISTE (Juste le prénom) */}
          <HomeHeader user={user} />

          {/* 2. LE RADAR (Parties en cours) - C'est la star de la page */}
          <YStack>
             {/* Le composant gère lui-même son affichage si vide */}
            <ActiveGamesSlider games={activeGames} />
          </YStack>

          {/* 3. HERO ACTION : GROS BOUTON "OUVRIR UNE TABLE" */}
          {/* On le met en avant avec une couleur accentuée */}
          <Card 
            bordered 
            backgroundColor="$potGold" 
            borderColor="$potGold"
            pressStyle={{ scale: 0.98, opacity: 0.9 }}
            onPress={() => router.push('/(main)/create-game')}
            elevation={10}
            shadowColor="$potGold"
            shadowOpacity={0.4}
            shadowRadius={20}
          >
            <Card.Header padded>
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <H2 color="$nightBase" fontWeight="900">JOUER</H2>
                  <Text color="$nightBase" opacity={0.8} fontWeight="600">Lancer une nouvelle table</Text>
                </YStack>
                <YStack backgroundColor="$nightBase" padding="$3" borderRadius="$10">
                  <Play size={28} color="$potGold" fill="$potGold" />
                </YStack>
              </XStack>
            </Card.Header>
          </Card>

          {/* 4. ACTIONS SECONDAIRES (Grille 2x2) */}
          <YStack gap="$3">
            <Text color="$colorMuted" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>
              Raccourcis
            </Text>
            <XStack gap="$3">
              <QuickAction 
                icon={<Search size={20} />} 
                label="Rejoindre" 
                subLabel="Via Code" 
                onPress={() => router.push('/(main)/groups')} // Ou une modal "Join"
              />
              <QuickAction 
                icon={<Users size={20} />} 
                label="Mes Clubs" 
                subLabel="Gérer" 
                onPress={() => router.push('/(main)/groups')} 
              />
            </XStack>
          </YStack>

        </YStack>
      </ScrollView>
    </Theme>
  );
}

// Petit composant local pour les boutons carrés
const QuickAction = ({ icon, label, subLabel, onPress }: any) => (
  <Button 
    flex={1} 
    height={100} 
    backgroundColor="$backgroundStrong" 
    borderColor="$borderColor" 
    borderWidth={1}
    flexDirection="column"
    alignItems="flex-start"
    justifyContent="center"
    padding="$3"
    gap="$1"
    onPress={onPress}
  >
    <YStack backgroundColor="rgba(255,255,255,0.05)" padding="$2" borderRadius="$3" marginBottom="$2">
      {React.cloneElement(icon, { color: '#fbbf24' })}
    </YStack>
    <Text color="$color" fontWeight="bold" fontSize="$4">{label}</Text>
    <Text color="$colorMuted" fontSize="$2">{subLabel}</Text>
  </Button>
);