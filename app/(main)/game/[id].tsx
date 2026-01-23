import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { YStack, XStack, Text, H1, H4, Button, Avatar, Card, Separator, Spinner, Input, Theme } from 'tamagui';
import { Trophy, Coins, UserX, Plus, UserPlus, Share as ShareIcon } from '@tamagui/lucide-icons';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Player } from '@/types/Player';
import { useUser } from '@clerk/clerk-expo';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { game, loading, addRebuy, eliminatePlayer, addGuestPlayer, endGame, joinGame } = useGameLogic(id);
  const [newGuestName, setNewGuestName] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (game && user) {
      joinGame();
    }
  }, [game?.id, user?.id]);

  const onShareTable = async () => {
    const url = Linking.createURL(`/(main)/game/${id}`, { scheme: 'pokernight' });

    try {
      await Share.share({
        message: `♠️ Viens jouer au Poker ! La table est ouverte. \nBuy-in: ${String(game?.config.defaultBuyIn)}€ \n\nClique ici pour rejoindre : ${url}`,
      });
    } catch (error) {
      console.error("Erreur lors du partage du lien de la table :", error);
    }
  }

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text marginTop="$2">Préparation de la table...</Text>
      </YStack>
    );
  }

  if (!game) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Text color="$red10">Partie introuvable ou supprimée.</Text>
      </YStack>
    );
  }

  const activePlayers = game.players.filter(p => p.status === 'ACTIVE');
  const isHeadsUpFinished = activePlayers.length <= 1 && game.players.length > 1;

  const sortedPlayers = [...game.players].sort((a, b) => {
    if (a.status === 'ACTIVE' && b.status === 'ELIMINATED') return -1;
    if (a.status === 'ELIMINATED' && b.status === 'ACTIVE') return 1;
    if (a.finalRank && b.finalRank) return a.finalRank - b.finalRank;
    return 0;
  });

  // RENDU : Partie Terminée (PODIUM)
  if (game.status === 'FINISHED') {
    // On trie par rang final
    const finalRankings = [...game.players].sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

    return (
      <Theme name="dark">
        <YStack flex={1} backgroundColor="$background" padding="$4" paddingTop="$10" space="$4">
          <YStack alignItems="center" marginVertical="$6">
            <Trophy size={60} color="#fbbf24" />
            <H1 color="$color" marginTop="$2">Résultats</H1>
            <Text color="$gray11">Le pot final était de {String(game.totalPot)}€</Text>
          </YStack>

          <ScrollView>
            <YStack space="$3">
              {finalRankings.map((player) => {
                // Définition des couleurs du podium
                const isWinner = player.finalRank === 1;
                const isSecond = player.finalRank === 2;
                const isThird = player.finalRank === 3;
                const profit = (player.payout || 0) - player.totalInvested;

                return (
                  <Card
                    key={player.id}
                    bordered
                    backgroundColor={isWinner ? "$yellow3" : isSecond ? "$gray4" : isThird ? "$orange3" : "$backgroundStrong"}
                    borderColor={isWinner ? "$yellow8" : isSecond ? "$gray8" : isThird ? "$orange8" : "$borderColor"}
                  >
                    <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                      <XStack space="$3" alignItems="center">
                        <Text fontWeight="900" fontSize="$6" color={isWinner ? "$yellow11" : "$gray11"}>
                          #{String(player.finalRank)}
                        </Text>
                        <YStack>
                          <H4 color="$color">{player.name}</H4>
                          <Text color={profit >= 0 ? "$green10" : "$red10"} fontWeight="bold">
                            {profit >= 0 ? "+" : ""}{String(profit)}€ de profit
                          </Text>
                        </YStack>
                      </XStack>
                      <YStack alignItems="flex-end">
                        <Text color="$color" fontWeight="bold" fontSize="$5">Gains: {String(player.payout)}€</Text>
                        <Text color="$gray11" fontSize="$2">Misé: {String(player.totalInvested)}€</Text>
                      </YStack>
                    </Card.Header>
                  </Card>
                );
              })}
            </YStack>
          </ScrollView>

          <Button
            backgroundColor="$blue10"
            color="white"
            size="$5"
            onPress={() => router.replace('/(main)/home')}
          >
            Retour au Dashboard
          </Button>
        </YStack>
      </Theme>
    );
  };

  // RENDU : Partie en cours
  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        <YStack alignItems="center" paddingBottom="$6" paddingTop="$4" position="relative">
          <Button 
            position="absolute" 
            top="$2" 
            right="$4" 
            size="$3" 
            circular 
            icon={<ShareIcon size={18} />} 
            backgroundColor="$gray4"
            onPress={onShareTable}
          />
          <Text color="$gray11" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={1}>
            Pot Total
          </Text>
          <XStack alignItems="center" space="$2">
            <Coins size={40} color="#fbbf24" />
            <H1 fontSize="$10" color="$color" fontWeight="900">
              {String(game.totalPot)} €
            </H1>
          </XStack>
          <Text color="$gray10" fontSize="$2" marginTop="$2">
            Buy-in standard : {String(game.config.defaultBuyIn)}€
          </Text>
        </YStack>

        {isHeadsUpFinished && (
          <Button
            marginHorizontal="$4"
            backgroundColor="$green10"
            color="white"
            icon={<Trophy size={18} />}
            onPress={endGame}
          >
            Terminer et voir les gains
          </Button>
        )}

        <Separator borderColor="$gray5" />

        <ScrollView style={{ flex: 1 }}>
          <YStack padding="$4" space="$3">
            <Text color="$gray11" fontWeight="bold">
              Joueurs ({String(game.players.length)})
            </Text>

            {sortedPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                defaultBuyIn={game.config.defaultBuyIn}
                onRebuy={() => addRebuy(player.id, game.config.defaultBuyIn)}
                onEliminate={() => eliminatePlayer(player.id)}
              />
            ))}
          </YStack>
        </ScrollView>

        <YStack padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
          <Text color="$gray11" fontSize="$2" marginBottom="$2">
            Ajouter un invité à la table :
          </Text>
          <XStack space="$2">
            <Input
              flex={1}
              placeholder="Prénom..."
              value={newGuestName}
              onChangeText={setNewGuestName}
            />
            <Button
              icon={<UserPlus size={18} />}
              backgroundColor="$blue10"
              color="white"
              disabled={!newGuestName}
              onPress={() => {
                addGuestPlayer(newGuestName, game.config.defaultBuyIn);
                setNewGuestName('');
              }}
            >
              Ajouter
            </Button>
          </XStack>
        </YStack>

      </YStack>
    </Theme>
  );
}

function PlayerCard({
  player,
  defaultBuyIn,
  onRebuy,
  onEliminate
}: {
  player: Player,
  defaultBuyIn: number,
  onRebuy: () => void,
  onEliminate: () => void
}) {
  const isEliminated = player.status === 'ELIMINATED';

  return (
    <Card
      bordered
      backgroundColor={isEliminated ? "$gray3" : "$backgroundStrong"}
      borderColor={isEliminated ? "$gray5" : "$borderColor"}
      opacity={isEliminated ? 0.7 : 1}
    >
      <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">

        <XStack space="$3" alignItems="center" flex={1}>
          <Avatar circular size="$4">
            <Avatar.Fallback backgroundColor={isEliminated ? "$gray8" : "$green10"} />
          </Avatar>
          <YStack>
            <H4 color={isEliminated ? "$gray11" : "$color"} textDecorationLine={isEliminated ? 'line-through' : 'none'}>
              {player.name}
            </H4>
            <Text color="$gray11" fontSize="$2">
              Misé : {String(player.totalInvested)}€ ({String(player.buyInCount)} caves)
            </Text>
          </YStack>
        </XStack>

        {isEliminated ? (
          <XStack alignItems="center" space="$1">
            <Trophy size={16} color="$gray11" />
            <Text color="$gray11" fontWeight="bold">
              Rang {String(player.finalRank)}
            </Text>
          </XStack>
        ) : (
          <XStack space="$2">
            <Button
              size="$3"
              circular
              icon={<Plus size={16} />}
              backgroundColor="$green8"
              onPress={onRebuy}
            />
            <Button
              size="$3"
              circular
              icon={<UserX size={16} />}
              backgroundColor="$red8"
              onPress={onEliminate}
            />
          </XStack>
        )}
      </Card.Header>
    </Card>
  );
}