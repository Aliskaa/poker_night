import { BlindLevel as BlindLevelType, getCurrentBlindLevel, getNextBlindLevel } from '@/constants/blindStructures'
import { formatDuration } from '@/utils/timestampHelpers'
import { Pause, Play, SkipForward, Timer, TrendingUp } from '@tamagui/lucide-icons'
import { Text, XStack, YStack, type YStackProps } from 'tamagui'
import { IconButton } from '../ui/IconButton'
import { hapticFeedback } from '@/services/haptics'

interface BlindControlsProps extends Omit<YStackProps, 'children'> {
  seconds: number
  currentLevel: number
  isPaused: boolean
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

      {/* Niveau actuel */}
      <YStack gap="$2">
        <Text color="$colorTertiary" fontSize="$2" fontWeight="600" textTransform="uppercase">
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
          <Text color="$colorTertiary" fontSize="$1" fontWeight="600" textTransform="uppercase">
            Prochain niveau
          </Text>
          <Text
            fontFamily="$mono"
            fontSize="$3"
            fontWeight="700"
            color="$colorSecondary"
          >
            {nextBlind.smallBlind}/{nextBlind.bigBlind}
            {nextBlind.ante > 0 && (
              <Text color="$colorSecondary"> (Ante {nextBlind.ante})</Text>
            )}
          </Text>
        </YStack>
      )}






      <XStack
        backgroundColor={
          isUrgent ? '$dangerBg' :
            isWarning ? '$warningBg' :
              '$glass2'
        }
        borderColor={
          isUrgent ? '$danger' :
            isWarning ? '$warning' :
              '$glass4'
        }
        borderWidth={1}
        borderRadius="$6"
        paddingHorizontal="$3"
        paddingVertical="$2"
        gap="$3"
        alignItems="center"
        alignSelf="flex-start"
        animation="quick"
        {...props}
      >
        <Timer
          size={18}
          color={
            isUrgent ? '$danger' :
              isWarning ? '$warning' :
                '$colorPrimary'
          }
        />

        <Text
          fontFamily="$mono"
          fontSize="$6"
          fontWeight="900"
          color={
            isUrgent ? '$danger' :
              isWarning ? '$warning' :
                '$colorPrimary'
          }
          minWidth={60}
          textAlign="center"
        >
          {/* {minutes}:{secs.toString().padStart(2, '0')} */}
          {formatDuration(seconds, true)}
        </Text>

        <XStack gap="$2">
          {isPaused ? (
              <IconButton
                icon={<Play size={20} color="$night900" />}
                backgroundColor="$success"
                color="$night900"
                onPress={async () => {
                  await hapticFeedback.medium()
                  onResume()
                }}
                disabled={disabled}
                size="large"
              />
            ) : (
              <IconButton
                icon={<Pause size={20} color="$night900" />}
                backgroundColor="$warning"
                color="$night900"
                onPress={async () => {
                  await hapticFeedback.medium()
                  onPause()
                }}
                disabled={disabled}
                size="large"
              />
            )}

          <IconButton
            icon={<SkipForward size={20} color="$night900" />}
            backgroundColor="$primary"
            color="$night900"
            onPress={async () => {
              await hapticFeedback.blindLevelUp()
              onNextLevel()
            }}
            disabled={disabled || !nextBlind}
            size="large"
          />
        </XStack>
      </XStack>




      {/* Info durée */}
      <Text
        color="$colorTertiary"
        fontSize="$1"
        textAlign="center"
        opacity={0.7}
      >
        Durée du niveau : {currentBlind.duration} min
      </Text>
    </YStack>
  )
}
