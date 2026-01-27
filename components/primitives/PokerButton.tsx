import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Button as TamaguiButton, YStack, XStack } from 'tamagui';
import { Heading, Caption } from '@/components/primitives/Layout';
import { Avatar } from '@/components/primitives/Indicators';

// ═══════════════════════════════════════════════════════════════════
// 🎮 POKER BUTTON - Bouton avec gradient pour actions principales
// ═══════════════════════════════════════════════════════════════════

interface PokerButtonProps {
    icon: React.ReactElement;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    variant?: 'gold' | 'dark';
    disabled?: boolean;
}

export const PokerButton = ({ 
    icon, 
    title, 
    subtitle, 
    onPress,
    variant = 'gold',
    disabled = false,
}: PokerButtonProps) => {
    const isGold = variant === 'gold';

    const gradientColors = isGold
        ? ['#fcd34d', '#d97706'] as const  // Gold gradient
        : ['#374151', '#111827'] as const; // Dark gradient

    const textColor = isGold ? '$night900' : '$text90';
    const borderColor = isGold ? '$gold500' : '$slate600';

    return (
        <TamaguiButton
            onPress={onPress}
            padding={0}
            overflow="hidden"
            height={80}
            borderRadius="$7"
            borderWidth={2}
            borderColor={borderColor}
            pressStyle={{ scale: 0.97, opacity: 0.9 }}
            disabled={disabled}
            opacity={disabled ? 0.5 : 1}
            shadowColor="$shadowColor"
            shadowOpacity={0.3}
            shadowRadius={8}
            shadowOffset={{ width: 0, height: 4 }}
            elevation={4}
            animation="quick"
        >
            <LinearGradient
                colors={gradientColors}
                style={{ 
                    flex: 1, 
                    width: '100%', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingHorizontal: 20,
                }}
            >
                <XStack alignItems="center" gap="$3" width="100%">
                    <Avatar 
                        size="md" 
                        backgroundColor="$overlay2"
                        borderWidth={1}
                        borderColor="$glass4"
                    >
                        {React.cloneElement(icon, { 
                            color: textColor, 
                            size: 24 
                        })}
                    </Avatar>

                    <YStack flex={1} alignItems="flex-start">
                        <Heading 
                            size="md" 
                            color={textColor}
                            textTransform="uppercase"
                            letterSpacing={0.5}
                        >
                            {title}
                        </Heading>
                        {subtitle && (
                            <Caption color={isGold ? '$night700' : '$text60'}>
                                {subtitle}
                            </Caption>
                        )}
                    </YStack>
                </XStack>
            </LinearGradient>
        </TamaguiButton>
    );
};
