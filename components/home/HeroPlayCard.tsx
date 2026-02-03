import React from 'react';
import { Card, H2, Text, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Spade } from '@tamagui/lucide-icons';

export function HeroPlayCard({ onPress }: { onPress: () => void }) {
    return (
        <Card
            bordered
            borderWidth={0}
            overflow="hidden"
            onPress={onPress}
            pressStyle={{ scale: 0.98, opacity: 0.9 }}
            elevation={10}
            shadowColor="$gold400" // Ombre dorée
            shadowOpacity={0.2}
            shadowRadius={20}
            height={140} // Belle hauteur
            backgroundColor="transparent"
        >
            {/* FOND : DÉGRADÉ PREMIUM OR/NOIR */}
            <LinearGradient
                // Un dégradé diagonal Or -> Noir profond
                colors={['#fbbf24', '#b45309', '#1c1917']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            {/* TEXTURE EN FILIGRANE (Optionnel pour le style) */}
            <YStack position="absolute" right={-17} bottom={-20} opacity={0.1} rotate="-15deg">
                <Spade size={140} color="black" fill="black" />
            </YStack>

            <Card.Header padded flex={1} justifyContent="center">
                <XStack alignItems="center" justifyContent="space-between">

                    <YStack gap="$1">
                        <XStack alignItems="center" gap="$2" backgroundColor="$overlay9" alignSelf="flex-start" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                            <Text color="$text95" fontSize="$2" fontWeight="bold" letterSpacing={1} textTransform="uppercase">
                                Texas Hold'em
                            </Text>
                        </XStack>

                        <H2 color="$text95" fontWeight="900" fontSize="$9" letterSpacing={-1}>
                            JOUER
                        </H2>
                        <Text color="$text80" fontSize="$4" fontWeight="600">
                            Lancer une nouvelle table
                        </Text>
                    </YStack>

                    {/* GROS BOUTON PLAY CIRCULAIRE À DROITE */}
                    <YStack
                        width={64} height={64}
                        borderRadius={32}
                        backgroundColor="white"
                        alignItems="center" justifyContent="center"
                        elevation={5}
                        shadowColor="black" shadowOpacity={0.3} shadowRadius={10}
                    >
                        <Play size={32} color="#b45309" fill="#b45309" style={{ marginLeft: 4 }} />
                    </YStack>

                </XStack>
            </Card.Header>
        </Card>
    );
}