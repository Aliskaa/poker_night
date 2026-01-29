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
    backgroundColor="$glass2"
    borderColor="$glass4"
    borderWidth={1}
    pressStyle={{ 
      backgroundColor: '$glass3',
      borderColor: '$glass5',
    }}
    hoverStyle={{
      backgroundColor: '$glass3',
    }}
    animation="quick"
    onPress={onPress}
    padding="$3"
    {...props}
  >
    <XStack alignItems="center" gap="$3">
      <YStack 
        backgroundColor="$overlay3" 
        padding="$2" 
        borderRadius="$5"
      >
        {React.cloneElement(icon, { color: '$primary', size: 20 })}
      </YStack>
      <YStack flex={1}>
        <Text 
          color="$colorPrimary" 
          fontWeight="700" 
          fontSize="$4"
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            color="$colorTertiary" 
            fontSize="$2"
          >
            {subtitle}
          </Text>
        )}
      </YStack>
      {showChevron && (
        <ChevronRight 
          color="$colorMuted" 
          size={20} 
        />
      )}
    </XStack>
  </Card>
)