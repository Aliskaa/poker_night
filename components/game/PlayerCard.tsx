import type { Player } from '@/types/Player'
import { Lock, Plus, Trophy, UserX } from '@tamagui/lucide-icons'
import { Avatar, Button, Card, Text, XStack, YStack } from 'tamagui'
import { StatusBadge, type PlayerStatus } from '../ui/StatusBadge'
import { ChipStack } from '../ui/ChipStack'

interface PlayerCardProps {
  player: Player
  defaultBuyIn: number
  isLateRegOpen: boolean
  onRebuy: () => void
  onEliminate: () => void
}

export function PlayerCard({ 
  player, 
  defaultBuyIn, 
  isLateRegOpen, 
  onRebuy, 
  onEliminate 
}: PlayerCardProps) {
  const isEliminated = player.status === 'ELIMINATED'

  return (
    <Card
      bordered
      backgroundColor={isEliminated ? '$overlay2' : '$glass2'}
      borderColor={isEliminated ? 'transparent' : '$glass4'}
      opacity={isEliminated ? 0.6 : 1}
      animation="quick"
      pressStyle={!isEliminated ? { backgroundColor: '$glass3' } : undefined}
    >
      <Card.Header padded>
        <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
          {/* Avatar + Info */}
          <XStack gap="$3" alignItems="center" flex={1}>
            <Avatar 
              circular 
              size="$5" 
              borderColor={isEliminated ? 'transparent' : '$success'} 
              borderWidth={2}
            >
              <Avatar.Image 
                src={player.avatarUrl} 
              />
              <Avatar.Fallback backgroundColor="$glass3" />
            </Avatar>
            
            <YStack gap="$2" flex={1}>
              {/* Nom + Status */}
              <XStack gap="$2" alignItems="center" flexWrap="wrap">
                <Text 
                  color={isEliminated ? '$colorTertiary' : '$colorPrimary'}
                  fontSize="$5"
                  fontWeight="700"
                  textDecorationLine={isEliminated ? 'line-through' : 'none'}
                  flex={1}
                >
                  {player.name}
                </Text>
                <StatusBadge status={player.status as PlayerStatus} />
              </XStack>
              
              {/* Chips invested */}
              <XStack gap="$2" flexWrap="wrap" alignItems="center">
                <ChipStack 
                  amount={player.totalInvested} 
                  variant="default"
                  size="sm"
                />
                <Text color="$colorTertiary" fontSize="$2">
                  {player.buyInCount} cave{player.buyInCount > 1 ? 's' : ''}
                </Text>
              </XStack>
            </YStack>
          </XStack>

          {/* Actions ou Ranking */}
          {isEliminated ? (
            <XStack 
              alignItems="center" 
              gap="$2" 
              backgroundColor="$dangerBg"
              borderColor="$danger"
              borderWidth={1}
              paddingHorizontal="$2.5" 
              paddingVertical="$1.5" 
              borderRadius="$5"
            >
              <Trophy size={14} color="$danger" />
              <Text color="$danger" fontWeight="700" fontSize="$3">
                #{player.finalRank}
              </Text>
            </XStack>
          ) : (
            <XStack gap="$2">
              <Button
                size="$3"
                circular
                icon={isLateRegOpen ? <Plus size={18} /> : <Lock size={16} />}
                backgroundColor={isLateRegOpen ? '$success' : '$glass2'}
                borderColor={isLateRegOpen ? '$success' : '$glass4'}
                borderWidth={1}
                color={isLateRegOpen ? '$night900' : '$colorTertiary'}
                disabled={!isLateRegOpen}
                onPress={onRebuy}
                opacity={isLateRegOpen ? 1 : 0.5}
                pressStyle={{ scale: 0.9 }}
              />
              <Button 
                size="$3" 
                circular 
                icon={<UserX size={16} />} 
                backgroundColor="$danger"
                color="$night900"
                pressStyle={{ scale: 0.9 }}
                onPress={onEliminate}
              />
            </XStack>
          )}
        </XStack>
      </Card.Header>
    </Card>
  )
}