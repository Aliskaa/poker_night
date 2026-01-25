import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button, Text, XStack, YStack, Sheet, H4 } from 'tamagui';
import { Play, LogIn, Settings2, AlertTriangle, Trash2 } from '@tamagui/lucide-icons';
import { Game } from '@/types/Game';
import { useUser } from '@clerk/clerk-expo';
import { useActiveGames } from '@/hooks/useActiveGamesLogic';

export function ActiveGamesSlider({ games }: { games: Game[] }) {
  const router = useRouter();
  const { user } = useUser();
  const { deleteActiveGame } = useActiveGames();
  const [isCleanUpOpen, setIsCleanUpOpen] = useState(false);

  if (games.length === 0) return null;

  const myHostedGames = games.filter(game => game.hostId === user?.id);

  const confirmDelete = (gameId: string) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette partie ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer", style: "destructive", onPress: async () => {
            await deleteActiveGame(gameId);
          }
        }
      ]
    );
  };

  return (
    <>
      <YStack gap="$2" marginTop="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$2">
            <Play size={16} color="$success" />
            <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
              En Direct ({games.length})
            </Text>
          </XStack>

          {/* BOUTON : OUVRE LE MENU DE NETTOYAGE */}
          {myHostedGames.length > 0 && (
            <Button size="$2" circular icon={<Settings2 size={16} />} backgroundColor="transparent" color="$colorMuted" onPress={() => setIsCleanUpOpen(true)} />
          )}
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

      <Sheet modal open={isCleanUpOpen} onOpenChange={setIsCleanUpOpen} snapPoints={[60]} dismissOnSnapToBottom>
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
          <H4 color="$color" textAlign="center">Mes parties en cours</H4>
          <Text color="$colorMuted" textAlign="center" marginBottom="$2">
            Supprime les parties abandonnées ou lancées par erreur.
          </Text>

          <ScrollView>
            <YStack gap="$3">
              {myHostedGames.map((game, index) => {
                // Calcul du temps écoulé depuis la création (Approximation)
                const startTime = (game.createdAt as any).seconds ? (game.createdAt as any).seconds * 1000 : Date.now();
                const hoursOld = Math.floor((Date.now() - startTime) / (1000 * 60 * 60));

                return (
                  <Card key={game.id || `ghost-${index}`} bordered backgroundColor="$backgroundStrong" borderColor="$borderColor">
                    <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                      <YStack>
                        <Text color="$color" fontWeight="bold">Pot : {game.totalPot}€</Text>
                        <Text color="$colorMuted" fontSize="$2">{game.players.length} joueurs • Créée il y a {hoursOld}h</Text>
                        {hoursOld > 12 && (
                          <XStack alignItems="center" gap="$1" marginTop="$1">
                            <AlertTriangle size={12} color="$warning" />
                            <Text color="$warning" fontSize="$1">Partie probablement abandonnée</Text>
                          </XStack>
                        )}
                      </YStack>
                      <Button size="$3" circular backgroundColor="$danger" icon={<Trash2 size={16} color="white" />} onPress={() => confirmDelete(game.id)} />
                    </Card.Header>
                  </Card>
                );
              })}
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>


    </>
  );
}