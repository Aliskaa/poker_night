import { useActiveGames } from '@/hooks/useActiveGamesLogic';
import { Game } from '@/types/Game';
import { useUser } from '@/providers/AuthProvider';
import { AlertTriangle, Play, Settings2, Trash2, PlusCircle } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, H4, Sheet, Text, XStack, YStack } from 'tamagui';
import { Heading, IconButton, PokerButton } from '../ui';

export function ActiveGamesSlider({ games }: { games: Game[] }) {
  const router = useRouter();
  const { user } = useUser();
  const { deleteActiveGame } = useActiveGames();
  const [isCleanUpOpen, setIsCleanUpOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [deletingGameId, setDeletingGameId] = useState<string | null>(null);

  if (games.length === 0) {
    return (
      <YStack
        gap="$3"
        marginTop="$2"
        padding="$4"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$glass4"
        backgroundColor="$glass2"
      >
        <XStack gap="$2" alignItems="center">
          <PlusCircle size={18} color="$primary" />
          <Text color="$colorPrimary" fontWeight="700">
            Aucune table en direct
          </Text>
        </XStack>
        <Text color="$colorMuted">
          Lance la premiere donne pour ton groupe.
        </Text>
      </YStack>
    );
  }

  const myHostedGames = games.filter(game => game.hostId === user?.id);

  const confirmDelete = (game: Game) => {
    setGameToDelete(game);
  };

  const handleDeleteConfirmed = async () => {
    if (!gameToDelete?.id) return;
    setDeletingGameId(gameToDelete.id);
    try {
      await deleteActiveGame(gameToDelete.id);
      setGameToDelete(null);
    } finally {
      setDeletingGameId(null);
    }
  };

  return (
    <>
      <YStack gap="$2" marginTop="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$2">
            <Play size="$6" color="$success" />
            <Heading size="md">En Direct ({games.length})</Heading>
          </XStack>

          {/* BOUTON : OUVRE LE MENU DE NETTOYAGE */}
          {myHostedGames.length > 0 && (
            <Button size="$6" circular icon={<Settings2 size="$6" />} backgroundColor="transparent" color="$colorMuted" onPress={() => setIsCleanUpOpen(true)} />
          )}
        </XStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {games.map((game, index) => (
            <PokerButton
              key={index}
              flex={1}
              variant="success"
              icon={<Play />}
              title={`Pot: ${game.totalPot}€ • ${game.metadata?.playerCount} joueurs`}
              subtitle={"Rejoindre la partie"}
              onPress={() => router.push(`/(main)/game/${game.id}`)}
            />
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
                        <Text color="$colorMuted" fontSize="$2">{game.metadata?.playerCount} joueurs • Créée il y a {hoursOld}h</Text>
                        {hoursOld > 12 && (
                          <XStack alignItems="center" gap="$1" marginTop="$1">
                            <AlertTriangle size={12} color="$warning" />
                            <Text color="$warning" fontSize="$1">Partie probablement abandonnée</Text>
                          </XStack>
                        )}
                      </YStack>
                      <IconButton
                        icon={<Trash2 size={20} />}
                        backgroundColor="$danger"
                        color="$backgroundStrong"
                        onPress={() => confirmDelete(game)}
                        disabled={deletingGameId === game.id}
                        size="large"
                      />
                    </Card.Header>
                  </Card>
                );
              })}
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>

      <Sheet
        modal
        open={!!gameToDelete}
        onOpenChange={(open) => {
          if (!open && !deletingGameId) setGameToDelete(null);
        }}
        snapPoints={[36]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
          <YStack gap="$2">
            <H4 color="$color">Supprimer la partie ?</H4>
            <Text color="$colorMuted">
              Cette action est irreversible. La table et ses donnees en cours seront perdues.
            </Text>
          </YStack>

          <XStack gap="$3">
            <PokerButton
              variant="secondary"
              icon={<Settings2 size={16} />}
              title="Annuler"
              flex={1}
              onPress={() => setGameToDelete(null)}
              disabled={!!deletingGameId}
            />
            <PokerButton
              variant="danger"
              icon={<Trash2 size={16} />}
              title={deletingGameId ? 'Suppression...' : 'Supprimer'}
              flex={1}
              onPress={handleDeleteConfirmed}
              disabled={!!deletingGameId}
            />
          </XStack>
        </Sheet.Frame>
      </Sheet>


    </>
  );
}