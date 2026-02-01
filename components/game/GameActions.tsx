import React from 'react'
import { Share } from 'react-native'
import { YStack, XStack } from 'tamagui'
import { Trophy, Share2, Home, SkipForward } from '@tamagui/lucide-icons'
import { PokerButton } from '@/components/ui/PokerButton'
import { router } from 'expo-router'
import * as Linking from 'expo-linking'

// ═══════════════════════════════════════════════════════════════════
// 🎮 GAME ACTIONS - Actions hôte pendant la partie
// ═══════════════════════════════════════════════════════════════════

export interface GameActionsProps {
  /** ID de la partie */
  gameId: string
  
  /** Configuration de la partie */
  gameConfig: {
    defaultBuyIn: number
  }
  
  /** Partie terminable ? (1 joueur restant) */
  canEndGame: boolean
  
  /** Callback fin de partie */
  onEndGame?: () => void
  
  /** Callback niveau suivant */
  onNextLevel?: () => void
  
  /** Afficher bouton niveau suivant */
  showNextLevel?: boolean
  
  /** Afficher bouton partage */
  showShare?: boolean
  
  /** Afficher bouton accueil */
  showHome?: boolean
  
  /** Layout direction */
  direction?: 'horizontal' | 'vertical'
}

/**
 * Boutons d'action pour l'hôte de la partie
 * 
 * Actions disponibles:
 * - Terminer la partie (si 1 joueur restant)
 * - Partager la table (invite link)
 * - Retour à l'accueil
 * - Passer au niveau suivant (optionnel)
 * 
 * @example
 * <GameActions
 *   gameId="abc123"
 *   gameConfig={{ defaultBuyIn: 50 }}
 *   canEndGame={activePlayers.length <= 1}
 *   onEndGame={handleEndGame}
 *   onNextLevel={handleNextLevel}
 * />
 */
export function GameActions({
  gameId,
  gameConfig,
  canEndGame,
  onEndGame,
  onNextLevel,
  showNextLevel = false,
  showShare = true,
  showHome = true,
  direction = 'vertical',
}: GameActionsProps) {
  
  // ═══ HANDLERS ═══
  
  const handleShare = async () => {
    const url = Linking.createURL(`/(main)/game/${gameId}`, { scheme: 'pokernight' })
    try {
      await Share.share({
        message: `♠️ Viens jouer au Poker ! La table est ouverte.\nBuy-in: ${gameConfig.defaultBuyIn}€\n\nClique ici pour rejoindre : ${url}`
      })
    } catch (error) {
      console.error('Erreur partage:', error)
    }
  }
  
  const handleGoHome = () => {
    router.push('/(main)/(tabs)/home')
  }
  
  // ═══ LAYOUT ═══
  const Container = direction === 'horizontal' ? XStack : YStack
  
  return (
    <Container gap="$3">
      
      {/* TERMINER LA PARTIE (si 1 joueur restant) */}
      {canEndGame && onEndGame && (
        <PokerButton
          variant="primary"
          icon={<Trophy size={20} />}
          title="Terminer la partie"
          onPress={onEndGame}
        />
      )}
      
      {/* NIVEAU SUIVANT (manuel) */}
      {showNextLevel && onNextLevel && (
        <PokerButton
          variant="secondary"
          icon={<SkipForward size={18} />}
          title="Niveau suivant"
          onPress={onNextLevel}
        />
      )}
      
      <XStack gap="$3">
        {/* PARTAGER */}
        {showShare && (
          <PokerButton
            variant="secondary"
            icon={<Share2 size={18} />}
            title="Partager"
            onPress={handleShare}
            flex={1}
          />
        )}
        
        {/* ACCUEIL */}
        {showHome && (
          <PokerButton
            variant="secondary"
            icon={<Home size={18} />}
            title="Accueil"
            onPress={handleGoHome}
            flex={1}
          />
        )}
      </XStack>
    </Container>
  )
}
