import { PokerBackground } from '@/components/ui/PokerBackground'
import { useGameLogic } from '@/hooks/useGameLogic'
import { useGameTimer } from '@/hooks/useGameTimer'
import { usePlayerSubcollection } from '@/hooks/usePlayerSubcollection'
import { useUser } from '@/providers/AuthProvider'
import { AlertTriangle } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Share } from 'react-native'
import { Spinner, Text, Theme, YStack } from 'tamagui'
import * as Linking from 'expo-linking'
import { useToast } from '@/hooks/useToast'
import { hapticFeedback } from '@/services/haptics'

// Composants game
import { AddGuestFooter } from '@/components/game/AddGuestFooter'
import { BlindControls } from '@/components/game/BlindControls'
import { GameActions } from '@/components/game/GameActions'
import { GamePodium } from '@/components/game/GamePodium'
import { GameStatusBar } from '@/components/game/GameStatusBar'
import { HandRankingSheet } from '@/components/game/HandRankingSheet'
import { PlayerGrid } from '@/components/game/PlayerGrid'
import { PotDisplay } from '@/components/game/PotDisplay'

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
  const { success: successToast, warning: warningToast } = useToast()
  const isHost = !!(game && user && game.hostId === user.id)
  const autoJoinInFlightRef = useRef(false)
  const [handRankingOpen, setHandRankingOpen] = useState(false)

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
    onLevelComplete: isHost ? nextBlindLevel : undefined,
  })

  // ═══ AUTO JOIN (idempotent : une tentative à la fois, rejoue si échec réseau) ═══
  useEffect(() => {
    if (!game || !user || playersLoading) return
    if (game.status !== 'PLAYING' && game.status !== 'WAITING') return

    const alreadyIn = players.some(p => p.userId === user.id)
    if (alreadyIn) {
      autoJoinInFlightRef.current = false
      return
    }
    if (!isLateRegOpen) return
    if (autoJoinInFlightRef.current) return

    autoJoinInFlightRef.current = true
    void addPlayer({
      userId: user.id,
      name: (user as { displayName?: string }).displayName || user.email?.split('@')[0] || 'Joueur',
      ...((user as { photoURL?: string }).photoURL && { avatarUrl: (user as { photoURL?: string }).photoURL }),
      isActive: true,
      buyInAmount: game.config.defaultBuyIn,
      totalInvested: game.config.defaultBuyIn,
      rebuyCount: 0,
      finalRank: null,
      winnings: 0,
    }).finally(() => {
      autoJoinInFlightRef.current = false
    })
  }, [addPlayer, game, isLateRegOpen, players, playersLoading, user])

  // ═══ DERIVED STATE ═══
  const activePlayers = players.filter(p => p.isActive)
  const canEndGame = activePlayers.length <= 1 && players.length > 1
  
  const onShareTable = async () => {
    const url = Linking.createURL(`/(main)/game/${id}`, { scheme: 'pokernight' })
    try {
      await Share.share({
        message: `♠️ Table ouverte sur Poker Night\nBlindes: ${currentBlind?.smallBlind ?? 0}/${currentBlind?.bigBlind ?? 0}\nPot: ${game?.totalPot ?? 0}€\n\nRejoins la partie: ${url}`
      })
      void hapticFeedback.success()
      successToast('Invitation envoyee')
    } catch {
      // Keep the game screen resilient even if share sheet fails.
      void hapticFeedback.warning()
      warningToast('Partage indisponible')
    }
  }

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
            onHelpPress={() => setHandRankingOpen(true)}
            onSharePress={onShareTable}
          />

          <HandRankingSheet open={handRankingOpen} onOpenChange={setHandRankingOpen} />

          {/* CONTENU SCROLLABLE */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 96 }}>
            <YStack padding="$4" gap="$6" width="100%" maxWidth={780} alignSelf="center">

              {/* POT PRINCIPAL */}
              <PotDisplay
                totalPot={game.totalPot}
                playerCount={players.length}
                payoutModel={game.config.payoutModel}
                defaultBuyIn={game.config.defaultBuyIn}
                showPayoutPreview={true}
              />

              {/* CONTRÔLES DES BLINDS */}
              <BlindControls
                seconds={timerSeconds}
                currentLevel={game.currentBlindLevel || 0}
                isPaused={game.isPaused || false}
                isTimerRunning={isTimerRunning}
                getProgressPercentage={getProgressPercentage}
                blindStructure={blindStructure}
                onPause={pauseBlindTimer}
                onResume={resumeBlindTimer}
                onNextLevel={nextBlindLevel}
                hostCanControl={isHost}
              />

              {/* ACTIONS HÔTE */}
              {isHost && (
                <GameActions
                  gameId={id}
                  gameConfig={{ defaultBuyIn: game.config.defaultBuyIn }}
                  canEndGame={canEndGame}
                  onEndGame={endGame}
                  onNextLevel={nextBlindLevel}
                  showNextLevel={false}
                />
              )}

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
                showHostActions={isHost}
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

          {/* FOOTER : AJOUT INVITÉ (hôte) */}
          {isHost && (
            <AddGuestFooter
              isLateRegOpen={isLateRegOpen}
              onAddGuest={(name) => addPlayer({
                userId: null,
                name,
                isActive: true,
                buyInAmount: game.config.defaultBuyIn,
                totalInvested: game.config.defaultBuyIn,
                rebuyCount: 0,
                finalRank: null,
                winnings: 0,
              })}
            />
          )}
        </YStack>
      </PokerBackground>
    </Theme>
  )
}
