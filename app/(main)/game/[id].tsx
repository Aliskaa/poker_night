import { PokerBackground } from '@/components/ui/PokerBackground'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useGameTimer } from '@/hooks/useGameTimer'
import { useUser } from '@/providers/AuthProvider'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { Spinner, Text, Theme, YStack } from 'tamagui'

// Composants game
import { GameStatusBar } from '@/components/game/GameStatusBar'
import { GameTimer } from '@/components/game/GameTimer'
import { PlayerGrid } from '@/components/game/PlayerGrid'
import { PotDisplay } from '@/components/game/PotDisplay'
import { BlindControls } from '@/components/game/BlindControls'
import { AddGuestFooter } from '@/components/game/AddGuestFooter'
import { GamePodium } from '@/components/game/GamePodium'
import { GameActions } from '@/components/game/GameActions'

// Utils
import { getBlindStructureByDuration } from '@/constants/blindStructures'

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
    pauseBlindTimer,
    resumeBlindTimer,
    nextBlindLevel 
  } = useGameLogic(id)
  const { user } = useUser()
  const hasAttemptedJoin = useRef(false)

  // ═══ BLIND STRUCTURE ═══
  const blindStructure = game 
    ? getBlindStructureByDuration(game.config.defaultTimeBlindDuration) 
    : []

  // ═══ GAME TIMER (remplace les 3 useEffect) ═══
  const {
    timerSeconds,
    isTimerRunning,
    currentBlind,
    nextBlind,
    lateRegSeconds,
    isLateRegOpen,
    formatTime,
    getProgressPercentage,
  } = useGameTimer({
    game,
    blindStructure,
    onLevelComplete: nextBlindLevel,
  })

  // ═══ AUTO JOIN ═══
  useEffect(() => { 
    if (game && user && !hasAttemptedJoin.current) {
      hasAttemptedJoin.current = true
      joinGame()
    }
  }, [game?.id, user?.id])

  // ═══ DERIVED STATE ═══
  const activePlayers = game?.players.filter(p => p.status === 'ACTIVE') || []
  const canEndGame = activePlayers.length <= 1 && (game?.players.length || 0) > 1

  // ═══ LOADING ═══
  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    )
  }

  // ═══ ERROR ═══
  if (!game) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background" gap="$4">
        <AlertTriangle size={48} color="$danger" />
        <Text color="$colorPrimary" fontSize="$6">Partie introuvable</Text>
      </YStack>
    )
  }

  // ═══ PODIUM (partie terminée) ═══
  if (game.status === 'FINISHED') {
    return <GamePodium game={game} onClose={() => router.replace('/(main)/(tabs)/groups')} />
  }

  // ═══ RENDER ═══
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
            isTimerRunning={isTimerRunning}
            lateRegSeconds={lateRegSeconds}
            lateRegLimit={game.config.lateRegLimit}
            onBackPress={() => router.push('/(main)/(tabs)/home')}
            onSharePress={() => {}} // Géré par GameActions
          />

          {/* CONTENU SCROLLABLE */}
          <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$6">
              
              {/* POT PRINCIPAL */}
              <PotDisplay
                totalPot={game.totalPot}
                playerCount={game.players.length}
                payoutModel={game.config.payoutModel}
                defaultBuyIn={game.config.defaultBuyIn}
                showPayoutPreview={true}
              />

              {/* TIMER CIRCULAIRE + BLIND CONTROLS */}
              <YStack alignItems="center" gap="$4">
                <GameTimer
                  seconds={timerSeconds}
                  isRunning={isTimerRunning}
                  isPaused={game.isPaused || false}
                  progressPercentage={getProgressPercentage()}
                  label={`LEVEL ${game.currentBlindLevel || 1}`}
                  onPause={pauseBlindTimer}
                  onResume={resumeBlindTimer}
                  size="lg"
                />
                
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

              {/* ACTIONS HÔTE */}
              <GameActions
                gameId={id}
                gameConfig={{ defaultBuyIn: game.config.defaultBuyIn }}
                canEndGame={canEndGame}
                onEndGame={endGame}
                onNextLevel={nextBlindLevel}
                showNextLevel={false}
              />

              {/* GRILLE DES JOUEURS */}
              <PlayerGrid
                players={game.players}
                defaultBuyIn={game.config.defaultBuyIn}
                isLateRegOpen={isLateRegOpen}
                onRebuy={(playerId) => addRebuy(playerId, game.config.defaultBuyIn)}
                onEliminate={eliminatePlayer}
                showHeader={true}
              />
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