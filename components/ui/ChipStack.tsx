import { XStack, Text, type XStackProps } from 'tamagui'
import { Coins } from '@tamagui/lucide-icons'

type ChipStackVariant = 'default' | 'pot' | 'stack' | 'rebuy'
type ChipStackSize = 'sm' | 'md' | 'lg'

interface ChipStackProps extends Omit<XStackProps, 'children'> {
  amount: number
  variant?: ChipStackVariant
  size?: ChipStackSize
  showIcon?: boolean
  currency?: string
}

const VARIANT_CONFIG = {
  default: {
    bg: '$glass2',
    borderColor: '$glass4',
    color: '$colorPrimary',
  },
  pot: {
    bg: '$goldBg',
    borderColor: '$primary',
    color: '$primary',
  },
  stack: {
    bg: '$successBg',
    borderColor: '$success',
    color: '$success',
  },
  rebuy: {
    bg: '$warningBg',
    borderColor: '$warning',
    color: '$warning',
  },
} as const

const SIZE_CONFIG = {
  sm: {
    paddingHorizontal: '$2',
    paddingVertical: '$1',
    fontSize: '$3',
    iconSize: 14,
    borderRadius: '$4',
  },
  md: {
    paddingHorizontal: '$3',
    paddingVertical: '$2',
    fontSize: '$5',
    iconSize: 16,
    borderRadius: '$5',
  },
  lg: {
    paddingHorizontal: '$4',
    paddingVertical: '$2.5',
    fontSize: '$7',
    iconSize: 20,
    borderRadius: '$6',
  },
} as const

export function ChipStack({ 
  amount, 
  variant = 'default',
  size = 'md',
  showIcon = true,
  currency = '€',
  ...props 
}: ChipStackProps) {
  const variantConfig = VARIANT_CONFIG[variant]
  const sizeConfig = SIZE_CONFIG[size]
  
  // Formater le montant avec espaces pour les milliers
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount)

  return (
    <XStack
      backgroundColor={variantConfig.bg}
      borderColor={variantConfig.borderColor}
      borderWidth={1}
      paddingHorizontal={sizeConfig.paddingHorizontal}
      paddingVertical={sizeConfig.paddingVertical}
      borderRadius={sizeConfig.borderRadius}
      gap="$2"
      alignItems="center"
      alignSelf="flex-start"
      {...props}
    >
      {showIcon && (
        <Coins size={sizeConfig.iconSize} color={variantConfig.color} />
      )}
      <Text 
        fontFamily="$mono" 
        fontSize={sizeConfig.fontSize}
        fontWeight="700"
        color={variantConfig.color}
      >
        {formattedAmount}{currency}
      </Text>
    </XStack>
  )
}
