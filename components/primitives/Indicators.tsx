import React from 'react';
import { XStack, YStack, Circle, styled } from 'tamagui';
import type { StackProps } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 🏷️ BADGE - Badges de statut
// ═══════════════════════════════════════════════════════════════════

export const Badge = styled(XStack, {
    name: 'Badge',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '$2.5',
    paddingVertical: '$1',
    borderRadius: '$round',
    gap: '$1.5',
    
    variants: {
        variant: {
            success: {
                backgroundColor: '$successBg',
                borderWidth: 1,
                borderColor: '$success',
            },
            danger: {
                backgroundColor: '$dangerBg',
                borderWidth: 1,
                borderColor: '$danger',
            },
            warning: {
                backgroundColor: '$warningBg',
                borderWidth: 1,
                borderColor: '$warning',
            },
            info: {
                backgroundColor: '$infoBg',
                borderWidth: 1,
                borderColor: '$info',
            },
            gold: {
                backgroundColor: '$goldBg',
                borderWidth: 1,
                borderColor: '$primary',
            },
            neutral: {
                backgroundColor: '$surface3',
                borderWidth: 1,
                borderColor: '$borderColor',
            },
        },
        size: {
            sm: {
                height: 20,
                paddingHorizontal: '$2',
            },
            md: {
                height: 24,
                paddingHorizontal: '$2.5',
            },
            lg: {
                height: 28,
                paddingHorizontal: '$3',
            },
        },
    } as const,
    
    defaultVariants: {
        variant: 'neutral',
        size: 'md',
    },
});

// ═══════════════════════════════════════════════════════════════════
// 🔘 DOT - Point indicateur
// ═══════════════════════════════════════════════════════════════════

export const Dot = styled(Circle, {
    name: 'Dot',
    
    variants: {
        variant: {
            success: { backgroundColor: '$success' },
            danger: { backgroundColor: '$danger' },
            warning: { backgroundColor: '$warning' },
            info: { backgroundColor: '$info' },
            gold: { backgroundColor: '$primary' },
            neutral: { backgroundColor: '$colorMuted' },
        },
        size: {
            sm: { width: 6, height: 6 },
            md: { width: 8, height: 8 },
            lg: { width: 10, height: 10 },
        },
    } as const,
    
    defaultVariants: {
        variant: 'neutral',
        size: 'md',
    },
});

// ═══════════════════════════════════════════════════════════════════
// 🎯 AVATAR - Avatar avec status
// ═══════════════════════════════════════════════════════════════════

export const Avatar = styled(YStack, {
    name: 'Avatar',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$surface4',
    borderRadius: '$round',
    overflow: 'hidden',
    position: 'relative',
    
    variants: {
        size: {
            xs: { width: 24, height: 24 },
            sm: { width: 32, height: 32 },
            md: { width: 40, height: 40 },
            lg: { width: 48, height: 48 },
            xl: { width: 64, height: 64 },
            '2xl': { width: 80, height: 80 },
        },
    } as const,
    
    defaultVariants: {
        size: 'md',
    },
});
