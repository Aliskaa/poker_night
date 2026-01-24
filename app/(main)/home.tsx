import { useActiveGames } from '@/hooks/useActiveGames';
import { useUserLogic } from '@/hooks/useUserLogic';
import { useUser } from '@clerk/clerk-expo';
import { ChevronRight, Crown, LogIn, Play, Plus, Shield, TrendingUp, Users } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Avatar, Button, Card, H1, H3, H4, ScrollView, Separator, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { currentUserStats } = useUserLogic();
  const { activeGames } = useActiveGames();


  const handleCreateGame = () => {
    router.push('/(main)/create-game'); // On navigue simplement vers le nouvel écran !
  };

  const isProfitable = currentUserStats.netProfit >= 0;
  const profitColor = isProfitable ? "$success" : "$danger";

  return (
    <Theme name="dark">
      <ScrollView style={{ flex: 1, backgroundColor: '#0b0f19' }}>
        <YStack padding="$4" paddingTop="$6" gap="$5">

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

          <Card bordered elevate size="$4" backgroundColor="$backgroundStrong" borderColor="$borderColor">
            <Card.Header padded>
              <XStack gap="$2" alignItems="center">
                <Crown size={20} color="$potGold" />
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
                icon={<Plus size={20} color="$nightBase" />}
                backgroundColor="$potGold"
                color="$nightBase"
                fontWeight="900"
                onPress={handleCreateGame}
              >
                Ouvrir une table
              </Button>
            </Card.Footer>
          </Card>

          {/* CORRECTION DU BUG ICI : Utilisation de la condition ternaire ? : null */}
          {activeGames.length > 0 ? (
            <YStack gap="$2" marginTop="$2">
              <XStack alignItems="center" gap="$2">
                <Play size={16} color="$success" />
                <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
                  En Direct ({String(activeGames.length)})
                </Text>
              </XStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {activeGames.map((game, index) => (
                  <Card key={game.id || `game-${index}`} bordered width={280} backgroundColor="rgba(5, 150, 105, 0.1)" borderColor="$success">
                    <Card.Header padded>
                      <XStack justifyContent="space-between" alignItems="center">
                        <YStack>
                          <Text color="$success" fontWeight="900" fontSize="$5">Pot: {String(game.totalPot)}€</Text>
                          <Text color="$colorMuted" fontSize="$3">{String(game.players.length)} joueurs à la table</Text>
                        </YStack>
                        <Button
                          circular
                          size="$4"
                          backgroundColor="$success"
                          icon={<LogIn size={18} color="white" />}
                          // On désactive le bouton si l'ID est vide (les parties bugguées)
                          disabled={!game.id}
                          opacity={game.id ? 1 : 0.5}
                          onPress={() => {
                            // Syntaxe directe et infaillible
                            router.push(`/(main)/game/${game.id}`);
                          }}
                        />
                      </XStack>
                    </Card.Header>
                  </Card>
                ))}
              </ScrollView>
            </YStack>
          ) : null}

          <YStack gap="$2" marginTop={activeGames.length > 0 ? 0 : "$2"}>
            <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
              Ma Bankroll
            </Text>
            <XStack gap="$3">
              <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong" borderColor="$borderColor">
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$2">
                    <TrendingUp size={16} color={isProfitable ? "#059669" : "#ef4444"} />
                    <Text color="$colorMuted" fontSize="$2" fontWeight="600">Profit Net</Text>
                  </XStack>
                  <H1 color={profitColor} fontSize="$8" fontWeight="900" letterSpacing={-1}>
                    {isProfitable ? "+" : ""}{String(currentUserStats.netProfit)}€
                  </H1>
                </YStack>
              </Card>

              <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong" borderColor="$borderColor">
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$2">
                    <Shield size={16} color="$accent" />
                    <Text color="$colorMuted" fontSize="$2" fontWeight="600">Parties</Text>
                  </XStack>
                  <H1 color="$color" fontSize="$8" fontWeight="900" letterSpacing={-1}>
                    {String(currentUserStats.gamesPlayed)}
                  </H1>
                </YStack>
              </Card>
            </XStack>
          </YStack>

          <Separator borderColor="$borderColor" marginVertical="$2" />

          <YStack gap="$3" paddingBottom="$8">
            <MenuItem icon={<Users />} title="Mes Clubs" subtitle="Rejoins ou crée ton QG de poker" onPress={() => router.push('/(main)/groups')} />
            <MenuItem icon={<TrendingUp />} title="Classement Général" subtitle="Qui est le Shark de la bande ?" onPress={() => router.push('/(main)/leaderboard')} />
          </YStack>

        </YStack>
      </ScrollView>
    </Theme>
  );
}

const MenuItem = ({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle: string, onPress: () => void }) => (
  <Card bordered backgroundColor="$backgroundStrong" borderColor="$borderColor" pressStyle={{ backgroundColor: '$backgroundHover', scale: 0.98 }} onPress={onPress}>
    <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
      <YStack backgroundColor="rgba(59, 130, 246, 0.1)" padding="$2" borderRadius="$3">
        {React.cloneElement(icon, { size: 20, color: '#3b82f6' })}r
      </YStack>
      <YStack flex={1}>
        <Text color="$color" fontSize="$4" fontWeight="bold">{title}</Text>
        <Text color="$colorMuted" fontSize="$2">{subtitle}</Text>
      </YStack>
      <ChevronRight size={20} color="$colorMuted" />
    </Card.Header>
  </Card>
);