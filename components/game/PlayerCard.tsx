import type { Player } from '@/types/Player'
import { Lock, Plus, Trophy, UserX } from '@tamagui/lucide-icons'
import { Avatar, Button, ButtonProps, Card, Text, XStack, YStack } from 'tamagui'
import { StatusBadge, type PlayerStatus } from '../ui/StatusBadge'
import { ChipStack } from '../ui/ChipStack'
import { IconButton } from '../ui/IconButton'
import log from '@/services/logger'
import { hapticFeedback } from '@/services/haptics'

interface PlayerCardProps {
    player: Player
    defaultBuyIn: number
    isLateRegOpen: boolean
    onRebuy: () => void
    onEliminate: () => void
}

export function PlayerCard({
    player,
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
                            size="$10"
                            borderWidth={2}
                            borderColor={isEliminated ? 'transparent' : '$success'}
                        >
                            <Avatar.Image src={player.avatarUrl} />
                            <Avatar.Fallback backgroundColor="$glass3" />
                        </Avatar>

                        <YStack gap="$2" flex={1}>
                            {/* Nom + Status */}
                            <XStack gap="$2" alignItems="center" flexWrap="wrap">
                                <Text
                                    color={isEliminated ? '$text60' : '$text95'}
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
                                <Text color="$text60" fontSize="$2">
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
                            <IconButton
                                icon={isLateRegOpen ? <Plus size={15} /> : <Lock size={15} color="$night900" />}
                                backgroundColor={isLateRegOpen ? '$success' : '$glass2'}
                                borderColor={isLateRegOpen ? '$success' : '$glass4'}
                                borderWidth={1}
                                color={isLateRegOpen ? '$backgroundStrong' : '$text60'}
                                disabled={!isLateRegOpen}
                                onPress={async () => {
                                    await hapticFeedback.placeBet()
                                    onRebuy()
                                }}
                                opacity={isLateRegOpen ? 1 : 0.5}
                                size="medium"
                            />
                            <IconButton
                                icon={<UserX size={15} />}
                                backgroundColor="$danger"
                                color="$backgroundStrong"
                                onPress={async () => {
                                    await hapticFeedback.eliminated()
                                    onEliminate()
                                }}
                                size="medium"
                            />
                        </XStack>
                    )}
                </XStack>
            </Card.Header>
        </Card>
    )
}