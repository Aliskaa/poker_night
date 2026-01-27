import React from 'react';
import { Card as TamaguiCard, CardProps as TamaguiCardProps } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 🃏 GLASS CARD - Carte avec effet verre
// ═══════════════════════════════════════════════════════════════════

export interface GlassCardProps extends TamaguiCardProps {
    /** Niveau de transparence du verre (1-6) */
    glassLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Bordure visible */
    bordered?: boolean;
    /** Activer l'effet hover */
    hoverable?: boolean;
    /** Activer l'effet pressable */
    pressable?: boolean;
}

export const GlassCard = ({
    glassLevel = 2,
    bordered = true,
    hoverable = false,
    pressable = false,
    children,
    ...props
}: GlassCardProps) => {
    const glassLevelMap = {
        1: '$glass1',
        2: '$glass2',
        3: '$glass3',
        4: '$glass4',
        5: '$glass5',
        6: '$glass6',
    };

    return (
        <TamaguiCard
            backgroundColor={glassLevelMap[glassLevel]}
            borderColor={bordered ? '$borderColor' : 'transparent'}
            borderWidth={bordered ? 1 : 0}
            borderRadius="$5"
            padding="$4"
            hoverStyle={hoverable ? {
                backgroundColor: '$backgroundHover',
                borderColor: '$borderColorHover',
            } : undefined}
            pressStyle={pressable ? {
                backgroundColor: '$backgroundPress',
                scale: 0.98,
            } : undefined}
            animation="quick"
            {...props}
        >
            {children}
        </TamaguiCard>
    );
};
