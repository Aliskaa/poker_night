import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, H2, Text, Theme, YStack } from 'tamagui';
import { ChevronLeft, Trophy } from '@tamagui/lucide-icons';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { HAND_RANKINGS } from '@/constants/poker';
import { HandRow } from '@/components/poker/HandRow';

export default function HandRankingScreen() {
    const router = useRouter();

    return (
        <Theme name="dark">
            <PokerBackground>
                <YStack flex={1} paddingTop="$5">

                    <YStack paddingHorizontal="$4" marginBottom="$4">
                        <Button 
                            size="$3" circular icon={<ChevronLeft size={20} color="white" />} 
                            backgroundColor="$borderColor" borderColor="rgba(255,255,255,0.2)" borderWidth={1} 
                            onPress={() => router.back()} alignSelf="flex-start" marginBottom="$2"
                        />
                        <YStack alignItems="center">
                            <Trophy size={40} color="$potGold" />
                            <H2 color="white" fontWeight="900" marginTop="$2" textAlign="center">Combinaisons</H2>
                            <Text color="$colorMuted" textAlign="center">De la plus forte à la plus faible</Text>
                        </YStack>
                    </YStack>

                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        <YStack padding="$4" gap="$4">
                            {HAND_RANKINGS.map((hand) => (
                                <HandRow key={hand.rank} hand={hand} />
                            ))}
                        </YStack>
                    </ScrollView>
                </YStack>
            </PokerBackground>
        </Theme>
    );
}