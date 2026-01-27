import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { YStack, Spinner, Text, Theme, Separator, Button } from 'tamagui';
import { AlertTriangle, Trophy } from '@tamagui/lucide-icons';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useUser } from '@clerk/clerk-expo';
import { PokerBackground } from '@/components/ui/PokerBackground';

import { AddGuestFooter } from '@/components/game/AddGuestFooter';
import { HelpBottomSheet } from '@/components/game/HelpBottomSheet';
import { GamePodium } from '@/components/game/GamePodium';
import { GameHeader } from '@/components/game/GameHeader';
import { PlayerCard } from '@/components/game/PlayerCard';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { game, loading, addRebuy, eliminatePlayer, addGuestPlayer, endGame, joinGame, isLateRegOpen } = useGameLogic(id);
  const { user } = useUser();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const DEFAULT_TIME = 1200;
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lateRegSeconds, setLateRegSeconds] = useState<number | null>(null);

  useEffect(() => { if (game && user) joinGame(); }, [game?.id, user?.id]);

  // ---------------------------------------------------------------------------
  // CHRONO 1 : Timer des Blindes (Bottom Sheet)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);


  // ---------------------------------------------------------------------------
  // CHRONO 2 : Compte à rebours du Late Registration (En-tête)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!game || game.config.lateRegLimit === 0) return;

    // Calcul de la date de départ robuste (Firestore Timestamp -> Date JS)
    let startTime = Date.now();
    if (game.createdAt) {
      if (typeof (game.createdAt as any).toDate === 'function') {
        startTime = (game.createdAt as any).toDate().getTime();
      } else if ((game.createdAt as any).seconds) {
        startTime = (game.createdAt as any).seconds * 1000;
      } else if (game.createdAt instanceof Date) {
        startTime = game.createdAt.getTime();
      }
    }

    const endTime = startTime + (game.config.lateRegLimit * 60 * 1000);

    const interval = setInterval(() => {
      const now = Date.now();
      const diffInSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
      setLateRegSeconds(diffInSeconds);

      // Si le temps est écoulé, on arrête l'intervalle
      if (diffInSeconds <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.createdAt, game?.config.lateRegLimit]);

  // --- ACTIONS GLOBALES ---
  const onShareTable = async () => {
    const url = Linking.createURL(`/(main)/game/${id}`, { scheme: 'pokernight' });
    try {
      await Share.share({ message: `♠️ Viens jouer au Poker ! La table est ouverte. \nBuy-in: ${String(game?.config.defaultBuyIn)}€ \n\nClique ici pour rejoindre : ${url}` });
    } catch (error) { console.error("Erreur partage :", error); }
  }

  if (loading) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#064e3b"><Spinner size="large" color="$potGold" /></YStack>;
  if (!game) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#064e3b"><AlertTriangle size={48} color="$danger" /><Text color="white">Partie introuvable</Text></YStack>;

  if (game.status === 'FINISHED') return <GamePodium game={game} onClose={() => router.replace('/(main)/(tabs)/groups')} />;

  const activePlayers = game.players.filter(p => p.status === 'ACTIVE');
  const isHeadsUpFinished = activePlayers.length <= 1 && game.players.length > 1;
  const sortedPlayers = [...game.players].sort((a, b) => { /* ... ton tri ... */ return 0; });

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">

          <GameHeader 
            totalPot={game.totalPot} 
            defaultBuyIn={game.config.defaultBuyIn} 
            lateRegLimit={game.config.lateRegLimit} 
            lateRegSeconds={lateRegSeconds} 
            onHelpPress={() => setIsHelpOpen(true)} 
            onSharePress={onShareTable} 
            onBackPress={() => router.push('/(main)/(tabs)/groups')} 
          />

          <Separator borderColor="rgba(255,255,255,0.1)" marginVertical="$4" />

          <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$3">
              {isHeadsUpFinished && (
                <Button size="$5" backgroundColor="$potGold" color="$nightBase" fontWeight="900" icon={<Trophy size={20} color="black" />} onPress={endGame} mb="$4">
                  Terminer la partie
                </Button>
              )}

              <Text color="rgba(255,255,255,0.5)" fontWeight="bold" fontSize="$3" letterSpacing={1} textTransform="uppercase">
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

          <AddGuestFooter 
            isLateRegOpen={isLateRegOpen} 
            onAddGuest={(name) => addGuestPlayer(name, game.config.defaultBuyIn)} 
          />

        <HelpBottomSheet 
          isOpen={isHelpOpen} 
          onOpenChange={setIsHelpOpen} 
          timerSeconds={timerSeconds} 
          isTimerRunning={isTimerRunning} 
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)} 
          onResetTimer={() => { setIsTimerRunning(false); setTimerSeconds(DEFAULT_TIME); }} 
        />

        </YStack>
      </PokerBackground>
    </Theme>
  );
}