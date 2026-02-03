import { PokerBackground } from '@/components/ui/PokerBackground'
import { useGameLogic } from '@/hooks/useGameLogic'
import { usePlayerSubcollection } from '@/hooks/usePlayerSubcollection'
import { useGameTimer } from '@/hooks/useGameTimer'
import { useUser } from '@/providers/AuthProvider'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
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
    endGame,
    pauseBlindTimer,
    resumeBlindTimer,
    nextBlindLevel 
  } = useGameLogic(id)
  
  const { 
    players, 
    loading: playersLoading,
    addPlayer, 
    updatePlayer 
  } = usePlayerSubcollection(id)
  
  const { user } = useUser()

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
    if (game && user && players.length > 0) {
      const isAlreadyPlaying = players.some(p => p.userId === user.id)
      if (!isAlreadyPlaying && isLateRegOpen) {
        // Auto-ajouter le joueur s'il n'est pas déjà présent
        addPlayer({
          userId: user.id,
          name: (user as any).displayName || user.email?.split('@')[0] || 'Joueur',
          avatarUrl: (user as any).photoURL || undefined,
          isActive: true,
          buyInAmount: game.config.defaultBuyIn,
          totalInvested: game.config.defaultBuyIn,
          rebuyCount: 0,
          position: undefined,
          finalRank: null,
          winnings: 0,
        })
      }
    }
  }, [game?.id, user?.id, players.length])

  // ═══ DERIVED STATE ═══
  const activePlayers = players.filter(p => p.isActive)
  const canEndGame = activePlayers.length <= 1 && players.length > 1

  // ═══ LOADING ═══
  if (loading || playersLoading) {
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
    return <GamePodium game={game} players={players} onClose={() => router.replace('/(main)/(tabs)/groups')} />
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
                playerCount={players.length}
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
                players={players.map(p => ({
                  id: p.id,
                  name: p.name,
                  avatarUrl: p.avatarUrl,
                  isGuest: !p.userId,
                  buyInCount: p.rebuyCount + 1,
                  totalInvested: p.totalInvested,
                  status: p.isActive ? 'ACTIVE' : 'ELIMINATED',
                  finalRank: p.finalRank,
                  payout: p.winnings,
                }))}
                defaultBuyIn={game.config.defaultBuyIn}
                isLateRegOpen={isLateRegOpen}
                onRebuy={(playerId) => {
                  const player = players.find(p => p.id === playerId)
                  if (player) {
                    updatePlayer(playerId, {
                      rebuyCount: player.rebuyCount + 1,
                      totalInvested: player.totalInvested + game.config.defaultBuyIn,
                      isActive: true,
                    })
                  }
                }}
                onEliminate={(playerId) => {
                  const eliminatedCount = players.filter(p => !p.isActive).length
                  const currentRank = players.length - eliminatedCount
                  updatePlayer(playerId, {
                    isActive: false,
                    finalRank: currentRank,
                  })
                }}
                showHeader={true}
              />
            </YStack>
          </ScrollView>

          {/* FOOTER : AJOUT INVITÉ */}
          <AddGuestFooter 
            isLateRegOpen={isLateRegOpen} 
            onAddGuest={(name) => addPlayer({
              userId: null,
              name,
              avatarUrl: undefined,
              isActive: true,
              buyInAmount: game.config.defaultBuyIn,
              totalInvested: game.config.defaultBuyIn,
              rebuyCount: 0,
              position: undefined,
              finalRank: null,
              winnings: 0,
            })} 
          />
        </YStack>
      </PokerBackground>
    </Theme>
  )
}
