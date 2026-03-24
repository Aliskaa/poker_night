import { XStack, YStack, Button, type YStackProps } from 'tamagui'
import { ChevronLeft, HelpCircle, Share } from '@tamagui/lucide-icons'
import { BlindLevelCompact } from './BlindLevel'
import { BlindTimerCompact } from './BlindTimer'
import { CountdownBadge } from '../ui/CountdownBadge'
import { IconButton } from '../ui/IconButton'
import { Platform } from 'react-native'

interface GameStatusBarProps extends Omit<YStackProps, 'children'> {
  // Blinds
  currentSmallBlind: number
  currentBigBlind: number
  currentAnte?: number
  
  // Timer
  timerSeconds: number
  isTimerRunning: boolean
  
  // Late Registration
  lateRegSeconds?: number | null
  lateRegLimit?: number
  
  // Actions
  onBackPress?: () => void
  onHelpPress?: () => void
  onSharePress?: () => void
}

export function GameStatusBar({
  currentSmallBlind,
  currentBigBlind,
  currentAnte = 0,
  timerSeconds,
  isTimerRunning,
  lateRegSeconds,
  lateRegLimit = 0,
  onBackPress,
  onHelpPress,
  onSharePress,
  ...props
}: GameStatusBarProps) {
  const isLateRegOpen = lateRegLimit > 0 && lateRegSeconds !== null && lateRegSeconds !== undefined && lateRegSeconds > 0
  const topSpacing = Platform.OS === 'web' ? '$6' : '$10'

  return (
    <YStack
      backgroundColor="$backgroundStrong"
      borderBottomWidth={1}
      borderBottomColor="$glass4"
      paddingTop={topSpacing}
      paddingBottom="$3"
      paddingHorizontal="$4"
      gap="$3"
      {...props}
    >
      {/* Ligne 1 : Navigation + Actions */}
      <XStack justifyContent="space-between" alignItems="center">
        <IconButton
          icon={<ChevronLeft size={20} />}
          backgroundColor="$glass2"
          borderColor="$glass4"
          color="$colorPrimary"
          onPress={onBackPress}
        />
        
        <XStack gap="$2">
          {onHelpPress && (
            <IconButton
              icon={<HelpCircle size={20} />}
              backgroundColor="$glass2"
              borderColor="$glass4"
              color="$colorSecondary"
              onPress={onHelpPress}
            />
          )}
          {onSharePress && (
            <IconButton
              icon={<Share size={18} />}
              backgroundColor="$glass2"
              borderColor="$glass4"
              color="$colorSecondary"
              onPress={onSharePress}
            />
          )}
        </XStack>
      </XStack>
      
      {/* Ligne 2 : Infos vitales */}
      <XStack gap="$3" flexWrap="wrap" alignItems="center">
        {/* Niveau de blindes */}
        <BlindLevelCompact
          currentSmallBlind={currentSmallBlind}
          currentBigBlind={currentBigBlind}
          currentAnte={currentAnte}
        />
        
        {/* Timer */}
        <BlindTimerCompact
          seconds={timerSeconds}
          isRunning={isTimerRunning}
        />
        
        {/* Late Registration */}
        {isLateRegOpen && lateRegSeconds !== null && lateRegSeconds !== undefined && (
          <CountdownBadge
            seconds={lateRegSeconds}
            label="Late reg"

          />
        )}
      </XStack>
    </YStack>
  )
}
