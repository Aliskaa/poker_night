import React from 'react'
import { Card, Text, XStack, YStack, type CardProps } from 'tamagui'
import { ChevronRight } from '@tamagui/lucide-icons'
import type { ReactElement } from 'react'

interface GlassCardProps extends Omit<CardProps, 'children'> {
  icon: ReactElement
  title: string
  subtitle?: string
  onPress?: () => void
  showChevron?: boolean
}

export const GlassCard = ({ 
  icon, 
  title, 
  subtitle, 
  onPress,
  showChevron = true,
  ...props 
}: GlassCardProps) => (
  <Card
    bordered
    backgroundColor="$glass3"
    borderColor="$glass5"
    borderWidth={1}
    pressStyle={{ 
      backgroundColor: '$glass4',
      borderColor: '$glass6',
      scale: 0.98,
    }}
    hoverStyle={{
      backgroundColor: '$glass4',
      borderColor: '$glass6',
    }}
    animation="quick"
    onPress={onPress}
    padding="$3.5"
    elevation={2}
    shadowColor="$overlay5"
    shadowOpacity={0.2}
    shadowRadius={8}
    {...props}
  >
    <XStack alignItems="center" gap="$3">
      <YStack 
        backgroundColor="rgba(251, 191, 36, 0.15)" 
        padding="$2.5" 
        borderRadius="$6"
        borderWidth={1}
        borderColor="rgba(251, 191, 36, 0.3)"
      >
        {React.cloneElement(icon, { color: '$primary', size: 22 } as any)}
      </YStack>
      <YStack flex={1}>
        <Text 
          color="$text95" 
          fontWeight="700" 
          fontSize="$4"
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            color="$text60" 
            fontSize="$2"
            marginTop="$0.5"
          >
            {subtitle}
          </Text>
        )}
      </YStack>
      {showChevron && (
        <ChevronRight 
          color="$text40" 
          size={20} 
        />
      )}
    </XStack>
  </Card>
)