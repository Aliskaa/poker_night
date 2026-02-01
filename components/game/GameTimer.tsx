import React from 'react'
import { Circle, Text, XStack, YStack, styled } from 'tamagui'
import { Pause, Play } from '@tamagui/lucide-icons'
import Svg, { Circle as SvgCircle } from 'react-native-svg'
import { IconButton } from '@/components/ui/IconButton'

// ═══════════════════════════════════════════════════════════════════
// ⏱️ GAME TIMER - Timer circulaire moderne pour les blinds
// ═══════════════════════════════════════════════════════════════════

export interface GameTimerProps {
  /** Temps restant en secondes */
  seconds: number
  
  /** Timer en cours d'exécution ? */
  isRunning: boolean
  
  /** Timer en pause ? */
  isPaused: boolean
  
  /** Pourcentage de progression (0-100) */
  progressPercentage?: number
  
  /** Taille du timer */
  size?: 'sm' | 'md' | 'lg'
  
  /** Callback pause */
  onPause?: () => void
  
  /** Callback resume */
  onResume?: () => void
  
  /** Afficher les contrôles (pause/play) */
  showControls?: boolean
  
  /** Label (ex: "LEVEL 3") */
  label?: string
}

const SIZES = {
  sm: { radius: 50, stroke: 6, fontSize: 18, labelSize: 10 },
  md: { radius: 70, stroke: 8, fontSize: 24, labelSize: 12 },
  lg: { radius: 90, stroke: 10, fontSize: 32, labelSize: 14 },
}

/**
 * Timer circulaire avec progression visuelle
 * 
 * Design: Cercle avec bordure progressive, temps au centre
 * Interactif: Boutons pause/play optionnels
 * 
 * @example
 * <GameTimer
 *   seconds={420}
 *   isRunning={true}
 *   isPaused={false}
 *   progressPercentage={35}
 *   label="LEVEL 3"
 *   onPause={pauseTimer}
 *   onResume={resumeTimer}
 * />
 */
export function GameTimer({
  seconds,
  isRunning,
  isPaused,
  progressPercentage = 0,
  size = 'md',
  onPause,
  onResume,
  showControls = true,
  label,
}: GameTimerProps) {
  
  const { radius, stroke, fontSize, labelSize } = SIZES[size]
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference
  
  // Formater le temps MM:SS
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeString = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  
  // Couleur basée sur l'urgence
  const getTimerColor = () => {
    if (isPaused) return '$text40'
    if (seconds <= 30) return '$danger'
    if (seconds <= 60) return '$warning'
    return '$gold'
  }
  
  const timerColor = getTimerColor()
  const svgSize = (radius + stroke) * 2
  
  return (
    <YStack alignItems="center" gap="$3">
      {/* TIMER CIRCULAIRE */}
      <YStack position="relative" alignItems="center" justifyContent="center">
        {/* SVG Circle Progress */}
        <Svg width={svgSize} height={svgSize} style={{ position: 'absolute' }}>
          {/* Background circle */}
          <SvgCircle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={stroke}
            fill="none"
          />
          
          {/* Progress circle */}
          <SvgCircle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={timerColor === '$danger' ? '#DC2626' : timerColor === '$warning' ? '#EA580C' : '#D4AF37'}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
          />
        </Svg>
        
        {/* Temps au centre */}
        <YStack 
          width={svgSize} 
          height={svgSize} 
          alignItems="center" 
          justifyContent="center"
          gap="$1"
        >
          {label && (
            <Text 
              color="$text60" 
              fontSize={labelSize} 
              fontWeight="700"
              letterSpacing={1}
              textTransform="uppercase"
            >
              {label}
            </Text>
          )}
          
          <Text 
            color={timerColor} 
            fontSize={fontSize} 
            fontWeight="900"
            letterSpacing={-1}
          >
            {timeString}
          </Text>
          
          {isPaused && (
            <Text 
              color="$text40" 
              fontSize={labelSize} 
              fontWeight="600"
              textTransform="uppercase"
            >
              PAUSE
            </Text>
          )}
        </YStack>
      </YStack>
      
      {/* CONTRÔLES (PAUSE/PLAY) */}
      {showControls && (onPause || onResume) && (
        <XStack gap="$2">
          {isPaused ? (
            <IconButton
              icon={<Play size={20} color="$success" />}
              onPress={onResume}
              variant="outlined"
              size="small"
            />
          ) : (
            <IconButton
              icon={<Pause size={20} color="$warning" />}
              onPress={onPause}
              variant="outlined"
              size="small"
            />
          )}
        </XStack>
      )}
    </YStack>
  )
}

/**
 * Variante compacte du timer (pour headers)
 */
export function CompactGameTimer(props: Omit<GameTimerProps, 'size' | 'showControls'>) {
  return (
    <GameTimer
      {...props}
      size="sm"
      showControls={false}
    />
  )
}
