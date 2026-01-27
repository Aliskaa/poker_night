import React from 'react';
import { Button as TamaguiButton, styled } from 'tamagui';
import type { ButtonProps as TamaguiButtonProps } from '@tamagui/button';

// ═══════════════════════════════════════════════════════════════════
// 🎮 BUTTON - Système de boutons avec variants
// ═══════════════════════════════════════════════════════════════════

export const Button = styled(TamaguiButton, {
    name: 'Button',
    fontFamily: '$body',
    fontWeight: '700',
    borderRadius: '$5',
    animation: 'quick',
    
    variants: {
        variant: {
            primary: {
                backgroundColor: '$primary',
                color: '$night900',
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: '$primaryHover',
                },
                pressStyle: {
                    backgroundColor: '$primaryPress',
                    scale: 0.97,
                },
            },
            secondary: {
                backgroundColor: '$surface3',
                color: '$colorPrimary',
                borderWidth: 1,
                borderColor: '$borderColor',
                hoverStyle: {
                    backgroundColor: '$surface4',
                    borderColor: '$borderColorHover',
                },
                pressStyle: {
                    backgroundColor: '$surface5',
                    scale: 0.97,
                },
            },
            success: {
                backgroundColor: '$success',
                color: '$white',
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: '$successHover',
                },
                pressStyle: {
                    backgroundColor: '$successPress',
                    scale: 0.97,
                },
            },
            danger: {
                backgroundColor: '$danger',
                color: '$white',
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: '$dangerHover',
                },
                pressStyle: {
                    backgroundColor: '$dangerPress',
                    scale: 0.97,
                },
            },
            warning: {
                backgroundColor: '$warning',
                color: '$night900',
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: '$warningHover',
                },
                pressStyle: {
                    backgroundColor: '$warningPress',
                    scale: 0.97,
                },
            },
            ghost: {
                backgroundColor: 'transparent',
                color: '$colorSecondary',
                borderWidth: 0,
                hoverStyle: {
                    backgroundColor: '$backgroundHover',
                    color: '$colorPrimary',
                },
                pressStyle: {
                    backgroundColor: '$backgroundPress',
                    scale: 0.97,
                },
            },
            glass: {
                backgroundColor: '$glass3',
                color: '$colorPrimary',
                borderWidth: 1,
                borderColor: '$borderColor',
                hoverStyle: {
                    backgroundColor: '$glass4',
                    borderColor: '$borderColorHover',
                },
                pressStyle: {
                    backgroundColor: '$glass5',
                    scale: 0.97,
                },
            },
        },
        size: {
            sm: {
                height: 32,
                paddingHorizontal: '$3',
                fontSize: '$3',
            },
            md: {
                height: 40,
                paddingHorizontal: '$4',
                fontSize: '$4',
            },
            lg: {
                height: 48,
                paddingHorizontal: '$5',
                fontSize: '$5',
            },
            xl: {
                height: 56,
                paddingHorizontal: '$6',
                fontSize: '$6',
            },
        },
    } as const,
    
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});
