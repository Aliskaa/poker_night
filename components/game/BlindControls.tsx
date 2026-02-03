import { BlindLevel as BlindLevelType, getCurrentBlindLevel, getNextBlindLevel } from '@/constants/blindStructures'
import { formatDuration } from '@/utils/timestampHelpers'
import { Pause, Play, SkipForward, Timer, TrendingUp } from '@tamagui/lucide-icons'
import { Text, XStack, YStack, type YStackProps } from 'tamagui'
import { IconButton } from '../ui/IconButton'
import { hapticFeedback } from '@/services/haptics'
import { GameTimer } from './GameTimer'

interface BlindControlsProps extends Omit<YStackProps, 'children'> {
  seconds: number
  currentLevel: number
  isPaused: boolean
  isTimerRunning: boolean
  getProgressPercentage: () => number
  blindStructure?: BlindLevelType[]
  onPause: () => void
  onResume: () => void
  onNextLevel: () => void
  disabled?: boolean
}

export function BlindControls({
  seconds,
  currentLevel,
  isPaused,
  isTimerRunning,
  getProgressPercentage,
  blindStructure,
  onPause,
  onResume,
  onNextLevel,
  disabled = false,
  ...props
}: BlindControlsProps) {
  const currentBlind = getCurrentBlindLevel(currentLevel, blindStructure)
  const nextBlind = getNextBlindLevel(currentLevel, blindStructure)

  const isUrgent = seconds < 60
  const isWarning = seconds < 300 && !isUrgent

  return (
    <YStack
      backgroundColor="$glass2"
      borderColor="$glass4"
      borderWidth={1}
      borderRadius="$6"
      padding="$3"
      gap="$3"
      {...props}
    >
      {/* Titre */}
      <XStack gap="$2" alignItems="center">
        <TrendingUp size={18} color="$primary" />
        <Text color="$colorPrimary" fontSize="$4" fontWeight="700">
          Contrôle des Blindes
        </Text>
      </XStack>


      <XStack gap="$2" alignItems="center" justifyContent="space-evenly">
        {/* Left panel */}
        <YStack gap="$2" alignItems="center">
          {/* Niveau actuel */}
          <YStack gap="$2" alignItems="center">
            <Text color="$colorTertiary" fontSize="$4" fontWeight="600" textTransform="uppercase">
              Niveau {currentBlind.level}
            </Text>
            <XStack gap="$2" alignItems="center">
              <YStack
                backgroundColor="$goldBg"
                borderColor="$primary"
                borderWidth={2}
                borderRadius="$4"
                paddingHorizontal="$3"
                paddingVertical="$2"
              >
                <Text
                  fontFamily="$mono"
                  fontSize="$6"
                  fontWeight="900"
                  color="$primary"
                  textAlign="center"
                >
                  {currentBlind.smallBlind}/{currentBlind.bigBlind}
                </Text>
                {currentBlind.ante > 0 && (
                  <Text
                    fontFamily="$mono"
                    fontSize="$2"
                    color="$primary"
                    textAlign="center"
                    opacity={0.8}
                  >
                    Ante {currentBlind.ante}
                  </Text>
                )}
              </YStack>

              {currentBlind.isBreak && (
                <YStack
                  backgroundColor="$warningBg"
                  borderColor="$warning"
                  borderWidth={1}
                  borderRadius="$3"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                >
                  <Text color="$warning" fontSize="$2" fontWeight="700">
                    PAUSE
                  </Text>
                </YStack>
              )}
            </XStack>
          </YStack>
          {/* Niveau suivant */}
          {nextBlind && (
            <YStack gap="$1">
              <Text color="$colorTertiary" fontSize="$2" fontWeight="600" textTransform="uppercase">
                Prochain niveau
              </Text>
              <Text
                fontFamily="$mono"
                fontSize="$3"
                fontWeight="700"
                color="$colorSecondary"
              >
                {nextBlind.smallBlind}/{nextBlind.bigBlind}
                {nextBlind.ante > 0 && ` (Ante ${nextBlind.ante})`}
              </Text>
            </YStack>
          )}

        </YStack>
        {/* Right panel */}
        <YStack gap="$2">
          <GameTimer
            seconds={seconds}
            isRunning={isTimerRunning}
            isPaused={isPaused}
            nextBlind={nextBlind}
            onNextLevel={onNextLevel}
            disabled={disabled}
            progressPercentage={getProgressPercentage()}
            label={`LEVEL ${currentBlind.level || 1}`}
            onPause={onPause}
            onResume={onResume}
            size="md"
          />

        </YStack>

      </XStack>

      {/* Info durée */}
      <Text
        color="$colorTertiary"
        fontSize="$3"
        textAlign="center"
        opacity={0.7}
      >
        Durée du niveau : {currentBlind.duration} min
      </Text>
    </YStack>
  )
}
