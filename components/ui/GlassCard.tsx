import React from 'react';
import { XStack } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { GlassCard } from '@/components/primitives/GlassCard';
import { Row, Heading, Caption } from '@/components/primitives/Layout';
import { Avatar } from '@/components/primitives/Indicators';

// ═══════════════════════════════════════════════════════════════════
// 💎 GLASS CARD - Refactorisé avec primitives
// ═══════════════════════════════════════════════════════════════════

interface GlassCardComponentProps {
    icon: React.ReactElement;
    title: string;
    subtitle?: string;
    onPress?: () => void;
}

export const GlassCardComponent = ({ 
    icon, 
    title, 
    subtitle, 
    onPress 
}: GlassCardComponentProps) => (
    <GlassCard
        glassLevel={2}
        bordered
        hoverable
        pressable
        onPress={onPress}
    >
        <Row>
            <Avatar size="sm" backgroundColor="$overlay3">
                {React.cloneElement(icon, { 
                    color: '$primary', 
                    size: 20 
                })}
            </Avatar>
            
            <XStack flex={1} flexDirection="column" gap="$1">
                <Heading size="sm">{title}</Heading>
                {subtitle && <Caption>{subtitle}</Caption>}
            </XStack>
            
            <ChevronRight color="$colorMuted" size={20} />
        </Row>
    </GlassCard>
);
