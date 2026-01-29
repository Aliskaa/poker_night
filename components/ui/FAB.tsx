import { Button, type ButtonProps, YStack } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'
import type { ReactElement } from 'react'

type FABPosition = 'bottom-right' | 'bottom-center' | 'bottom-left'

interface FABProps extends Omit<ButtonProps, 'children' | 'position'> {
  icon?: ReactElement
  fabPosition?: FABPosition
  offset?: number
  label?: string
}

const POSITION_STYLES = {
  'bottom-right': {
    bottom: '$16',
    right: '$4',
  },
  'bottom-center': {
    bottom: '$16',
    left: '50%',
    transform: [{ translateX: -28 }], // Half of button size (56/2)
  },
  'bottom-left': {
    bottom: '$16',
    left: '$4',
  },
} as const

export function FAB({ 
  icon,
  fabPosition = 'bottom-right',
  offset = 0,
  label,
  onPress,
  ...props 
}: FABProps) {
  const positionStyle = POSITION_STYLES[fabPosition]
  const IconComponent = icon || <Plus size={28} color="$night900" />

  return (
    <YStack 
      position="absolute"
      zIndex="$5"
      {...positionStyle}
      {...(offset && fabPosition === 'bottom-right' && { bottom: offset })}
      {...(offset && fabPosition === 'bottom-left' && { bottom: offset })}
      {...(offset && fabPosition === 'bottom-center' && { bottom: offset })}
    >
      <Button
        size="$6"
        circular
        backgroundColor="$primary"
        borderWidth={0}
        elevation={10}
        shadowColor="$primary"
        shadowOpacity={0.4}
        shadowRadius={20}
        shadowOffset={{ width: 0, height: 4 }}
        pressStyle={{ 
          scale: 0.9,
          backgroundColor: '$primaryHover',
        }}
        hoverStyle={{
          backgroundColor: '$primaryHover',
          scale: 1.05,
        }}
        animation="bouncy"
        onPress={onPress}
        icon={IconComponent}
        {...props}
      >
        {label}
      </Button>
    </YStack>
  )
}

// Variant avec label pour desktop/tablet
export function FABWithLabel({ 
  icon,
  label,
  onPress,
  fabPosition = 'bottom-right',
  ...props 
}: FABProps) {
  const positionStyle = POSITION_STYLES[fabPosition]
  const IconComponent = icon || <Plus size={20} color="$night900" />

  return (
    <YStack 
      position="absolute"
      zIndex="$5"
      {...positionStyle}
    >
      <Button
        size="$5"
        backgroundColor="$primary"
        borderWidth={0}
        elevation={10}
        shadowColor="$primary"
        shadowOpacity={0.4}
        shadowRadius={20}
        shadowOffset={{ width: 0, height: 4 }}
        pressStyle={{ 
          scale: 0.95,
          backgroundColor: '$primaryHover',
        }}
        hoverStyle={{
          backgroundColor: '$primaryHover',
        }}
        animation="smooth"
        onPress={onPress}
        icon={IconComponent}
        borderRadius="$round"
        paddingHorizontal="$4"
        gap="$2"
        {...props}
      >
        {label && (
          <Button.Text 
            color="$night900" 
            fontWeight="700"
            fontSize="$4"
          >
            {label}
          </Button.Text>
        )}
      </Button>
    </YStack>
  )
}
