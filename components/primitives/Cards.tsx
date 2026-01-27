import React from 'react';
import { YStack, XStack, styled } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 🎴 CARD - Carte de contenu
// ═══════════════════════════════════════════════════════════════════

export const Card = styled(YStack, {
    name: 'Card',
    backgroundColor: '$backgroundCard',
    borderRadius: '$5',
    padding: '$4',
    gap: '$3',
    borderWidth: 1,
    borderColor: '$borderColor',
    
    variants: {
        variant: {
            default: {
                backgroundColor: '$backgroundCard',
            },
            glass: {
                backgroundColor: '$glass3',
                borderColor: '$borderColor',
            },
            elevated: {
                backgroundColor: '$backgroundCard',
                shadowColor: '$shadowColor',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
            },
            outlined: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$borderColor',
            },
        },
        glassLevel: {
            1: { backgroundColor: '$glass1' },
            2: { backgroundColor: '$glass2' },
            3: { backgroundColor: '$glass3' },
            4: { backgroundColor: '$glass4' },
            5: { backgroundColor: '$glass5' },
            6: { backgroundColor: '$glass6' },
        },
        hoverable: {
            true: {
                hoverStyle: {
                    backgroundColor: '$backgroundCardHover',
                    borderColor: '$borderColorHover',
                },
                pressStyle: {
                    scale: 0.98,
                },
                animation: 'quick',
            },
        },
        pressable: {
            true: {
                pressStyle: {
                    scale: 0.98,
                    backgroundColor: '$backgroundPress',
                },
                animation: 'quick',
            },
        },
        padding: {
            none: { padding: 0 },
            sm: { padding: '$2' },
            md: { padding: '$4' },
            lg: { padding: '$6' },
        },
    } as const,
    
    defaultVariants: {
        variant: 'default',
        padding: 'md',
    },
});

// Alias pour rétrocompatibilité
export const GlassCard = Card;

export const CardHeader = styled(YStack, {
    name: 'CardHeader',
    gap: '$1',
});

export const CardBody = styled(YStack, {
    name: 'CardBody',
    gap: '$2',
    flex: 1,
});

export const CardFooter = styled(XStack, {
    name: 'CardFooter',
    gap: '$2',
    alignItems: 'center',
    justifyContent: 'space-between',
});

// ═══════════════════════════════════════════════════════════════════
// 📋 LIST - Composants de liste
// ═══════════════════════════════════════════════════════════════════

export const List = styled(YStack, {
    name: 'List',
    gap: '$2',
});

export const ListItem = styled(XStack, {
    name: 'ListItem',
    alignItems: 'center',
    gap: '$3',
    padding: '$3',
    borderRadius: '$4',
    backgroundColor: 'transparent',
    
    variants: {
        hoverable: {
            true: {
                hoverStyle: {
                    backgroundColor: '$backgroundHover',
                },
                pressStyle: {
                    backgroundColor: '$backgroundPress',
                    scale: 0.98,
                },
                animation: 'quick',
            },
        },
    } as const,
});

// ═══════════════════════════════════════════════════════════════════
// 🎪 DIVIDER - Séparateur
// ═══════════════════════════════════════════════════════════════════

export const Divider = styled(YStack, {
    name: 'Divider',
    height: 1,
    backgroundColor: '$borderColor',
    marginVertical: '$3',
    
    variants: {
        orientation: {
            horizontal: {
                height: 1,
                width: '100%',
            },
            vertical: {
                width: 1,
                height: '100%',
            },
        },
        spacing: {
            sm: { marginVertical: '$2' },
            md: { marginVertical: '$3' },
            lg: { marginVertical: '$4' },
        },
    } as const,
    
    defaultVariants: {
        orientation: 'horizontal',
        spacing: 'md',
    },
});
