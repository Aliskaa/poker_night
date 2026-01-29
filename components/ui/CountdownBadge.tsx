import { XStack, Text, type XStackProps } from 'tamagui'
import { Clock, AlertCircle } from '@tamagui/lucide-icons'
import { useEffect, useState } from 'react'

type CountdownVariant = 'default' | 'urgent' | 'warning'

interface CountdownBadgeProps extends Omit<XStackProps, 'children'> {
  seconds: number
  autoDetectUrgent?: boolean
  urgentThreshold?: number
  warningThreshold?: number
  variant?: CountdownVariant
  showIcon?: boolean
  label?: string
}

export function CountdownBadge({ 
  seconds,
  autoDetectUrgent = true,
  urgentThreshold = 60,      // < 1min = urgent
  warningThreshold = 300,    // < 5min = warning
  variant: forcedVariant,
  showIcon = true,
  label,
  ...props 
}: CountdownBadgeProps) {
  // Détection automatique du variant selon le temps restant
  const getVariant = (): CountdownVariant => {
    if (forcedVariant) return forcedVariant
    if (!autoDetectUrgent) return 'default'
    
    if (seconds < urgentThreshold) return 'urgent'
    if (seconds < warningThreshold) return 'warning'
    return 'default'
  }

  const variant = getVariant()
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  const VARIANT_CONFIG = {
    default: {
      bg: '$infoBg',
      borderColor: '$info',
      color: '$info',
      icon: Clock,
    },
    warning: {
      bg: '$warningBg',
      borderColor: '$warning',
      color: '$warning',
      icon: Clock,
    },
    urgent: {
      bg: '$dangerBg',
      borderColor: '$danger',
      color: '$danger',
      icon: AlertCircle,
    },
  } as const

  const config = VARIANT_CONFIG[variant]
  const Icon = config.icon

  // Animation pulse pour urgent
  const [pulse, setPulse] = useState(false)
  
  useEffect(() => {
    if (variant === 'urgent') {
      const interval = setInterval(() => {
        setPulse(p => !p)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [variant])

  return (
    <XStack
      backgroundColor={config.bg}
      borderColor={config.borderColor}
      borderWidth={1}
      paddingHorizontal="$3"
      paddingVertical="$1.5"
      borderRadius="$5"
      gap="$2"
      alignItems="center"
      alignSelf="flex-start"
      animation="quick"
      opacity={variant === 'urgent' && pulse ? 0.7 : 1}
      {...props}
    >
      {showIcon && <Icon size={14} color={config.color} />}
      
      <XStack gap="$1" alignItems="center">
        {label && (
          <Text 
            color={config.color}
            fontSize="$2"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            {label}
          </Text>
        )}
        <Text 
          fontFamily="$mono"
          fontSize="$3"
          fontWeight="700"
          color={config.color}
        >
          {minutes}:{secs.toString().padStart(2, '0')}
        </Text>
      </XStack>
    </XStack>
  )
}

// Composant helper pour afficher "Fermé" quand le compte à rebours est terminé
export function CountdownOrClosed({ 
  seconds, 
  closedLabel = 'Fermé',
  ...props 
}: CountdownBadgeProps & { closedLabel?: string }) {
  if (seconds <= 0) {
    return (
      <XStack
        backgroundColor="$dangerBg"
        borderColor="$danger"
        borderWidth={1}
        paddingHorizontal="$3"
        paddingVertical="$1.5"
        borderRadius="$5"
        gap="$2"
        alignItems="center"
        alignSelf="flex-start"
        {...props}
      >
        <AlertCircle size={14} color="$danger" />
        <Text 
          color="$danger"
          fontSize="$2"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {closedLabel}
        </Text>
      </XStack>
    )
  }
  
  return <CountdownBadge seconds={seconds} {...props} />
}
