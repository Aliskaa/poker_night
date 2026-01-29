import { XStack, YStack, Button, type YStackProps } from 'tamagui'
import { ChevronLeft, HelpCircle, Share } from '@tamagui/lucide-icons'
import { BlindLevelCompact } from './BlindLevel'
import { BlindTimerCompact } from './BlindTimer'
import { CountdownBadge } from '../ui/CountdownBadge'

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

  return (
    <YStack
      backgroundColor="$backgroundStrong"
      borderBottomWidth={1}
      borderBottomColor="$glass4"
      paddingTop="$10"
      paddingBottom="$3"
      paddingHorizontal="$4"
      gap="$3"
      {...props}
    >
      {/* Ligne 1 : Navigation + Actions */}
      <XStack justifyContent="space-between" alignItems="center">
        <Button 
          size="$3" 
          circular 
          icon={<ChevronLeft size={20} />}
          backgroundColor="$glass2"
          borderColor="$glass4"
          borderWidth={1}
          color="$colorPrimary"
          pressStyle={{ scale: 0.9 }}
          onPress={onBackPress}
        />
        
        <XStack gap="$2">
          {onHelpPress && (
            <Button 
              size="$3" 
              circular 
              icon={<HelpCircle size={18} />}
              backgroundColor="$glass2"
              borderColor="$glass4"
              borderWidth={1}
              color="$colorSecondary"
              pressStyle={{ scale: 0.9 }}
              onPress={onHelpPress}
            />
          )}
          {onSharePress && (
            <Button 
              size="$3" 
              circular 
              icon={<Share size={18} />}
              backgroundColor="$glass2"
              borderColor="$glass4"
              borderWidth={1}
              color="$colorSecondary"
              pressStyle={{ scale: 0.9 }}
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
            label="Late Reg"
            size="sm"
          />
        )}
      </XStack>
    </YStack>
  )
}
