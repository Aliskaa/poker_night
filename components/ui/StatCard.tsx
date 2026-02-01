import { YStack, XStack, Text, type YStackProps, type XStackProps } from 'tamagui'
import { TrendingUp, TrendingDown, Minus } from '@tamagui/lucide-icons'
import { Label } from './Typography'

interface StatCardProps extends Omit<YStackProps, 'children'> {
  label: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  color?: '$primary' | '$secondary' | '$success' | '$danger' | '$warning' | '$gold' | '$muted'
  icon?: React.ReactNode
}

export function StatCard({
  label,
  value,
  subtitle,
  trend,
  trendValue,
  color = '$primary',
  icon,
  ...props
}: StatCardProps) {
  const trendConfig = {
    up: { icon: TrendingUp, color: '$success' as const, bg: '$successBg' },
    down: { icon: TrendingDown, color: '$danger' as const, bg: '$dangerBg' },
    stable: { icon: Minus, color: '$colorTertiary' as const, bg: '$glass2' },
  }

  const TrendIcon = trend ? trendConfig[trend].icon : null

  return (
    <YStack
      backgroundColor="$glass2"
      borderColor="$glass4"
      borderWidth={1}
      borderRadius="$6"
      padding="$3"
      gap="$2"
      flex={1}
      minWidth={140}
      {...props}
    >
      {/* Label + Icon */}
      <XStack justifyContent="space-between" alignItems="center">
        <Label color={color}>{label}</Label>
        {icon && <YStack opacity={0.6}>{icon}</YStack>}
      </XStack>

      {/* Valeur principale */}
      <Text color={color} fontSize="$7" fontWeight="900" fontFamily="$mono">
        {value}
      </Text>

      {/* Subtitle ou Tendance */}
      {(subtitle || trend) && (
        <XStack gap="$2" alignItems="center">
          {trend && TrendIcon && (
            <XStack
              backgroundColor={trendConfig[trend].bg}
              borderColor={trendConfig[trend].color}
              borderWidth={1}
              borderRadius="$3"
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              gap="$1"
              alignItems="center"
            >
              <TrendIcon size={12} color={trendConfig[trend].color} />
              {trendValue && (
                <Label color={trendConfig[trend].color} fontSize="$1" fontWeight="700">
                  {trendValue}
                </Label>
              )}
            </XStack>
          )}
          {subtitle && (
            <Label color="$colorTertiary" fontSize="$2" opacity={0.8}>
              {subtitle}
            </Label>
          )}
        </XStack>
      )}
    </YStack>
  )
}

interface StatRowProps extends Omit<XStackProps, 'children'> {
  label: string
  value: string | number
  color?: string
  highlight?: boolean
}

export function StatRow({ label, value, color = '$colorSecondary', highlight = false, ...props }: StatRowProps) {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingVertical="$2"
      paddingHorizontal="$3"
      backgroundColor={highlight ? '$glass2' : 'transparent'}
      borderRadius="$4"
      {...props}
    >
      <Text color="$colorTertiary" fontSize="$3" fontWeight="600">
        {label}
      </Text>
      <Text color={color} fontSize="$4" fontWeight="700" fontFamily="$mono">
        {value}
      </Text>
    </XStack>
  )
}
