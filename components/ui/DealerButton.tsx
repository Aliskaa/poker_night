import React from 'react';
import { Button, Text, YStack, XStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from '@tamagui/lucide-icons';

export const DealerButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <Button
            onPress={onPress}
            unstyled // On retire le style par défaut de Tamagui
            scale={0.9}
            pressStyle={{ scale: 0.85, opacity: 0.9 }} // Effet d'enfoncement réaliste
        >
            {/* OMBRE PORTÉE SOUS LE JETON */}
            <YStack
                width={180} height={180} borderRadius={90}
                backgroundColor="black" opacity={0.3}
                position="absolute" top={10} left={0}
            />

            {/* LE CORPS DU JETON (Dégradé Or/Blanc) */}
            <LinearGradient
                colors={['#fef3c7', '#f59e0b', '#b45309']} // Blanc -> Or -> Bronze
                start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}
                style={{
                    width: 180, height: 180, borderRadius: 90,
                    justifyContent: 'center', alignItems: 'center',
                    borderWidth: 1, borderColor: '$white'
                }}
            >
                {/* CERCLE INTERNE (Effet strie) */}
                <YStack
                    width={150} height={150} borderRadius={75}
                    borderWidth={4} borderColor="$glass5" borderStyle="dashed"
                    justifyContent="center" alignItems="center"
                    backgroundColor="$gold600"
                >
                    {/* TEXTE CENTRAL */}
                    <YStack alignItems="center">
                        <Text color="$white" fontSize="$2" fontWeight="bold" letterSpacing={2} opacity={0.8}>START</Text>
                        <Text color="$white" fontSize="$9" fontWeight="900" letterSpacing={-1} lineHeight={60}>GAME</Text>
                        <Play size={24} color="white" fill="white" style={{ marginTop: 5 }} />
                    </YStack>
                </YStack>
            </LinearGradient>
        </Button>
    );
};