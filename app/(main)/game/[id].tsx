import { PokerBackground } from '@/components/ui/PokerBackground'
import { PokerButton } from '@/components/ui/PokerButton'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useUser } from '@/providers/AuthProvider'
import { AlertTriangle, Trophy } from '@tamagui/lucide-icons'
import * as Linking from 'expo-linking'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState, useRef } from 'react'
import { ScrollView, Share } from 'react-native'
import { Spinner, Text, Theme, XStack, YStack } from 'tamagui'

// Nouveaux composants
import { BlindControls } from '@/components/game/BlindControls'
import { GameStatusBar } from '@/components/game/GameStatusBar'
import { PlayerCard } from '@/components/game/PlayerCard'
import { PotDisplay } from '@/components/game/PotDisplay'

// Anciens composants conservés
import { AddGuestFooter } from '@/components/game/AddGuestFooter'
import { GamePodium } from '@/components/game/GamePodium'

// Structure de blinds
import {
  getBlindStructureByDuration,
  getCurrentBlindLevel,
  getNextBlindLevel
} from '@/constants/blindStructures'
import { getBlindLevelRemainingSeconds } from '@/utils/timestampHelpers'

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { 
    game, 
    loading, 
    addRebuy, 
    eliminatePlayer, 
    addGuestPlayer, 
    endGame,
    joinGame,
    isLateRegOpen,
    pauseBlindTimer,
    resumeBlindTimer,
    nextBlindLevel 
  } = useGameLogic(id)
  const { user } = useUser()
  const hasAttemptedJoin = useRef(false)

  // Structure de blinds basée sur la durée configurée
  const blindStructure = game ? getBlindStructureByDuration(game.config.defaultTimeBlindDuration) : []
  const currentBlind = game ? getCurrentBlindLevel(game.currentBlindLevel || 0, blindStructure) : null
  const nextBlind = game ? getNextBlindLevel(game.currentBlindLevel || 0, blindStructure) : null

  const DEFAULT_TIME = currentBlind ? currentBlind.duration * 60 : 900
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIME)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [lateRegSeconds, setLateRegSeconds] = useState<number | null>(null)

  useEffect(() => { 
    if (game && user && !hasAttemptedJoin.current) {
      hasAttemptedJoin.current = true
      joinGame()
    }
  }, [game?.id, user?.id])

  // Synchroniser le timer avec Firestore (temps réel)
  useEffect(() => {
    if (!game || !currentBlind) return;

    // Calculer le temps restant basé sur Firestore
    const calculateRemainingTime = () => {
      if (!game.blindLevelStartedAt) {
        return currentBlind.duration * 60;
      }

      return getBlindLevelRemainingSeconds(
        game.blindLevelStartedAt,
        currentBlind.duration,
        game.isPaused,
        game.pausedAt,
        0 // TODO: ajouter totalPausedSeconds si nécessaire
      );
    };

    // Initialiser le timer
    setTimerSeconds(calculateRemainingTime());
    setIsTimerRunning(!game.isPaused);

    // Mettre à jour le timer chaque seconde
    const interval = setInterval(() => {
      if (!game.isPaused) {
        const remaining = calculateRemainingTime();
        setTimerSeconds(remaining);

        // Auto-passer au niveau suivant
        if (remaining <= 0 && nextBlind) {
          nextBlindLevel();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.blindLevelStartedAt, game?.isPaused, game?.currentBlindLevel, currentBlind?.duration]);

  // Compte à rebours Late Registration
  useEffect(() => {
    if (!game || game.config.lateRegLimit === 0) return

    let startTime = Date.now()
    if (game.createdAt) {
      if (typeof (game.createdAt as any).toDate === 'function') {
        startTime = (game.createdAt as any).toDate().getTime()
      } else if ((game.createdAt as any).seconds) {
        startTime = (game.createdAt as any).seconds * 1000
      } else if (game.createdAt instanceof Date) {
        startTime = game.createdAt.getTime()
      }
    }

    const endTime = startTime + (game.config.lateRegLimit * 60 * 1000)

    const interval = setInterval(() => {
      const now = Date.now()
      const diffInSeconds = Math.max(0, Math.floor((endTime - now) / 1000))
      setLateRegSeconds(diffInSeconds)
      if (diffInSeconds <= 0) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [game?.createdAt, game?.config.lateRegLimit])

  const onShareTable = async () => {
    const url = Linking.createURL(`/(main)/game/${id}`, { scheme: 'pokernight' })
    try {
      await Share.share({ 
        message: `♠️ Viens jouer au Poker ! La table est ouverte.\nBuy-in: ${game?.config.defaultBuyIn}€\n\nClique ici pour rejoindre : ${url}` 
      })
    } catch (error) { 
      console.error("Erreur partage :", error)
    }
  }

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    )
  }

  if (!game) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background" gap="$4">
        <AlertTriangle size={48} color="$danger" />
        <Text color="$colorPrimary" fontSize="$6">Partie introuvable</Text>
      </YStack>
    )
  }

  if (game.status === 'FINISHED') {
    return <GamePodium game={game} onClose={() => router.replace('/(main)/(tabs)/groups')} />
  }

  const activePlayers = game.players.filter(p => p.status === 'ACTIVE')
  const isHeadsUpFinished = activePlayers.length <= 1 && game.players.length > 1
  const sortedPlayers = [...game.players].sort((a, b) => {
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
    if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1
    if (a.status === 'ELIMINATED' && b.status === 'ELIMINATED') {
      return (a.finalRank || 0) - (b.finalRank || 0)
    }
    return 0
  })

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1}>
          
          {/* BARRE DE STATUS FIXE */}
          <GameStatusBar 
            currentSmallBlind={currentBlind?.smallBlind || 0}
            currentBigBlind={currentBlind?.bigBlind || 0}
            currentAnte={currentBlind?.ante || 0}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning && !game.isPaused}
            lateRegSeconds={lateRegSeconds}
            lateRegLimit={game.config.lateRegLimit}
            onBackPress={() => router.push('/(main)/(tabs)/home')}
            onSharePress={onShareTable}
          />

          {/* CONTENU SCROLLABLE */}
          <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$5">
              
              {/* POT PRINCIPAL */}
              <PotDisplay
                totalPot={game.totalPot}
                playerCount={game.players.length}
                payoutModel={game.config.payoutModel}
                defaultBuyIn={game.config.defaultBuyIn}
                showPayoutPreview={true}
              />

              {/* BLIND CONTROLS */}
              <YStack gap="$3">
                <BlindControls
                  seconds={timerSeconds}
                  currentLevel={game.currentBlindLevel || 0}
                  isPaused={game.isPaused || false}
                  blindStructure={blindStructure}
                  onPause={pauseBlindTimer}
                  onResume={resumeBlindTimer}
                  onNextLevel={nextBlindLevel}
                />
              </YStack>

              {/* BOUTON FIN DE PARTIE */}
              {isHeadsUpFinished && (
                <PokerButton
                  variant="primary"
                  icon={<Trophy size={20} />}
                  title="Terminer la partie"
                  onPress={endGame}
                />
              )}

              {/* LISTE DES JOUEURS */}
              <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text 
                    color="$colorTertiary"
                    fontWeight="700"
                    fontSize="$3"
                    letterSpacing={1}
                    textTransform="uppercase"
                  >
                    Joueurs ({game.players.length})
                  </Text>
                  <XStack gap="$2">
                    <Text color="$success" fontSize="$2" fontWeight="600">
                      {activePlayers.length} actifs
                    </Text>
                  </XStack>
                </XStack>

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
            </YStack>
          </ScrollView>

          {/* FOOTER : AJOUT INVITÉ */}
          <AddGuestFooter 
            isLateRegOpen={isLateRegOpen} 
            onAddGuest={(name) => addGuestPlayer(name, game.config.defaultBuyIn)} 
          />
        </YStack>
      </PokerBackground>
    </Theme>
  )
}