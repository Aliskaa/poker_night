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
  const [effectiveLevel, setEffectiveLevel] = useState(0)
  
  // Ref pour éviter les appels multiples
  const hasCalledLevelComplete = useRef(false)
  const lastSyncRequestBaseLevelRef = useRef<number | null>(null)

  const toMillis = (value: unknown): number | null => {
    if (!value) return null
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
      return (value as { toDate: () => Date }).toDate().getTime()
    }
    if (typeof value === 'object' && value !== null && 'seconds' in (value as Record<string, unknown>)) {
      const seconds = (value as { seconds?: number }).seconds
      if (typeof seconds === 'number') return seconds * 1000
    }
    if (value instanceof Date) return value.getTime()
    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value).getTime()
      return Number.isNaN(parsed) ? null : parsed
    }
    return null
  }
  
  // ═══ BLIND LEVELS ═══
  const currentLevel = game ? effectiveLevel : 0
  const currentBlind = game 
    ? getCurrentBlindLevel(currentLevel, blindStructure) 
    : null
    
  const nextBlind = game 
    ? getNextBlindLevel(currentLevel, blindStructure) 
    : null
  
  // ═══ TIMER PRINCIPAL (BLINDS) ═══
  useEffect(() => {
    if (!game || blindStructure.length === 0) {
      setTimerSeconds(0)
      setIsTimerRunning(false)
      setEffectiveLevel(0)
      return
    }

    const baseLevel = game.currentBlindLevel || 0
    const startedAtMs = toMillis(game.blindLevelStartedAt)
    const isPaused = game.isPaused || false

    const calculateLevelAndRemaining = () => {
      const fallbackBlind = getCurrentBlindLevel(baseLevel, blindStructure)
      if (!startedAtMs || isPaused) {
        const remaining = getBlindLevelRemainingSeconds(
          game.blindLevelStartedAt,
          fallbackBlind.duration,
          isPaused,
          game.pausedAt,
          0
        )
        return {
          level: baseLevel,
          remaining: Math.max(0, remaining),
        }
      }

      let elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000))
      let level = baseLevel

      while (level < blindStructure.length - 1) {
        const levelDef = getCurrentBlindLevel(level, blindStructure)
        const levelDuration = levelDef.duration * 60
        if (elapsedSeconds < levelDuration) break
        elapsedSeconds -= levelDuration
        level += 1
      }

      const effectiveBlind = getCurrentBlindLevel(level, blindStructure)
      const remaining = Math.max(0, effectiveBlind.duration * 60 - elapsedSeconds)
      return { level, remaining }
    }

    // Initialisation
    const initial = calculateLevelAndRemaining()
    setEffectiveLevel(initial.level)
    setTimerSeconds(initial.remaining)
    setIsTimerRunning(!isPaused)
    hasCalledLevelComplete.current = false
    if (initial.level === baseLevel) {
      lastSyncRequestBaseLevelRef.current = null
    }

    // Interval pour mise à jour en temps réel
    const interval = setInterval(() => {
      const computed = calculateLevelAndRemaining()
      setEffectiveLevel(computed.level)
      setTimerSeconds(computed.remaining)

      // Si le client hôte peut écrire, on demande une synchro Firestore
      if (
        onLevelComplete &&
        computed.level > baseLevel &&
        lastSyncRequestBaseLevelRef.current !== baseLevel
      ) {
        lastSyncRequestBaseLevelRef.current = baseLevel
        onLevelComplete()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [
    game?.id,
    game?.blindLevelStartedAt, 
    game?.isPaused, 
    game?.pausedAt,
    game?.currentBlindLevel,
    blindStructure,
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
