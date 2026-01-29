import { XStack, Text, type XStackProps } from 'tamagui'
import { Check, X, Plus } from '@tamagui/lucide-icons'

export type PlayerStatus = 'ACTIVE' | 'ELIMINATED' | 'REBUY'

interface StatusBadgeProps extends Omit<XStackProps, 'children'> {
  status: PlayerStatus
  showIcon?: boolean
}

const STATUS_CONFIG = {
  ACTIVE: {
    bg: '$successBg',
    borderColor: '$success',
    color: '$success',
    label: 'Actif',
    icon: Check,
  },
  ELIMINATED: {
    bg: '$dangerBg',
    borderColor: '$danger',
    color: '$danger',
    label: 'Éliminé',
    icon: X,
  },
  REBUY: {
    bg: '$warningBg',
    borderColor: '$warning',
    color: '$warning',
    label: 'Rebuy',
    icon: Plus,
  },
} as const

export function StatusBadge({ status, showIcon = true, ...props }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <XStack
      backgroundColor={config.bg}
      borderColor={config.borderColor}
      borderWidth={1}
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$4"
      gap="$1.5"
      alignItems="center"
      alignSelf="flex-start"
      {...props}
    >
      {showIcon && <Icon size={12} color={config.color} />}
      <Text 
        color={config.color} 
        fontSize="$2" 
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {config.label}
      </Text>
    </XStack>
  )
}
