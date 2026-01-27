import React from 'react';
import { ImageBackground } from 'react-native';
import { YStack } from 'tamagui';
import type { YStackProps } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 🎴 POKER BACKGROUND - Fond poker avec texture
// ═══════════════════════════════════════════════════════════════════

interface PokerBackgroundProps extends YStackProps {
    children: React.ReactNode;
    /** Utiliser une image de fond personnalisée */
    source?: any;
}

export const PokerBackground = ({ 
    children, 
    source,
    ...props 
}: PokerBackgroundProps) => {
    if (source) {
        return (
            <ImageBackground
                source={source}
                style={{ flex: 1 }}
                resizeMode="cover"
            >
                <YStack flex={1} backgroundColor="$overlay4" {...props}>
                    {children}
                </YStack>
            </ImageBackground>
        );
    }

    // Fond dégradé par défaut sans image
    return (
        <YStack 
            flex={1} 
            backgroundColor="$background"
            {...props}
        >
            {children}
        </YStack>
    );
};
