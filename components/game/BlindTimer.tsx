import { XStack, YStack, Text, Button, type XStackProps } from 'tamagui'
import { Timer, Play, Pause, RotateCcw } from '@tamagui/lucide-icons'
import { IconButton } from '../ui/IconButton'

interface BlindTimerProps extends Omit<XStackProps, 'children'> {
  seconds: number
  isRunning: boolean
  onToggle: () => void
  onReset?: () => void
  showResetButton?: boolean
}

export function BlindTimer({ 
  seconds, 
  isRunning,
  onToggle,
  onReset,
  showResetButton = false,
  ...props 
}: BlindTimerProps) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  // Détection urgence : <1min = rouge pulsant
  const isUrgent = seconds < 60
  const isWarning = seconds < 300 && !isUrgent

  return (
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
        {minutes}:{secs.toString().padStart(2, '0')}
      </Text>
      
      <XStack gap="$2">
        <IconButton
          icon={isRunning ? Pause : Play}
          backgroundColor={isRunning ? '$warning' : '$success'}
          color="$night900"
          onPress={onToggle}
        />
        
        {showResetButton && onReset && (
          <IconButton 
            icon={RotateCcw}
            backgroundColor="$glass3"
            borderColor="$glass5"
            color="$colorSecondary"
            onPress={onReset}
          />
        )}
      </XStack>
    </XStack>
  )
}

// Composant compact pour affichage dans header
export function BlindTimerCompact({ 
  seconds, 
  isRunning,
  ...props 
}: Omit<BlindTimerProps, 'onToggle' | 'onReset'> & { onToggle?: () => void }) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isUrgent = seconds < 60

  return (
    <XStack
      backgroundColor={isUrgent ? '$dangerBg' : '$glass2'}
      borderColor={isUrgent ? '$danger' : '$primary'}
      borderWidth={1}
      borderRadius="$5"
      paddingHorizontal="$2.5"
      paddingVertical="$1.5"
      gap="$2"
      alignItems="center"
      {...props}
    >
      <Timer size={14} color={isUrgent ? '$danger' : '$primary'} />
      <Text 
        fontFamily="$mono" 
        fontSize="$4" 
        fontWeight="700"
        color={isUrgent ? '$danger' : '$primary'}
      >
        {minutes}:{secs.toString().padStart(2, '0')}
      </Text>
      {isRunning && (
        <YStack 
          width={6} 
          height={6} 
          borderRadius="$round"
          backgroundColor={isUrgent ? '$danger' : '$success'}
          animation="quick"
        />
      )}
    </XStack>
  )
}
