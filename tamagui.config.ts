import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { createAnimations } from '@tamagui/animations-react-native'
import { shorthands } from '@tamagui/shorthands'
import { tokens as defaultTokens } from '@tamagui/themes'

// --- 1. ANIMATIONS ---
const animations = createAnimations({
    bouncy: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
    lazy: { type: 'spring', damping: 20, stiffness: 60 },
    quick: { type: 'spring', damping: 15, mass: 1, stiffness: 200 },
    cardFlip: { type: 'spring', damping: 15, mass: 1, stiffness: 120 },
})

// --- 2. FONTS ---
const headingFont = createInterFont({
    size: {
        1: 12,
        2: 14,
        3: 16,
        4: 20,
        5: 24,
        6: 32,
        7: 48,
        8: 64,
        9: 72, // Pour les très gros titres
    },
    weight: {
        4: '700',
        6: '800',
        7: '900',
    },
    letterSpacing: {
        1: 0,
        4: -0.3,
        5: -0.5,
        6: -0.7,
        7: -1,
        8: -1.5,
    },
})

const bodyFont = createInterFont(
    {
        face: {
            400: { normal: 'Inter' },
            600: { normal: 'Inter-Medium' },
            700: { normal: 'Inter-Bold' },
        },
    },
    {
        sizeSize: (size) => Math.round(size * 1.1),
        sizeLineHeight: (size) => Math.round(size * 1.1 + 8),
    }
)

// --- 3. TOKENS AMÉLIORÉS ---
const myTokens = createTokens({
    ...defaultTokens,

    // COULEURS POKER
    color: {
        ...defaultTokens.color,

        // === Couleurs sémantiques Poker ===
        pokerGreen: '#059669',
        pokerGreenDark: '#064e3b',  // Nouveau: fond principal
        potGold: '#fbbf24',
        potGoldDim: '#b45309',
        potGoldBright: '#fcd34d',   // Nouveau: pour highlights
        bustRed: '#ef4444',
        chipBlue: '#3b82f6',
        chipBlack: '#1f2937',
        cardWhite: '#f5f5f5',       // Nouveau: pour les cartes
        cardBlack: '#1c1917',       // Nouveau: pour les symboles noirs

        // === Fonds sombres (Dark Slate) ===
        nightBase: '#0b0f19',
        nightCard: '#151c2c',
        nightBorder: '#1e293b',
        darkBg: '#121212',          // Nouveau: fond générique sombre

        // === Overlays & Glass (Nouvelle section !) ===
        // Ces couleurs sont utilisées PARTOUT dans votre app
        glassLight: 'rgba(255,255,255,0.05)',      // Fond verre très léger
        glassMedium: 'rgba(255,255,255,0.1)',      // Fond verre moyen
        glassBorder: 'rgba(255,255,255,0.1)',      // Bordure verre
        glassHover: 'rgba(255,255,255,0.1)',       // État hover

        overlayLight: 'rgba(0,0,0,0.2)',           // Ombre très légère
        overlayMedium: 'rgba(0,0,0,0.3)',          // Ombre moyenne
        overlayStrong: 'rgba(0,0,0,0.5)',          // Overlay fort
        overlayDark: 'rgba(0,0,0,0.6)',            // Header overlay
        overlayBlack: 'rgba(0,0,0,0.8)',           // Footer sombre

        // === Couleurs de texte avec opacité ===
        textPure: '#ffffff',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.7)',
        textMuted: 'rgba(255,255,255,0.6)',
        textDim: 'rgba(255,255,255,0.5)',
        textFaint: 'rgba(255,255,255,0.3)',

        // === Couleurs d'état avec backgrounds ===
        successBg: 'rgba(16, 185, 129, 0.15)',
        dangerBg: 'rgba(239, 68, 68, 0.15)',
        warningBg: 'rgba(245, 158, 11, 0.15)',
        infoBg: 'rgba(59, 130, 246, 0.15)',
        goldBg: 'rgba(251, 191, 36, 0.1)',
        goldBgMedium: 'rgba(251, 191, 36, 0.15)',

        // === Couleurs utilitaires ===
        grayMuted: '#9ca3af',
        grayBorder: '#e5e5e5',

        // Succès, Danger, Warning pour les badges
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
    },

    // ESPACEMENTS
    space: {
        ...defaultTokens.space,
        // Vous utilisez déjà les tokens $1, $2, $3, $4, etc.
        // C'est parfait ! Continuez comme ça
    },

    // TAILLES (Pour les composants)
    size: {
        ...defaultTokens.size,
        // Idem, vos usages de $3, $4, $5, etc. sont bons
    },

    // RAYONS (Border radius)
    radius: {
        ...defaultTokens.radius,
        2: 8,   // Petit radius
        3: 10,  // Moyen
        4: 12,  // Standard
        5: 16,  // Grand
        6: 20,  // Très grand
        10: 50, // Circulaire partiel
    },

    // TAILLES D'ICÔNES (Nouvelle section !)
    // Pour standardiser les tailles d'icônes Lucide
    iconSize: {
        xs: 12,
        sm: 14,
        md: 16,
        base: 18,
        lg: 20,
        xl: 24,
        '2xl': 30,
        '3xl': 32,
        '4xl': 40,
        '5xl': 48,
    },
})

// --- 4. THEMES AMÉLIORÉS ---
const darkTheme = {
    // Fonds
    background: myTokens.color.pokerGreenDark,  // Le vert poker principal
    backgroundStrong: myTokens.color.nightCard,
    backgroundHover: myTokens.color.glassHover,
    backgroundPress: myTokens.color.overlayMedium,
    backgroundFocus: myTokens.color.glassMedium,
    backgroundDark: myTokens.color.darkBg,

    // Textes
    color: myTokens.color.textPure,
    colorMuted: myTokens.color.grayMuted,
    colorSecondary: myTokens.color.textSecondary,
    colorDim: myTokens.color.textDim,

    // Bordures
    borderColor: myTokens.color.glassBorder,
    borderColorStrong: myTokens.color.nightBorder,

    // Ombres
    shadowColor: 'rgba(0,0,0,0.5)',

    // Couleurs principales
    primary: myTokens.color.potGold,
    primaryBright: myTokens.color.potGoldBright,
    primaryDim: myTokens.color.potGoldDim,

    success: myTokens.color.success,
    successBg: myTokens.color.successBg,

    danger: myTokens.color.danger,
    dangerBg: myTokens.color.dangerBg,

    warning: myTokens.color.warning,
    warningBg: myTokens.color.warningBg,

    info: myTokens.color.info,
    infoBg: myTokens.color.infoBg,

    accent: myTokens.color.chipBlue,

    // Glass & Overlays
    glass: myTokens.color.glassLight,
    glassMedium: myTokens.color.glassMedium,
    overlay: myTokens.color.overlayMedium,
    overlayStrong: myTokens.color.overlayStrong,
    overlayDark: myTokens.color.overlayDark,
}

const lightTheme = {
    background: '#f8fafc',
    backgroundStrong: '#ffffff',
    backgroundHover: '#f1f5f9',
    backgroundPress: '#e2e8f0',
    backgroundFocus: '#f1f5f9',
    backgroundDark: myTokens.color.darkBg,

    color: '#0f172a',
    colorMuted: '#64748b',
    colorSecondary: '#475569',
    colorDim: '#94a3b8',

    borderColor: '#e2e8f0',
    borderColorStrong: '#cbd5e1',

    shadowColor: 'rgba(0,0,0,0.05)',

    primary: myTokens.color.potGold,
    primaryBright: myTokens.color.potGoldBright,
    primaryDim: myTokens.color.potGoldDim,

    success: myTokens.color.success,
    successBg: myTokens.color.successBg,

    danger: myTokens.color.danger,
    dangerBg: myTokens.color.dangerBg,

    warning: myTokens.color.warning,
    warningBg: myTokens.color.warningBg,

    info: myTokens.color.info,
    infoBg: myTokens.color.infoBg,

    accent: myTokens.color.chipBlue,

    glass: 'rgba(0,0,0,0.03)',
    glassMedium: 'rgba(0,0,0,0.05)',
    overlay: 'rgba(0,0,0,0.1)',
    overlayStrong: 'rgba(0,0,0,0.2)',
    overlayDark: 'rgba(0,0,0,0.3)',
}

// --- 5. CONFIGURATION FINALE ---
export const tamaguiConfig = createTamagui({
    animations,
    defaultTheme: 'dark',
    shouldAddPrefersColorThemes: false,
    themeClassNameOnRoot: true,
    shorthands,
    fonts: {
        heading: headingFont,
        body: bodyFont,
    },
    themes: {
        light: lightTheme,
        dark: darkTheme,
    },
    tokens: myTokens,
    media: {
        xs: { maxWidth: 660 },
        gtXs: { minWidth: 660 + 1 },
        sm: { maxWidth: 800 },
        gtSm: { minWidth: 800 + 1 },
        md: { maxWidth: 1020 },
        gtMd: { minWidth: 1020 + 1 },
        lg: { maxWidth: 1280 },
        gtLg: { minWidth: 1280 + 1 },
        xl: { maxWidth: 1420 },
        xxl: { maxWidth: 1600 },
    },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf { }
}
