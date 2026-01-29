// components/poker/HandRow.tsx
import React from 'react';
import { Card, Text, XStack, YStack } from 'tamagui';
import { PokerHand } from '@/constants/poker';
import { MiniCard } from './MiniCard';

export function HandRow({ hand }: { hand: PokerHand }) {
    const isTop3 = hand.rank <= 3;

    return (
        <Card
            bordered
            backgroundColor={isTop3 ? "rgba(251, 191, 36, 0.1)" : "rgba(255, 255, 255, 0.05)"}
            borderColor={isTop3 ? "$primary" : "rgba(255, 255, 255, 0.1)"}
            borderWidth={1}
        >
            <Card.Header padded gap="$3">
                {/* Titre et Rang */}
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" gap="$3">
                        <YStack
                            width={28} height={28} borderRadius={14}
                            backgroundColor={isTop3 ? "$primary" : "rgba(255,255,255,0.1)"}
                            justifyContent="center" alignItems="center"
                        >
                            <Text color={isTop3 ? "$backgroundStrong" : "white"} fontWeight="900" fontSize="$3">#{hand.rank}</Text>
                        </YStack>
                        <Text color={isTop3 ? "$primary" : "white"} fontWeight="bold" fontSize="$5">{hand.name}</Text>
                    </XStack>
                </XStack>

                {/* Description */}
                <Text color="rgba(255,255,255,0.6)" fontSize="$3">{hand.desc}</Text>

                {/* VISUALISATION DES CARTES */}
                <XStack gap="$2" marginTop="$2" justifyContent="flex-start">
                    {hand.cards.map((card, idx) => (
                        <MiniCard key={idx} value={card.v} suit={card.s} />
                    ))}
                </XStack>
            </Card.Header>
        </Card>
    );
}