import React from 'react';
import { XStack, YStack, Circle } from 'tamagui';
import { 
    Coins, 
    HelpCircle, 
    Share as ShareIcon, 
    ChevronLeft, 
    Lock, 
    Infinity, 
    Timer 
} from '@tamagui/lucide-icons';
import { Row, Section, Heading, Body, Caption } from '@/components/primitives/Layout';
import { Badge, Dot } from '@/components/primitives/Indicators';
import { Button } from '@/components/primitives/Button';
import { Divider } from '@/components/primitives/Cards';

// ═══════════════════════════════════════════════════════════════════
// 🎮 GAME HEADER - En-tête de partie refactorisée
// ═══════════════════════════════════════════════════════════════════

interface GameHeaderProps {
    totalPot: number;
    defaultBuyIn: number;
    lateRegLimit: number;
    lateRegSeconds: number | null;
    onHelpPress: () => void;
    onSharePress: () => void;
    onBackPress: () => void;
}

export function GameHeader({ 
    totalPot, 
    defaultBuyIn, 
    lateRegLimit, 
    lateRegSeconds, 
    onHelpPress, 
    onSharePress, 
    onBackPress 
}: GameHeaderProps) {
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const renderLateRegBadge = () => {
        // Inscriptions infinies
        if (lateRegLimit === 0) {
            return (
                <Badge variant="success" size="md">
                    <Infinity size={14} color="$success" />
                    <Body size="sm" color="$success" fontWeight="700">
                        Ouvert
                    </Body>
                </Badge>
            );
        }
        
        // Compte à rebours actif
        if (lateRegSeconds !== null && lateRegSeconds > 0) {
            const isUrgent = lateRegSeconds < 300; // < 5 minutes
            return (
                <Badge variant={isUrgent ? 'warning' : 'success'} size="md">
                    <Timer size={14} color={isUrgent ? '$warning' : '$success'} />
                    <Body 
                        size="sm" 
                        color={isUrgent ? '$warning' : '$success'}
                        fontWeight="700"
                    >
                        {formatTime(lateRegSeconds)}
                    </Body>
                </Badge>
            );
        }
        
        // Inscriptions fermées
        return (
            <Badge variant="danger" size="md">
                <Lock size={14} color="$danger" />
                <Body size="sm" color="$danger" fontWeight="700">
                    Fermé
                </Body>
            </Badge>
        );
    };

    return (
        <YStack alignItems="center" paddingBottom="$4" paddingTop="$2" position="relative">
            {/* Bouton retour (gauche) */}
            <XStack position="absolute" top="$2" left="$4" zIndex="$1">
                <Button
                    variant="glass"
                    size="sm"
                    circular
                    icon={<ChevronLeft size={20} color="$colorPrimary" />}
                    onPress={onBackPress}
                />
            </XStack>

            {/* Boutons aide + partage (droite) */}
            <XStack position="absolute" top="$2" right="$4" gap="$2" zIndex="$1">
                <Button
                    variant="glass"
                    size="sm"
                    circular
                    icon={<HelpCircle size={18} color="$colorSecondary" />}
                    onPress={onHelpPress}
                />
                <Button
                    variant="glass"
                    size="sm"
                    circular
                    icon={<ShareIcon size={18} color="$colorSecondary" />}
                    onPress={onSharePress}
                />
            </XStack>

            {/* Pot total */}
            <Section alignItems="center" gap="$2" marginBottom="$2">
                <Caption textTransform="uppercase" letterSpacing={1.5}>
                    Pot Total
                </Caption>
                
                <Row alignItems="center" gap="$2">
                    <Coins size={40} color="$primary" />
                    <Heading 
                        size="xl" 
                        color="$primary"
                        fontWeight="900"
                        letterSpacing={-1.5}
                    >
                        {totalPot} €
                    </Heading>
                </Row>
            </Section>

            {/* Infos buy-in + late reg */}
            <Row alignItems="center" gap="$3">
                <Row alignItems="center" gap="$1.5">
                    <Coins size={14} color="$colorMuted" />
                    <Caption>
                        Buy-in: {defaultBuyIn}€
                    </Caption>
                </Row>
                
                <Divider 
                    orientation="vertical" 
                    spacing="sm"
                    height={14}
                    marginVertical={0}
                />
                
                <Row alignItems="center" gap="$2">
                    <Caption>Inscriptions:</Caption>
                    {renderLateRegBadge()}
                </Row>
            </Row>
        </YStack>
    );
}
