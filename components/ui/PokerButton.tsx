import React from 'react'
import { Button, GetThemeValueForKey, Text, YStack } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import type { ReactElement } from 'react'
import type { ButtonProps as TamaguiButtonProps } from 'tamagui'
import { hapticFeedback } from '@/services/haptics'

type PokerButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'

interface PokerButtonProps extends Omit<TamaguiButtonProps, 'children' | 'variant'> {
  icon: ReactElement
  title: string
  fontsizeTitle?: "unset" | GetThemeValueForKey<"fontSize">
  subtitle?: string
  onPress?: () => void
  variant?: PokerButtonVariant
  haptic?: boolean
}

const VARIANT_CONFIG = {
  primary: {
    gradientColors: ['#fcd34d', '#d97706'] as const,
    textColor: '#0b0f19',
    borderColor: '#f59e0b',
  },
  secondary: {
    gradientColors: ['#475569', '#1e293b'] as const,
    textColor: '#f1f5f9',
    borderColor: '#475569',
  },
  success: {
    gradientColors: ['#34d399', '#059669'] as const,
    textColor: '#052e16',
    borderColor: '#10b981',
  },
  danger: {
    gradientColors: ['#f87171', '#dc2626'] as const,
    textColor: '#450a0a',
    borderColor: '#ef4444',
  },
} as const

export const PokerButton = ({ 
  icon, 
  title,
  fontsizeTitle,
  subtitle, 
  onPress, 
  variant = 'primary',
  haptic = true,
  ...props
}: PokerButtonProps) => {
  const config = VARIANT_CONFIG[variant]

  const handlePress = async () => {
    if (haptic) {
      await hapticFeedback.medium()
    }
    onPress?.()
  }

  return (
    <Button
      onPress={handlePress}
      padding={0}
      overflow="hidden"
      height={80}
      borderRadius="$7"
      borderWidth={1}
      borderColor={config.borderColor}
      pressStyle={{ scale: 0.97 }}
      animation="smooth"
      elevation={8}
      shadowColor="$overlay8"
      shadowOpacity={0.4}
      shadowRadius={8}
      shadowOffset={{ width: 0, height: 4 }}
      {...props}
    >
      <LinearGradient
        colors={config.gradientColors}
        style={{ 
          flex: 1, 
          width: '100%', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'row', 
          gap: 12, 
          padding: 16 
        }}
      >
        <YStack
          backgroundColor="$overlay2"
          padding="$2.5"
          borderRadius="$round"
          borderColor="$glass3"
          borderWidth={1}
        >
          {React.cloneElement(icon, { color: config.textColor, size: 26 } as any)}
        </YStack>

        <YStack flex={1}>
          <Text 
            color={config.textColor} 
            fontFamily="$heading" 
            fontWeight="900" 
            fontSize={fontsizeTitle ?? '$5'}
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              color={config.textColor} 
              opacity={0.85} 
              fontSize="$2" 
              fontWeight="600"
            >
              {subtitle}
            </Text>
          )}
        </YStack>
      </LinearGradient>
    </Button>
  )
}