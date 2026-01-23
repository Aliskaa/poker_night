import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useGameLogic } from '@/hooks/useGameLogic';

// Composants Tamagui
import { ScrollView, YStack, XStack, Text, H1, H3, H4, Avatar, Button, Card, Spinner, Theme, Separator } from 'tamagui';
// Icônes
import { ChevronRight, PlayCircle, Plus, TrendingUp, Users, Crown, Shield } from '@tamagui/lucide-icons';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { createGame } = useGameLogic();
  
  const [isCreating, setIsCreating] = useState(false);
  const [userStats, setUserStats] = useState({
    netProfit: 0,
    gamesPlayed: 0,
  });

  // --- Écouteur des statistiques en temps réel ---
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.id);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists() && doc.data().statistics) {
        setUserStats(doc.data().statistics);
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Mock de partie en cours
  const activeGame = null;

  const handleCreateGame = async () => {
    setIsCreating(true);
    const newGameId = await createGame(5);
    setIsCreating(false);

    if (newGameId) {
      router.push(`/(main)/game/${newGameId}`);
    } else {
      alert("Impossible de créer la partie, vérifie ta connexion.");
    }
  };

  // Définition de la couleur de profit selon nos nouveaux tokens
  const isProfitable = userStats.netProfit >= 0;
  const profitColor = isProfitable ? "$success" : "$danger"; // $success = Vert, $danger = Rouge

  return (
    <Theme name="dark">
      <ScrollView style={{ flex: 1, backgroundColor: '#0b0f19' }}> {/* Correspond à notre $background */}
        <YStack padding="$4" paddingTop="$6" gap="$5">

          {/* 1. EN-TÊTE VIP */}
          <XStack alignItems="center" gap="$3">
            <Avatar circular size="$6" borderWidth={2} borderColor="$borderColor">
              <Avatar.Image src={user?.imageUrl} />
              <Avatar.Fallback backgroundColor="$accent" />
            </Avatar>
            <YStack flex={1}>
              <Text color="$colorMuted" fontSize="$3" letterSpacing={1} textTransform="uppercase">
                Bienvenue à la table
              </Text>
              <H3 color="$color" fontWeight="900" letterSpacing={-0.5}>
                {user?.firstName || user?.username || "Joueur"}
              </H3>
            </YStack>
          </XStack>

          {/* 2. ACTION PRINCIPALE : Lancer une partie */}
          {/* On utilise un fond "Card" sombre et on fait péter le bouton en "Pot Gold" ($primary) */}
          <Card bordered elevate size="$4" backgroundColor="$backgroundStrong" borderColor="$borderColor">
            <Card.Header padded>
              <XStack gap="$2" alignItems="center">
                <Crown size={20} color="$primary" />
                <H4 color="$color" fontWeight="bold">Soirée Poker</H4>
              </XStack>
              <Text color="$colorMuted" fontSize="$3" marginTop="$1">
                Crée une table, définis la mise et invite tes amis.
              </Text>
            </Card.Header>
            <Card.Footer padded>
              <Button
                flex={1}
                size="$4"
                icon={isCreating ? <Spinner color="$nightBase" /> : <Plus size={20} color="$nightBase" />}
                backgroundColor="$primary"
                color="$nightBase" 
                fontWeight="900"
                disabled={isCreating}
                onPress={handleCreateGame}
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
              >
                {isCreating ? "Distribution des cartes..." : "Ouvrir une table"}
              </Button>
            </Card.Footer>
          </Card>

          {/* Partie en cours (Affichage Conditionnel) */}
          {activeGame ? (
            <Card bordered padding="$3" backgroundColor="$success" borderColor="$success">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text fontWeight="900" fontSize="$5" color="white">Table du Vendredi</Text>
                  <Text color="rgba(255,255,255,0.8)" fontSize="$2">Pot: 45€ • 5 Joueurs</Text>
                </YStack>
                <Button circular size="$4" backgroundColor="white" icon={<PlayCircle size={24} color="$success" />} onPress={() => router.push(`/(main)/game/123`)} />
              </XStack>
            </Card>
          ) : null}

          {/* 3. SECTION STATS (La Bankroll) */}
          <YStack gap="$2">
            <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
              Ma Bankroll
            </Text>
            <XStack gap="$3">
              {/* Carte PROFIT */}
              <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong" borderColor="$borderColor">
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$2">
                    <TrendingUp size={16} color={isProfitable ? "#059669" : "#ef4444"} />
                    <Text color="$colorMuted" fontSize="$2" fontWeight="600">Profit Net</Text>
                  </XStack>
                  <H1 color={profitColor} fontSize="$8" fontWeight="900" letterSpacing={-1}>
                    {isProfitable ? "+" : ""}{userStats.netProfit}€
                  </H1>
                </YStack>
              </Card>

              {/* Carte PARTIES */}
              <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong" borderColor="$borderColor">
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$2">
                    <Shield size={16} color="$accent" />
                    <Text color="$colorMuted" fontSize="$2" fontWeight="600">Parties</Text>
                  </XStack>
                  <H1 color="$color" fontSize="$8" fontWeight="900" letterSpacing={-1}>
                    {userStats.gamesPlayed}
                  </H1>
                </YStack>
              </Card>
            </XStack>
          </YStack>

          <Separator borderColor="$borderColor" marginVertical="$2" />

          {/* 4. MENU DE NAVIGATION */}
          <YStack gap="$3">
            <MenuItem 
              icon={<Users />} 
              title="Mes Groupes" 
              subtitle="Gérer les joueurs et invités" 
              onPress={() => console.log('Naviguer vers groupes')} 
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

// Sous-composant Menu (Re-stylisé "Premium")
const MenuItem = ({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle: string, onPress: () => void }) => (
  <Card 
    bordered 
    backgroundColor="$backgroundStrong" 
    borderColor="$borderColor" 
    pressStyle={{ backgroundColor: '$backgroundHover', scale: 0.98 }}
    onPress={onPress}
  >
    <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
      <YStack backgroundColor="rgba(59, 130, 246, 0.1)" padding="$2" borderRadius="$3">
        {React.cloneElement(icon, { size: 20, color: '#3b82f6' })}
      </YStack>
      <YStack flex={1}>
        <Text color="$color" fontSize="$4" fontWeight="bold">{title}</Text>
        <Text color="$colorMuted" fontSize="$2">{subtitle}</Text>
      </YStack>
      <ChevronRight size={20} color="$colorMuted" />
    </Card.Header>
  </Card>
);