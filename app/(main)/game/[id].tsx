import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { YStack, XStack, Text, H1, H3, H4, Button, Avatar, Card, Separator, Spinner, Input, Theme, Sheet } from 'tamagui';
import { Trophy, Coins, UserX, Plus, UserPlus, Share as ShareIcon, HelpCircle, RotateCcw, Pause, Play, AlertTriangle, Lock, Infinity, Timer, ChevronLeft } from '@tamagui/lucide-icons';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Player } from '@/types/Player';
import { useUser } from '@clerk/clerk-expo';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { game, loading, addRebuy, eliminatePlayer, addGuestPlayer, endGame, joinGame, isLateRegOpen } = useGameLogic(id);
  const [newGuestName, setNewGuestName] = useState('');
  const { user } = useUser();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const DEFAULT_TIME = 1200;
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lateRegSeconds, setLateRegSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (game && user) {
      joinGame();
    }
  }, [game?.id, user?.id]);

  // Logique : Timer des Blindes (Bottom Sheet)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Logique : Chrono du Late Reg
  useEffect(() => {
    if (!game || game.config.lateRegLimit === 0) return;

    // Calculer la date de fin en fonction de la création de la partie
    let startTime = Date.now();
    if (game.createdAt) {
      if (typeof (game.createdAt as any).toDate === 'function') startTime = (game.createdAt as any).toDate().getTime();
      else if ((game.createdAt as any).seconds) startTime = (game.createdAt as any).seconds * 1000;
      else if (game.createdAt instanceof Date) startTime = game.createdAt.getTime();
    }

    const endTime = startTime + (game.config.lateRegLimit * 60 * 1000);

    // Mettre à jour le chrono toutes les secondes
    const interval = setInterval(() => {
      const now = Date.now();
      const diffInSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
      setLateRegSeconds(diffInSeconds);

      // Si le temps est écoulé, on arrête l'intervalle
      if (diffInSeconds <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.createdAt, game?.config.lateRegLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  const onShareTable = async () => {
    const url = Linking.createURL(`/(main)/game/${id}`, { scheme: 'pokernight' });
    try {
      await Share.share({
        message: `♠️ Viens jouer au Poker ! La table est ouverte. \nBuy-in: ${String(game?.config.defaultBuyIn)}€ \n\nClique ici pour rejoindre : ${url}`,
      });
    } catch (error) {
      console.error("Erreur partage :", error);
    }
  }

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$potGold" />
        <Text color="$colorMuted" marginTop="$2">Mise en place de la table...</Text>
      </YStack>
    );
  }

  if (!game) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <AlertTriangle size={48} color="$danger" />
        <Text color="$danger" fontWeight="bold" marginTop="$2">Partie introuvable</Text>
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

  // ---------------------------------------------------------------------------
  // RENDU : PODIUM (Partie Terminée)
  // ---------------------------------------------------------------------------
  if (game.status === 'FINISHED') {
    const finalRankings = [...game.players].sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

    return (
      <Theme name="dark">
        <YStack flex={1} backgroundColor="$background" padding="$4" paddingTop="$10" gap="$4">
          <YStack alignItems="center" marginVertical="$6">
            <Trophy size={64} color="$potGold" />
            <H1 color="$potGold" marginTop="$2" fontWeight="900">Résultats</H1>
            <Text color="$colorMuted" fontSize="$4">Pot final: {String(game.totalPot)}€</Text>
          </YStack>

          <ScrollView>
            <YStack gap="$3">
              {finalRankings.map((player) => {
                const isWinner = player.finalRank === 1;
                const profit = (player.payout || 0) - player.totalInvested;
                const profitColor = profit >= 0 ? "$success" : "$danger";

                return (
                  <Card
                    key={player.id}
                    bordered
                    backgroundColor={isWinner ? "rgba(251, 191, 36, 0.1)" : "$backgroundStrong"}
                    borderColor={isWinner ? "$potGold" : "$borderColor"}
                  >
                    <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                      <XStack gap="$3" alignItems="center">
                        <H3 fontWeight="900" color={isWinner ? "$potGold" : "$colorMuted"}>
                          #{String(player.finalRank)}
                        </H3>
                        <YStack>
                          <H4 color="$color">{player.name}</H4>
                          <Text color={profitColor} fontWeight="bold">
                            {profit >= 0 ? "+" : ""}{String(profit)}€ profit
                          </Text>
                        </YStack>
                      </XStack>
                      <YStack alignItems="flex-end">
                        <Text color="$color" fontWeight="900" fontSize="$6">{String(player.payout)}€</Text>
                        <Text color="$colorMuted" fontSize="$2">Misé: {String(player.totalInvested)}€</Text>
                      </YStack>
                    </Card.Header>
                  </Card>
                );
              })}
            </YStack>
          </ScrollView>

          <Button size="$5" backgroundColor="$potGold" color="$nightBase" fontWeight="900" onPress={() => router.replace('/(main)/home')}>
            Fermer la table
          </Button>
        </YStack>
      </Theme>
    );
  };

  // ---------------------------------------------------------------------------
  // NOUVEAU RENDU : BADGE LATE REG
  // ---------------------------------------------------------------------------
  const renderLateRegBadge = () => {
    if (game.config.lateRegLimit === 0) {
      return (
        <XStack alignItems="center" gap="$1.5" backgroundColor="rgba(16, 185, 129, 0.15)" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$3">
          <Infinity size={14} color="$success" />
          <Text color="$success" fontSize="$2" fontWeight="bold">Ouvert</Text>
        </XStack>
      );
    }

    if (lateRegSeconds !== null && lateRegSeconds > 0) {
      const isUrgent = lateRegSeconds < 300; // Moins de 5 minutes = Urgent (Orange)
      return (
        <XStack alignItems="center" gap="$1.5" backgroundColor={isUrgent ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)"} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$3">
          <Timer size={14} color={isUrgent ? "$warning" : "$success"} />
          <Text color={isUrgent ? "$warning" : "$success"} fontSize="$2" fontWeight="bold" fontFamily="$body">
            {formatTime(lateRegSeconds)}
          </Text>
        </XStack>
      );
    }

    // Temps écoulé
    return (
      <XStack alignItems="center" gap="$1.5" backgroundColor="rgba(239, 68, 68, 0.15)" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$3">
        <Lock size={14} color="$danger" />
        <Text color="$danger" fontSize="$2" fontWeight="bold">Fermé</Text>
      </XStack>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDU : TABLE ACTIVE
  // ---------------------------------------------------------------------------
  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        {/* EN-TÊTE VIP */}
        <YStack alignItems="center" paddingBottom="$4" paddingTop="$2" position="relative">

          <XStack position="absolute" top="$2" left="$4">
            <Button 
              size="$3" 
              circular 
              icon={<ChevronLeft size={20} color="$color" />} 
              backgroundColor="$backgroundStrong" 
              borderColor="$borderColor" 
              borderWidth={1} 
              onPress={() => router.push('/(main)/home')} // Retourne au Dashboard
            />
          </XStack>

          <XStack position="absolute" top="$2" right="$4" gap="$2">
            <Button size="$3" circular icon={<HelpCircle size={18} color="$colorMuted" />} backgroundColor="$backgroundStrong" borderColor="$borderColor" borderWidth={1} onPress={() => setIsHelpOpen(true)} />
            <Button size="$3" circular icon={<ShareIcon size={18} color="$colorMuted" />} backgroundColor="$backgroundStrong" borderColor="$borderColor" borderWidth={1} onPress={onShareTable} />
          </XStack>

          <Text color="$colorMuted" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={2}>
            Pot Total
          </Text>
          <XStack alignItems="center" gap="$2">
            <Coins size={40} color="$potGold" />
            <H1 fontSize="$9" color="$potGold" fontWeight="900" letterSpacing={-2}>
              {String(game.totalPot)} €
            </H1>
          </XStack>
          
          {/* NOUVEAU : SOUS-TITRE AVEC LE CHRONO */}
          <XStack alignItems="center" gap="$3" marginTop="$2">
            <XStack alignItems="center" gap="$1.5">
              <Coins size={14} color="$colorMuted" />
              <Text color="$colorMuted" fontSize="$2">Buy-in: {String(game.config.defaultBuyIn)}€</Text>
            </XStack>
            <Separator vertical borderColor="$borderColor" height={12} />
            <XStack alignItems="center" gap="$1.5">
              <Text color="$colorMuted" fontSize="$2">Inscriptions :</Text>
              {renderLateRegBadge()}
            </XStack>
          </XStack>
        </YStack>

        <Separator borderColor="$borderColor" marginVertical="$4" />

        {/* LISTE DES JOUEURS */}
        <ScrollView style={{ flex: 1 }}>
          <YStack padding="$4" gap="$3">
            {isHeadsUpFinished && (
              <Button size="$5" backgroundColor="$success" color="white" fontWeight="900" icon={<Trophy size={20} />} onPress={endGame} mb="$4">
                Terminer la partie
              </Button>
            )}

            <Text color="$colorMuted" fontWeight="bold" fontSize="$3" letterSpacing={1} textTransform="uppercase">
              Joueurs ({String(game.players.length)})
            </Text>

            {sortedPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                defaultBuyIn={game.config.defaultBuyIn}
                isLateRegOpen={isLateRegOpen}
                onRebuy={() => addRebuy(player.id, game.config.defaultBuyIn)}
                onEliminate={() => eliminatePlayer(player.id)}
              />
            ))}
          </YStack>
        </ScrollView>

        {/* FOOTER : AJOUTER INVITÉ */}
        <YStack padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
          <XStack gap="$2">
            <Input
              flex={1}
              size="$4"
              backgroundColor="$background"
              borderColor="$borderColor"
              placeholder={isLateRegOpen ? "Ajouter un invité..." : "Inscriptions closes"} // Feedback visuel
              value={newGuestName}
              onChangeText={setNewGuestName}
              editable={isLateRegOpen} // Bloque la saisie
              opacity={isLateRegOpen ? 1 : 0.5}
            />
            <Button
              size="$4"
              icon={isLateRegOpen ? <UserPlus size={20} /> : <Lock size={20} />} // Changement d'icône
              backgroundColor={isLateRegOpen ? "$accent" : "$gray8"} // Changement de couleur
              color="white"
              fontWeight="bold"
              disabled={!newGuestName || !isLateRegOpen} // Blocage du bouton
              onPress={() => {
                addGuestPlayer(newGuestName, game.config.defaultBuyIn);
                setNewGuestName('');
              }}
            >
              {isLateRegOpen ? "Ajouter" : "Fermé"}
            </Button>
          </XStack>
        </YStack>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM SHEET : AIDE & TIMER */}
        {/* ------------------------------------------------------------- */}
        <Sheet modal open={isHelpOpen} onOpenChange={setIsHelpOpen} snapPoints={[85]} dismissOnSnapToBottom>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">

            {/* TIMER PREMIUM */}
            <Card bordered backgroundColor="$backgroundStrong" borderColor="$borderColor" padding="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Prochaine Blinde</Text>
                  <H1 color={timerSeconds < 60 ? "$danger" : "$potGold"} fontSize="$8" fontWeight="900">
                    {formatTime(timerSeconds)}
                  </H1>
                </YStack>
                <XStack gap="$2">
                  <Button circular size="$5" backgroundColor="$background" borderColor="$borderColor" borderWidth={1} icon={<RotateCcw size={20} color="$colorMuted" />} onPress={() => { setIsTimerRunning(false); setTimerSeconds(DEFAULT_TIME); }} />
                  <Button circular size="$5" backgroundColor={isTimerRunning ? "$danger" : "$success"} color="white" icon={isTimerRunning ? <Pause size={20} /> : <Play size={20} />} onPress={() => setIsTimerRunning(!isTimerRunning)} />
                </XStack>
              </XStack>
            </Card>

            <Separator borderColor="$borderColor" />

            {/* AIDE MAINS */}
            <YStack flex={1} gap="$3">
              <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Hiérarchie des mains</Text>
              <ScrollView>
                <YStack gap="$2" paddingBottom="$10">
                  <HandRow rank="1" name="Quinte Flush Royale" description="10, J, Q, K, A de même couleur" />
                  <HandRow rank="2" name="Quinte Flush" description="5 cartes consécutives de même couleur" />
                  <HandRow rank="3" name="Carré" description="4 cartes de même valeur" />
                  <HandRow rank="4" name="Full" description="Un Brelan + Une Paire" />
                  <HandRow rank="5" name="Couleur (Flush)" description="5 cartes de même couleur" />
                  <HandRow rank="6" name="Quinte (Suite)" description="5 cartes consécutives" />
                  <HandRow rank="7" name="Brelan" description="3 cartes de même valeur" />
                  <HandRow rank="8" name="Double Paire" description="Deux paires différentes" />
                  <HandRow rank="9" name="Paire" description="2 cartes de même valeur" />
                  <HandRow rank="10" name="Hauteur" description="La carte la plus haute" />
                </YStack>
              </ScrollView>
            </YStack>

          </Sheet.Frame>
        </Sheet>

      </YStack>
    </Theme>
  );
}

// Ligne Premium pour les mains
function HandRow({ rank, name, description }: { rank: string, name: string, description: string }) {
  return (
    <Card bordered backgroundColor="$backgroundStrong" borderColor="$borderColor">
      <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
        <Text color="$potGold" fontWeight="900" fontSize="$6" width={32} textAlign="center">#{rank}</Text>
        <YStack flex={1}>
          <Text color="$color" fontWeight="bold" fontSize="$4">{name}</Text>
          <Text color="$colorMuted" fontSize="$2">{description}</Text>
        </YStack>
      </Card.Header>
    </Card>
  );
}

// Carte Joueur refondue
function PlayerCard({ player, defaultBuyIn, isLateRegOpen, onRebuy, onEliminate }: { player: Player, defaultBuyIn: number, isLateRegOpen: boolean, onRebuy: () => void, onEliminate: () => void }) {
  const isEliminated = player.status === 'ELIMINATED';

  return (
    <Card
      bordered
      // Les éliminés deviennent transparents/sombres, les actifs ressortent
      backgroundColor={isEliminated ? "$background" : "$backgroundStrong"}
      borderColor={isEliminated ? "$borderColor" : "$borderColor"}
      opacity={isEliminated ? 0.6 : 1}
    >
      <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">

        <XStack gap="$3" alignItems="center" flex={1}>
          <Avatar circular size="$4" borderColor={isEliminated ? "$borderColor" : "$success"} borderWidth={2}>
            <Avatar.Fallback backgroundColor="$background" />
          </Avatar>
          <YStack>
            <H4 color={isEliminated ? "$colorMuted" : "$color"} textDecorationLine={isEliminated ? 'line-through' : 'none'}>
              {player.name}
            </H4>
            <Text color="$colorMuted" fontSize="$2">
              Misé : {String(player.totalInvested)}€ ({String(player.buyInCount)} caves)
            </Text>
          </YStack>
        </XStack>

        {isEliminated ? (
          <XStack alignItems="center" gap="$1" backgroundColor="$backgroundStrong" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
            <Trophy size={14} color="$colorMuted" />
            <Text color="$colorMuted" fontWeight="bold">Rang {String(player.finalRank)}</Text>
          </XStack>
        ) : (
          <XStack gap="$2">
            <Button
              size="$3"
              circular
              icon={isLateRegOpen ? <Plus size={18} /> : <Lock size={16} />} // Cadenas si fermé
              backgroundColor={isLateRegOpen ? "$success" : "$gray8"} // Gris si fermé
              color="white"
              disabled={!isLateRegOpen} // Désactivé si fermé
              onPress={onRebuy}
              opacity={isLateRegOpen ? 1 : 0.6}
            />            <Button size="$3" circular icon={<UserX size={16} />} backgroundColor="$danger" color="white" onPress={onEliminate} />
          </XStack>
        )}
      </Card.Header>
    </Card>
  );
}