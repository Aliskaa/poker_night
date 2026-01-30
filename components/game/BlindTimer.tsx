import { Timer } from '@tamagui/lucide-icons'
import { Text, XStack, YStack, type XStackProps } from 'tamagui'

interface BlindTimerProps extends Omit<XStackProps, 'children'> {
  seconds: number
  isRunning: boolean
  showResetButton?: boolean
}

// Composant compact pour affichage dans header
export function BlindTimerCompact({
  seconds,
  isRunning,
  ...props
}: BlindTimerProps) {
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
