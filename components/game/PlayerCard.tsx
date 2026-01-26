import { Player } from '@/types/Player';
import { Lock, Plus, Trophy, UserX } from '@tamagui/lucide-icons';
import React from 'react';
import { Avatar, Button, Card, H4, Text, XStack, YStack } from 'tamagui';

export function PlayerCard({ player, defaultBuyIn, isLateRegOpen, onRebuy, onEliminate }: { player: Player, defaultBuyIn: number, isLateRegOpen: boolean, onRebuy: () => void, onEliminate: () => void }) {
    const isEliminated = player.status === 'ELIMINATED';

    return (
        <Card
            bordered
            // Actif : Verre clair. Éliminé : Verre sombre quasi invisible.
            backgroundColor={isEliminated ? "rgba(0,0,0,0.2)" : "rgba(255, 255, 255, 0.05)"}
            borderColor={isEliminated ? "transparent" : "rgba(255, 255, 255, 0.1)"}
            opacity={isEliminated ? 0.5 : 1}
        >
            <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">

                <XStack gap="$3" alignItems="center" flex={1}>
                    <Avatar circular size="$4" borderColor={isEliminated ? "transparent" : "$success"} borderWidth={2}>
                        <Avatar.Fallback backgroundColor="rgba(0,0,0,0.3)" />
                    </Avatar>
                    <YStack>
                        <H4 color={isEliminated ? "rgba(255,255,255,0.4)" : "white"} textDecorationLine={isEliminated ? 'line-through' : 'none'}>
                            {player.name}
                        </H4>
                        <Text color="rgba(255,255,255,0.5)" fontSize="$2">
                            Misé : {String(player.totalInvested)}€ ({String(player.buyInCount)} caves)
                        </Text>
                    </YStack>
                </XStack>

                {isEliminated ? (
                    <XStack alignItems="center" gap="$1" backgroundColor="rgba(0,0,0,0.3)" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                        <Trophy size={14} color="rgba(255,255,255,0.5)" />
                        <Text color="rgba(255,255,255,0.5)" fontWeight="bold">Rang {String(player.finalRank)}</Text>
                    </XStack>
                ) : (
                    <XStack gap="$2">
                        <Button
                            size="$3"
                            circular
                            icon={isLateRegOpen ? <Plus size={18} /> : <Lock size={16} />}
                            backgroundColor={isLateRegOpen ? "$success" : "rgba(255,255,255,0.1)"}
                            color="white"
                            disabled={!isLateRegOpen}
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