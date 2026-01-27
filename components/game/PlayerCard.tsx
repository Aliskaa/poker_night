import React from 'react';
import { XStack, YStack, Circle } from 'tamagui';
import { Plus, UserX, Trophy, Lock } from '@tamagui/lucide-icons';
import { Card, CardHeader, Row } from '@/components/primitives';
import { Heading, Body, Caption } from '@/components/primitives/Layout';
import { Badge, Avatar, Dot } from '@/components/primitives/Indicators';
import { Button } from '@/components/primitives/Button';
import type { Player } from '@/types/Player';

// ═══════════════════════════════════════════════════════════════════
// 👤 PLAYER CARD - Carte joueur refactorisée
// ═══════════════════════════════════════════════════════════════════

interface PlayerCardProps {
    player: Player;
    defaultBuyIn: number;
    isLateRegOpen: boolean;
    onRebuy: () => void;
    onEliminate: () => void;
}

export function PlayerCard({ 
    player, 
    defaultBuyIn, 
    isLateRegOpen, 
    onRebuy, 
    onEliminate 
}: PlayerCardProps) {
    const isEliminated = player.status === 'ELIMINATED';
    const isActive = player.status === 'ACTIVE';

    return (
        <Card
            variant={isEliminated ? 'outlined' : 'glass'}
            opacity={isEliminated ? 0.6 : 1}
            padding="md"
        >
            <Row justifyContent="space-between">
                {/* Avatar + Info */}
                <Row flex={1} gap="$3">
                    {/* Avatar avec indicateur de statut */}
                    <YStack position="relative">
                        <Avatar 
                            size="lg"
                            backgroundColor="$surface4"
                            borderWidth={isActive ? 2 : 0}
                            borderColor={isActive ? '$success' : 'transparent'}
                        >
                            {/* Initiales */}
                            <Heading size="sm" color="$colorPrimary">
                                {player.name.substring(0, 2).toUpperCase()}
                            </Heading>
                        </Avatar>
                        
                        {/* Dot de statut en bas à droite */}
                        {isActive && (
                            <Circle
                                size={12}
                                backgroundColor="$success"
                                borderWidth={2}
                                borderColor="$background"
                                position="absolute"
                                bottom={-2}
                                right={-2}
                            />
                        )}
                    </YStack>

                    {/* Nom + Stats */}
                    <YStack flex={1} gap="$1">
                        <Heading 
                            size="sm"
                            color={isEliminated ? '$colorMuted' : '$colorPrimary'}
                            textDecorationLine={isEliminated ? 'line-through' : 'none'}
                        >
                            {player.name}
                        </Heading>
                        <Row gap="$2">
                            <Caption>
                                Misé: {player.totalInvested}€
                            </Caption>
                            <Caption color="$colorDim">•</Caption>
                            <Caption>
                                {player.buyInCount} cave{player.buyInCount > 1 ? 's' : ''}
                            </Caption>
                        </Row>
                    </YStack>
                </Row>

                {/* Actions / Statut */}
                {isEliminated ? (
                    <Badge variant="neutral" size="md">
                        <Trophy size={14} color="$colorMuted" />
                        <Body size="sm" variant="muted" fontWeight="700">
                            #{player.finalRank}
                        </Body>
                    </Badge>
                ) : (
                    <Row gap="$2">
                        {/* Bouton Recave */}
                        <Button
                            variant={isLateRegOpen ? 'success' : 'ghost'}
                            size="sm"
                            circular
                            icon={isLateRegOpen ? <Plus size={18} /> : <Lock size={16} />}
                            disabled={!isLateRegOpen}
                            onPress={onRebuy}
                        />
                        
                        {/* Bouton Éliminer */}
                        <Button
                            variant="danger"
                            size="sm"
                            circular
                            icon={<UserX size={16} />}
                            onPress={onEliminate}
                        />
                    </Row>
                )}
            </Row>
        </Card>
    );
}
