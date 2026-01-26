import React from 'react';
import { Button, Text, YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';

export const PokerButton = ({ icon, title, subtitle, onPress, variant = 'gold' }: any) => {
    const isGold = variant === 'gold';

    // Couleurs Or ou Métal sombre
    const gradientColors = isGold
        ? ['#fcd34d', '#d97706'] as const // Jaune vers Orange (Or)
        : ['#374151', '#111827'] as const; // Gris clair vers Gris foncé

    const textColor = isGold ? '#451a03' : '#e5e7eb';
    const borderColor = isGold ? '#f59e0b' : '#4b5563';

    return (
        <Button
            onPress={onPress}
            padding={0}
            overflow="hidden"
            height={80} // Plus haut
            borderRadius="$6"
            borderWidth={1}
            borderColor={borderColor}
            pressStyle={{ scale: 0.97, opacity: 0.9 }}
            elevation={5} // Ombre Android
            shadowColor="black" // Ombre iOS
            shadowOpacity={0.5}
            shadowRadius={5}
            shadowOffset={{ width: 0, height: 4 }}
        >
            <LinearGradient
                colors={gradientColors}
                style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, padding: 15 }}
            >
                <YStack
                    backgroundColor="rgba(0,0,0,0.2)"
                    padding="$2"
                    borderRadius="$10"
                    borderColor="rgba(255,255,255,0.2)"
                    borderWidth={1}
                >
                    {React.cloneElement(icon, { color: textColor, size: 24 })}
                </YStack>

                <YStack flex={1}>
                    <Text color={textColor} fontFamily="$body" fontWeight="900" fontSize="$5" textTransform="uppercase">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text color={textColor} opacity={0.8} fontSize="$2" fontWeight="600">
                            {subtitle}
                        </Text>
                    )}
                </YStack>
            </LinearGradient>
        </Button>
    );
};