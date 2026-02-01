import { useState, useEffect, useRef } from 'react'
import { getCurrentBlindLevel, getNextBlindLevel, type BlindLevel } from '@/constants/blindStructures'
import { getBlindLevelRemainingSeconds } from '@/utils/timestampHelpers'
import type { Game } from '@/types/Game'

// ═══════════════════════════════════════════════════════════════════
// ⏱️ GAME TIMER HOOK - Gestion centralisée du timer de blinds
// ═══════════════════════════════════════════════════════════════════

export interface UseGameTimerOptions {
  game: Game | null
  blindStructure: BlindLevel[]
  onLevelComplete?: () => void  // Callback appelé quand le niveau est terminé
}

export interface UseGameTimerReturn {
  // Timer principal (blinds)
  timerSeconds: number
  isTimerRunning: boolean
  currentBlind: BlindLevel | null
  nextBlind: BlindLevel | null
  
  // Late registration countdown
  lateRegSeconds: number | null
  isLateRegOpen: boolean
  
  // Helpers
  formatTime: (seconds: number) => string
  getProgressPercentage: () => number
}

/**
 * Hook gérant la logique du timer de blinds et late registration
 * 
 * Remplace les 3 useEffect imbriqués de game/[id].tsx
 * Synchronise avec Firestore en temps réel
 * Calcule automatiquement le temps restant
 * 
 * @example
 * const { timerSeconds, currentBlind, lateRegSeconds } = useGameTimer({
 *   game,
 *   blindStructure,
 *   onLevelComplete: nextBlindLevel
 * })
 */
export function useGameTimer({ 
  game, 
  blindStructure, 
  onLevelComplete 
}: UseGameTimerOptions): UseGameTimerReturn {
  
  // ═══ STATE ═══
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [lateRegSeconds, setLateRegSeconds] = useState<number | null>(null)
  
  // Ref pour éviter les appels multiples
  const hasCalledLevelComplete = useRef(false)
  
  // ═══ BLIND LEVELS ═══
  const currentBlind = game 
    ? getCurrentBlindLevel(game.currentBlindLevel || 0, blindStructure) 
    : null
    
  const nextBlind = game 
    ? getNextBlindLevel(game.currentBlindLevel || 0, blindStructure) 
    : null
  
  // ═══ TIMER PRINCIPAL (BLINDS) ═══
  useEffect(() => {
    if (!game || !currentBlind) {
      setTimerSeconds(0)
      setIsTimerRunning(false)
      return
    }

    // Fonction de calcul du temps restant
    const calculateRemainingTime = () => {
      if (!game.blindLevelStartedAt) {
        return currentBlind.duration * 60
      }

      return getBlindLevelRemainingSeconds(
        game.blindLevelStartedAt,
        currentBlind.duration,
        game.isPaused || false,
        game.pausedAt,
        0 // TODO: ajouter totalPausedSeconds si tracking précis nécessaire
      )
    }

    // Initialisation
    const initialTime = calculateRemainingTime()
    setTimerSeconds(initialTime)
    setIsTimerRunning(!game.isPaused)
    hasCalledLevelComplete.current = false

    // Interval pour mise à jour en temps réel
    const interval = setInterval(() => {
      if (!game.isPaused) {
        const remaining = calculateRemainingTime()
        setTimerSeconds(remaining)

        // Auto-passage au niveau suivant
        if (remaining <= 0 && nextBlind && !hasCalledLevelComplete.current) {
          hasCalledLevelComplete.current = true
          onLevelComplete?.()
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [
    game?.id,
    game?.blindLevelStartedAt, 
    game?.isPaused, 
    game?.pausedAt,
    game?.currentBlindLevel, 
    currentBlind?.duration,
    nextBlind?.level,
    onLevelComplete
  ])

  // ═══ LATE REGISTRATION COUNTDOWN ═══
  useEffect(() => {
    if (!game || game.config.lateRegLimit === 0) {
      setLateRegSeconds(null)
      return
    }

    // Extraire timestamp de démarrage (gérer Firestore Timestamp)
    let startTime = Date.now()
    if (game.createdAt) {
      if (typeof (game.createdAt as any).toDate === 'function') {
        startTime = (game.createdAt as any).toDate().getTime()
      } else if ((game.createdAt as any).seconds) {
        startTime = (game.createdAt as any).seconds * 1000
      } else if (game.createdAt instanceof Date) {
        startTime = game.createdAt.getTime()
      } else if (typeof game.createdAt === 'string') {
        startTime = new Date(game.createdAt).getTime()
      }
    }

    const endTime = startTime + (game.config.lateRegLimit * 60 * 1000)

    // Interval pour compte à rebours
    const interval = setInterval(() => {
      const now = Date.now()
      const diffInSeconds = Math.max(0, Math.floor((endTime - now) / 1000))
      setLateRegSeconds(diffInSeconds)
      
      if (diffInSeconds <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [game?.createdAt, game?.config.lateRegLimit])

  // ═══ HELPERS ═══
  
  /**
   * Formate un nombre de secondes en MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Calcule le pourcentage de progression (pour timer circulaire)
   */
  const getProgressPercentage = (): number => {
    if (!currentBlind) return 0
    const totalSeconds = currentBlind.duration * 60
    return ((totalSeconds - timerSeconds) / totalSeconds) * 100
  }

  /**
   * Late reg encore ouvert ?
   */
  const isLateRegOpen = lateRegSeconds !== null && lateRegSeconds > 0

  // ═══ RETURN ═══
  return {
    // Timer principal
    timerSeconds,
    isTimerRunning,
    currentBlind,
    nextBlind,
    
    // Late registration
    lateRegSeconds,
    isLateRegOpen,
    
    // Helpers
    formatTime,
    getProgressPercentage,
  }
}
