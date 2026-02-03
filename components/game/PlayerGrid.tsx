import React from 'react'
import { Text, XStack, YStack } from 'tamagui'
import { PlayerCard } from '@/components/game/PlayerCard'
import { Label } from '@/components/ui/Typography'
import type { Player } from '@/types/Player'

// ═══════════════════════════════════════════════════════════════════
// 👥 PLAYER GRID - Grille des joueurs avec tri intelligent
// ═══════════════════════════════════════════════════════════════════

export interface PlayerGridProps {
  /** Liste des joueurs */
  players: Player[]
  
  /** Buy-in par défaut */
  defaultBuyIn: number
  
  /** Late registration ouverte ? */
  isLateRegOpen: boolean
  
  /** Callback rebuy */
  onRebuy?: (playerId: string) => void
  
  /** Callback élimination */
  onEliminate?: (playerId: string) => void
  
  /** Afficher le header avec compteurs */
  showHeader?: boolean
  
  /** Espacement entre les cartes */
  gap?: '$2' | '$3' | '$4' | '$5'
}

/**
 * Grille des joueurs avec tri automatique
 * 
 * Tri:
 * 1. ACTIVE en premier
 * 2. ELIMINATED ensuite (par finalRank)
 * 3. SITTING_OUT à la fin
 * 
 * Design:
 * - Header avec compteur actifs
 * - PlayerCard pour chaque joueur
 * - Gap configurable
 * 
 * @example
 * <PlayerGrid
 *   players={game.players}
 *   defaultBuyIn={50}
 *   isLateRegOpen={true}
 *   onRebuy={handleRebuy}
 *   onEliminate={handleEliminate}
 * />
 */
export function PlayerGrid({
  players,
  defaultBuyIn,
  isLateRegOpen,
  onRebuy,
  onEliminate,
  showHeader = true,
  gap = '$3',
}: PlayerGridProps) {
  
  // ═══ TRI INTELLIGENT ═══
  const sortedPlayers = [...players].sort((a, b) => {
    // Actifs en premier
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
    if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1
    
    // Éliminés triés par finalRank
    if (a.status === 'ELIMINATED' && b.status === 'ELIMINATED') {
      return (a.finalRank || 0) - (b.finalRank || 0)
    }
    
    // Autres (SITTING_OUT, etc.)
    return 0
  })
  
  // ═══ STATS ═══
  const activePlayers = players.filter(p => p.status === 'ACTIVE')
  const eliminatedPlayers = players.filter(p => p.status === 'ELIMINATED')
  const totalPlayers = players.length
  
  return (
    <YStack gap={gap}>
      {/* HEADER */}
      {showHeader && (
        <XStack justifyContent="space-between" alignItems="center">
          <Label color="$muted" size="md">
            Joueurs ({totalPlayers})
          </Label>
          
          <XStack gap="$3" alignItems="center">
            <XStack gap="$1" alignItems="center">
              <Text color="$success" fontSize="$2" fontWeight="700">
                {activePlayers.length}
              </Text>
              <Text color="$text60" fontSize="$2">
                actifs
              </Text>
            </XStack>
            
            {eliminatedPlayers.length > 0 && (
              <XStack gap="$1" alignItems="center">
                <Text color="$danger" fontSize="$2" fontWeight="700">
                  {eliminatedPlayers.length}
                </Text>
                <Text color="$text60" fontSize="$2">
                  éliminés
                </Text>
              </XStack>
            )}
          </XStack>
        </XStack>
      )}
      
      {/* LISTE DES JOUEURS */}
      {sortedPlayers.length > 0 ? (
        sortedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            defaultBuyIn={defaultBuyIn}
            isLateRegOpen={isLateRegOpen}
            onRebuy={() => onRebuy?.(player.id)}
            onEliminate={() => onEliminate?.(player.id)}
          />
        ))
      ) : (
        <YStack 
          padding="$8" 
          alignItems="center" 
          backgroundColor="$glass2" 
          borderRadius="$6"
        >
          <Text color="$text40" fontSize="$4" textAlign="center">
            Aucun joueur
          </Text>
          <Text color="$text30" fontSize="$3" textAlign="center" marginTop="$2">
            Ajoutez des joueurs pour commencer
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
