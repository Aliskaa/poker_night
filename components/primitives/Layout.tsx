import React from 'react';
import { XStack, YStack, Text, styled } from 'tamagui';
import type { StackProps, TextProps } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 📦 CONTAINER - Conteneurs sémantiques
// ═══════════════════════════════════════════════════════════════════

/** Conteneur principal avec padding */
export const Container = styled(YStack, {
    name: 'Container',
    flex: 1,
    paddingHorizontal: '$4',
    paddingVertical: '$4',
});

/** Section avec espacement vertical */
export const Section = styled(YStack, {
    name: 'Section',
    gap: '$3',
    marginBottom: '$6',
});

/** Ligne horizontale avec items alignés */
export const Row = styled(XStack, {
    name: 'Row',
    alignItems: 'center',
    gap: '$3',
});

/** Grille flexible */
export const Grid = styled(YStack, {
    name: 'Grid',
    gap: '$3',
});

// ═══════════════════════════════════════════════════════════════════
// 📝 TYPOGRAPHY - Composants texte sémantiques
// ═══════════════════════════════════════════════════════════════════

export const Title = styled(Text, {
    name: 'Title',
    fontFamily: '$heading',
    fontWeight: '800',
    color: '$colorPrimary',
    letterSpacing: -0.5,
    
    variants: {
        size: {
            sm: { fontSize: '$5', lineHeight: '$5' },
            md: { fontSize: '$7', lineHeight: '$7' },
            lg: { fontSize: '$9', lineHeight: '$9' },
            xl: { fontSize: '$11', lineHeight: '$11' },
        },
    } as const,
    
    defaultVariants: {
        size: 'md',
    },
});

export const Heading = styled(Text, {
    name: 'Heading',
    fontFamily: '$heading',
    fontWeight: '700',
    color: '$colorPrimary',
    letterSpacing: -0.3,
    
    variants: {
        size: {
            sm: { fontSize: '$4', lineHeight: '$4' },
            md: { fontSize: '$6', lineHeight: '$6' },
            lg: { fontSize: '$8', lineHeight: '$8' },
        },
    } as const,
    
    defaultVariants: {
        size: 'md',
    },
});

export const Label = styled(Text, {
    name: 'Label',
    fontFamily: '$body',
    fontWeight: '600',
    fontSize: '$3',
    color: '$colorSecondary',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
});

export const Body = styled(Text, {
    name: 'Body',
    fontFamily: '$body',
    fontWeight: '400',
    color: '$colorSecondary',
    lineHeight: '$4',
    
    variants: {
        size: {
            sm: { fontSize: '$2' },
            md: { fontSize: '$3' },
            lg: { fontSize: '$4' },
        },
        variant: {
            primary: { color: '$colorPrimary' },
            secondary: { color: '$colorSecondary' },
            muted: { color: '$colorMuted' },
            dim: { color: '$colorDim' },
        },
    } as const,
    
    defaultVariants: {
        size: 'md',
        variant: 'secondary',
    },
});

export const Caption = styled(Text, {
    name: 'Caption',
    fontFamily: '$body',
    fontSize: '$2',
    color: '$colorMuted',
    lineHeight: '$2',
});

export const Mono = styled(Text, {
    name: 'Mono',
    fontFamily: '$mono',
    fontSize: '$3',
    color: '$colorSecondary',
});
