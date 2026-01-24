import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button, Text, XStack, YStack } from 'tamagui';
import { Play, LogIn } from '@tamagui/lucide-icons';
import { Game } from '@/types/Game';

export function ActiveGamesSlider({ games }: { games: Game[] }) {
  const router = useRouter();

  if (games.length === 0) return null;

  return (
    <YStack gap="$2" marginTop="$2">
      <XStack alignItems="center" gap="$2">
        <Play size={16} color="$success" />
        <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
          En Direct ({games.length})
        </Text>
      </XStack>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {games.map((game, index) => (
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
                  disabled={!game.id}
                  opacity={game.id ? 1 : 0.5}
                  onPress={() => router.push(`/(main)/game/${game.id}`)}
                />
              </XStack>
            </Card.Header>
          </Card>
        ))}
      </ScrollView>
    </YStack>
  );
}