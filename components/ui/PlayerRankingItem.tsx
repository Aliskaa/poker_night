import { YStack, XStack, Text, Avatar, type YStackProps } from 'tamagui'
import { Trophy, TrendingUp } from '@tamagui/lucide-icons'
import { formatCurrency, formatPercentage } from '@/utils/statsHelpers'

interface PlayerRankingItemProps extends Omit<YStackProps, 'children'> {
  rank: number
  userId: string
  name: string
  avatarUrl?: string
  gamesPlayed: number
  netProfit: number
  roi: number
  wins: number
  isCurrentUser?: boolean
}

export function PlayerRankingItem({
  rank,
  name,
  avatarUrl,
  gamesPlayed,
  netProfit,
  roi,
  wins,
  isCurrentUser = false,
  ...props
}: PlayerRankingItemProps) {
  const getRankBadge = () => {
    if (rank === 1) return { emoji: '🥇', color: '$primary', bg: '$goldBg' }
    if (rank === 2) return { emoji: '🥈', color: '$colorSecondary', bg: '$glass3' }
    if (rank === 3) return { emoji: '🥉', color: '$warning', bg: '$warningBg' }
    return { emoji: `#${rank}`, color: '$colorTertiary', bg: '$glass2' }
  }

  const rankBadge = getRankBadge()

  return (
    <XStack
      backgroundColor={isCurrentUser ? '$goldBg' : '$glass2'}
      borderColor={isCurrentUser ? '$primary' : '$glass4'}
      borderWidth={isCurrentUser ? 2 : 1}
      borderRadius="$6"
      padding="$3"
      gap="$3"
      alignItems="center"
      animation="quick"
      pressStyle={{ scale: 0.98 }}
      {...props}
    >
      {/* Rang */}
      <YStack
        backgroundColor={rankBadge.bg}
        borderColor={rankBadge.color}
        borderWidth={1}
        borderRadius="$5"
        width={40}
        height={40}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="$4" fontWeight="900">
          {rankBadge.emoji}
        </Text>
      </YStack>

      {/* Avatar + Nom */}
      <XStack gap="$2" alignItems="center" flex={1}>
        <Avatar circular size="$6" borderWidth={2} borderColor="$glass4">
          <Avatar.Image src={avatarUrl} />
          <Avatar.Fallback backgroundColor="$glass3" />
        </Avatar>

        <YStack gap="$1" flex={1}>
          <XStack gap="$2" alignItems="center">
            <Text color="$colorPrimary" fontSize="$4" fontWeight="700">
              {name}
            </Text>
            {isCurrentUser && (
              <Text color="$primary" fontSize="$3" fontWeight="700">
                (Vous)
              </Text>
            )}
          </XStack>
          <XStack gap="$2" alignItems="center">
            <Text color="$colorTertiary" fontSize="$2">
              {gamesPlayed} partie{gamesPlayed > 1 ? 's' : ''}
            </Text>
            {wins > 0 && (
              <>
                <Text color="$colorTertiary" fontSize="$2">
                  •
                </Text>
                <XStack gap="$1" alignItems="center">
                  <Trophy size={12} color="$primary" />
                  <Text color="$primary" fontSize="$2" fontWeight="700">
                    {wins}
                  </Text>
                </XStack>
              </>
            )}
          </XStack>
        </YStack>
      </XStack>

      {/* Stats */}
      <YStack gap="$1" alignItems="flex-end">
        <Text
          color={netProfit >= 0 ? '$success' : '$danger'}
          fontSize="$5"
          fontWeight="900"
          fontFamily="$mono"
        >
          {formatCurrency(netProfit)}
        </Text>
        <XStack gap="$1" alignItems="center">
          <TrendingUp size={12} color={roi >= 0 ? '$success' : '$danger'} />
          <Text
            color={roi >= 0 ? '$success' : '$danger'}
            fontSize="$2"
            fontWeight="700"
          >
            {formatPercentage(roi)}
          </Text>
        </XStack>
      </YStack>
    </XStack>
  )
}
