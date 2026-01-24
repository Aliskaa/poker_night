import { Player } from '@/types/Player';
import { Lock, Plus, Trophy, UserX } from '@tamagui/lucide-icons';
import React from 'react';
import { Avatar, Button, Card, H4, Text, XStack, YStack } from 'tamagui';

export function PlayerCard({ player, defaultBuyIn, isLateRegOpen, onRebuy, onEliminate }: { player: Player, defaultBuyIn: number, isLateRegOpen: boolean, onRebuy: () => void, onEliminate: () => void }) {
    const isEliminated = player.status === 'ELIMINATED';

    return (
        <Card
            bordered
            // Les éliminés deviennent transparents/sombres, les actifs ressortent
            backgroundColor={isEliminated ? "$background" : "$backgroundStrong"}
            borderColor={isEliminated ? "$borderColor" : "$borderColor"}
            opacity={isEliminated ? 0.6 : 1}
        >
            <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">

                <XStack gap="$3" alignItems="center" flex={1}>
                    <Avatar circular size="$4" borderColor={isEliminated ? "$borderColor" : "$success"} borderWidth={2}>
                        <Avatar.Fallback backgroundColor="$background" />
                    </Avatar>
                    <YStack>
                        <H4 color={isEliminated ? "$colorMuted" : "$color"} textDecorationLine={isEliminated ? 'line-through' : 'none'}>
                            {player.name}
                        </H4>
                        <Text color="$colorMuted" fontSize="$2">
                            Misé : {String(player.totalInvested)}€ ({String(player.buyInCount)} caves)
                        </Text>
                    </YStack>
                </XStack>

                {isEliminated ? (
                    <XStack alignItems="center" gap="$1" backgroundColor="$backgroundStrong" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                        <Trophy size={14} color="$colorMuted" />
                        <Text color="$colorMuted" fontWeight="bold">Rang {String(player.finalRank)}</Text>
                    </XStack>
                ) : (
                    <XStack gap="$2">
                        <Button
                            size="$3"
                            circular
                            icon={isLateRegOpen ? <Plus size={18} /> : <Lock size={16} />} // Cadenas si fermé
                            backgroundColor={isLateRegOpen ? "$success" : "$gray8"} // Gris si fermé
                            color="white"
                            disabled={!isLateRegOpen} // Désactivé si fermé
                            onPress={onRebuy}
                            opacity={isLateRegOpen ? 1 : 0.6}
                        />
                        <Button size="$3" circular icon={<UserX size={16} />} backgroundColor="$danger" color="white" onPress={onEliminate} />
                    </XStack>
                )}
            </Card.Header>
        </Card>
    );
}