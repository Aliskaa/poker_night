import React from 'react';
import { Circle } from 'tamagui';
import { Body } from '@/components/primitives/Layout';

// ═══════════════════════════════════════════════════════════════════
// 🎯 DEALER BUTTON - Bouton dealer pour le poker
// ═══════════════════════════════════════════════════════════════════

interface DealerButtonProps {
    size?: number;
}

export const DealerButton = ({ size = 32 }: DealerButtonProps) => (
    <Circle
        size={size}
        backgroundColor="$primary"
        borderWidth={2}
        borderColor="$night900"
        alignItems="center"
        justifyContent="center"
        shadowColor="$shadowColor"
        shadowOpacity={0.4}
        shadowRadius={4}
        shadowOffset={{ width: 0, height: 2 }}
        elevation={3}
    >
        <Body 
            size="sm" 
            variant="primary"
            color="$night900" 
            fontWeight="900"
        >
            D
        </Body>
    </Circle>
);
