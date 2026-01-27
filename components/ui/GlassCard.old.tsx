import React from 'react';
import { Card, Text, XStack, YStack } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';

export const GlassCard = ({ icon, title, subtitle, onPress }: any) => (
    <Card
        bordered
        backgroundColor="rgba(255, 255, 255, 0.05)" // Très transparent
        borderColor="rgba(255, 255, 255, 0.1)"
        pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        onPress={onPress}
        padding="$3"
    >
        <XStack alignItems="center" gap="$3">
            <YStack backgroundColor="rgba(0,0,0,0.3)" padding="$2" borderRadius="$4">
                {React.cloneElement(icon, { color: '#fbbf24', size: 20 })}
            </YStack>
            <YStack flex={1}>
                <Text color="white" fontWeight="bold" fontSize="$4">{title}</Text>
                <Text color="rgba(255,255,255,0.5)" fontSize="$2">{subtitle}</Text>
            </YStack>
            <ChevronRight color="rgba(255,255,255,0.3)" size={20} />
        </XStack>
    </Card>
);