// components/poker/MiniCard.tsx
import React from 'react';
import { Text, YStack } from 'tamagui';
import { Club, Diamond, Heart, Spade } from '@tamagui/lucide-icons';
import { Suit } from '@/constants/poker';

export function MiniCard({ value, suit }: { value: string, suit: Suit }) {
    const isRed = suit === 'hearts' || suit === 'diamonds';

    const getIcon = (s: Suit, size: number) => {
        switch (s) {
            case 'hearts': return <Heart size={size} color="$danger" fill="currentColor" />;
            case 'diamonds': return <Diamond size={size} color="$danger" fill="currentColor" />;
            case 'clubs': return <Club size={size} color="$night900" fill="currentColor" />;
            case 'spades': return <Spade size={size} color="$night900" fill="currentColor" />;
            default: return null;
        }
    };

    return (
        <YStack
            width={36} height={50}
            backgroundColor="#f5f5f5"
            borderRadius="$2"
            alignItems="center" justifyContent="center"
            borderColor="#e5e5e5" borderWidth={1}
            shadowColor="black" shadowOpacity={0.2} shadowRadius={2}
        >
            <Text color={isRed ? "$danger" : "$night900"} fontWeight="900" fontSize="$4" lineHeight={16}>
                {value}
            </Text>
            <YStack marginTop={2}>
                {getIcon(suit, 14)}
            </YStack>
        </YStack>
    );
}