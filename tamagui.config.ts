import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { createAnimations } from '@tamagui/animations-react-native'
import { shorthands } from '@tamagui/shorthands'

// ═══════════════════════════════════════════════════════════════════
// 🎨 POKER NIGHT - DESIGN SYSTEM COMPLET
// ═══════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────
// 1. ANIMATIONS
// ────────────────────────────────────────────────────────────────
const animations = createAnimations({
    bouncy: { 
        type: 'spring', 
        damping: 10, 
        mass: 0.9, 
        stiffness: 100 
    },
    lazy: { 
        type: 'spring', 
        damping: 20, 
        stiffness: 60 
    },
    quick: { 
        type: 'spring', 
        damping: 15, 
        mass: 1, 
        stiffness: 200 
    },
    smooth: {
        type: 'spring',
        damping: 18,
        mass: 0.8,
        stiffness: 150
    },
    cardFlip: { 
        type: 'spring', 
        damping: 15, 
        mass: 1, 
        stiffness: 120 
    },
})

// ────────────────────────────────────────────────────────────────
// 2. TYPOGRAPHIE
// ────────────────────────────────────────────────────────────────
const headingFont = createInterFont({
    size: {
        1: 11,    // xs
        2: 12,    // sm
        3: 14,    // base
        4: 16,    // md
        5: 18,    // lg
        6: 20,    // xl
        7: 24,    // 2xl
        8: 32,    // 3xl
        9: 40,    // 4xl
        10: 48,   // 5xl
        11: 64,   // 6xl
        12: 80,   // 7xl
    },
    weight: {
        1: '400',
        2: '500',
        3: '600',
        4: '700',
        5: '800',
        6: '900',
    },
    letterSpacing: {
        1: 0,
        2: -0.2,
        3: -0.3,
        4: -0.5,
        5: -0.8,
        6: -1.2,
    },
    lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 24,
        5: 28,
        6: 32,
        7: 36,
        8: 44,
        9: 52,
        10: 60,
    },
})

const bodyFont = createInterFont(
    {
        face: {
            400: { normal: 'Inter' },
            500: { normal: 'Inter-Medium' },
            600: { normal: 'Inter-SemiBold' },
            700: { normal: 'Inter-Bold' },
        },
    },
    {
        sizeSize: (size) => Math.round(size * 1.1),
        sizeLineHeight: (size) => Math.round(size * 1.4),
    }
)

const monoFont = createInterFont({
    size: {
        1: 11,
        2: 12,
        3: 13,
        4: 14,
        5: 16,
        6: 18,
    },
    face: {
        400: { normal: 'Inter' },
        500: { normal: 'Inter-Medium' },
    },
})

// ────────────────────────────────────────────────────────────────
// 3. TOKENS - PALETTE DE COULEURS COMPLÈTE
// ────────────────────────────────────────────────────────────────
const tokens = createTokens({
    // ═══ COULEURS ═══
    color: {
        // ── POKER THÈME (Tapis de jeu) ──
        felt: '#0F5132',           // Vert feutre principal
        feltDark: '#0A3A23',       // Vert feutre sombre
        feltDarker: '#052e16',     // Vert très sombre
        feltLight: '#16613F',      // Vert feutre clair
        pokerGreen: '#047857',     // Legacy (à migrer vers felt)
        pokerGreenDark: '#064e3b',
        pokerGreenDarker: '#052e16',
        pokerGreenLight: '#059669',
        
        // ── GOLD PREMIUM (Pot, Jetons, Accents) ──
        gold: '#D4AF37',           // Or principal
        goldDark: '#B8860B',       // Or sombre
        goldLight: '#F4D03F',      // Or brillant
        gold50: '#fffbeb',
        gold100: '#fef3c7',
        gold200: '#fde68a',
        gold300: '#fcd34d',
        gold400: '#fbbf24',        // Pot principal (legacy)
        gold500: '#f59e0b',
        gold600: '#d97706',
        gold700: '#b45309',
        gold800: '#92400e',
        gold900: '#78350f',
        
        // ── CARTES À JOUER ──
        cardRed: '#DC2626',        // Cœur & Carreau
        cardBlack: '#0F172A',      // Pique & Trèfle
        cardBack: '#1E293B',       // Dos de carte
        cardBorder: '#475569',     // Bordure carte
        
        // ── JETONS DE POKER (Chips) ──
        chipRed: '#DC2626',        // Jeton rouge (5)
        chipBlue: '#2563EB',       // Jeton bleu (10)
        chipGreen: '#16A34A',      // Jeton vert (25)
        chipBlack: '#0F172A',      // Jeton noir (100)
        chipWhite: '#F8FAFC',      // Jeton blanc (1)
        chipPurple: '#9333EA',     // Jeton violet (500)
        chipOrange: '#EA580C',     // Jeton orange (1000)
        chipYellow: '#fbbf24',     // Jeton jaune (legacy gold400)
        
        // ── SLATE / GRAY (Cartes, Fonds) ──
        slate50: '#f8fafc',
        slate100: '#f1f5f9',
        slate200: '#e2e8f0',
        slate300: '#cbd5e1',
        slate400: '#94a3b8',
        slate500: '#64748b',
        slate600: '#475569',
        slate700: '#334155',
        slate800: '#1e293b',
        slate900: '#0f172a',
        slate950: '#020617',
        
        // ── NIGHT (Fonds très sombres) ──
        night50: '#e7e8ea',
        night100: '#c2c4c9',
        night200: '#999ca5',
        night300: '#707481',
        night400: '#525766',
        night500: '#343a4b',
        night600: '#2e3444',
        night700: '#252b3b',
        night800: '#1d2333',
        night900: '#0b0f19',    // Le plus sombre
        
        // ── EMERALD (Success) ──
        emerald400: '#34d399',
        emerald500: '#10b981',
        emerald600: '#059669',
        emerald700: '#047857',
        
        // ── RED (Danger / Bust) ──
        red400: '#f87171',
        red500: '#ef4444',
        red600: '#dc2626',
        red700: '#b91c1c',
        
        // ── ORANGE (Warning) ──
        orange400: '#fb923c',
        orange500: '#f97316',
        orange600: '#ea580c',
        orange700: '#c2410c',
        
        // ── BLUE (Info / Chips) ──
        blue400: '#60a5fa',
        blue500: '#3b82f6',
        blue600: '#2563eb',
        blue700: '#1d4ed8',
        
        // ── CYAN (Accents) ──
        cyan400: '#22d3ee',
        cyan500: '#06b6d4',
        cyan600: '#0891b2',
        
        // ── PURPLE (Premium) ──
        purple400: '#c084fc',
        purple500: '#a855f7',
        purple600: '#9333ea',
        
        // ── PLAYER STATUS (États des joueurs) ──
        playerActive: '#22C55E',   // Joueur actif (en jeu)
        playerFolded: '#64748B',   // Joueur couché
        playerAllIn: '#EAB308',    // Joueur all-in
        playerEliminated: '#DC2626', // Joueur éliminé
        playerDealer: '#D4AF37',   // Bouton dealer
        
        // ── WHITE / BLACK ──
        white: '#ffffff',
        black: '#000000',
        
        // ── BACKGROUNDS PREMIUM ──
        bgPremium: '#0A0A0A',      // Fond ultra-sombre
        bgElevated: '#1A1A1A',     // Fond élevé
        bgGlass: 'rgba(255, 255, 255, 0.05)', // Fond vitreux
        
        // ── GLASS & OVERLAYS (RGBA) ──
        glass1: 'rgba(255,255,255,0.03)',
        glass2: 'rgba(255,255,255,0.05)',
        glass3: 'rgba(255,255,255,0.08)',
        glass4: 'rgba(255,255,255,0.1)',
        glass5: 'rgba(255,255,255,0.12)',
        glass6: 'rgba(255,255,255,0.15)',
        
        overlay1: 'rgba(0,0,0,0.1)',
        overlay2: 'rgba(0,0,0,0.2)',
        overlay3: 'rgba(0,0,0,0.3)',
        overlay4: 'rgba(0,0,0,0.4)',
        overlay5: 'rgba(0,0,0,0.5)',
        overlay6: 'rgba(0,0,0,0.6)',
        overlay7: 'rgba(0,0,0,0.7)',
        overlay8: 'rgba(0,0,0,0.8)',
        overlay9: 'rgba(0,0,0,0.9)',
        
        // ── TEXT AVEC OPACITÉ ──
        textWhite: '#ffffff',
        text95: 'rgba(255,255,255,0.95)',
        text90: 'rgba(255,255,255,0.9)',
        text80: 'rgba(255,255,255,0.8)',
        text70: 'rgba(255,255,255,0.7)',
        text60: 'rgba(255,255,255,0.6)',
        text50: 'rgba(255,255,255,0.5)',
        text40: 'rgba(255,255,255,0.4)',
        text30: 'rgba(255,255,255,0.3)',
        text20: 'rgba(255,255,255,0.2)',
        text10: 'rgba(255,255,255,0.1)',
        
        // ── COULEURS DE STATUS (avec backgrounds) ──
        successBg: 'rgba(16, 185, 129, 0.12)',
        dangerBg: 'rgba(239, 68, 68, 0.12)',
        warningBg: 'rgba(251, 146, 60, 0.12)',
        infoBg: 'rgba(59, 130, 246, 0.12)',
        goldBg: 'rgba(251, 191, 36, 0.08)',
        purpleBg: 'rgba(168, 85, 247, 0.12)',
        cyanBg: 'rgba(34, 211, 238, 0.12)',
    },
    
    // ═══ ESPACEMENTS ═══
    space: {
        0: 0,
        0.5: 2,
        1: 4,
        1.5: 6,
        2: 8,
        2.5: 10,
        3: 12,
        3.5: 14,
        4: 16,
        true: 16,      // Taille par défaut (= $4)
        4.5: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 40,
        11: 44,
        12: 48,
        14: 56,
        16: 64,
        20: 80,
        24: 96,
        28: 112,
        32: 128,
        36: 144,
        40: 160,
        44: 176,
        48: 192,
        52: 208,
        56: 224,
        60: 240,
        64: 256,
        72: 288,
        80: 320,
        96: 384,
        '-0.5': -2,
        '-1': -4,
        '-2': -8,
        '-3': -12,
        '-4': -16,
        '-5': -20,
    },
    
    // ═══ TAILLES ═══
    size: {
        0: 0,
        0.5: 2,
        1: 4,
        1.5: 6,
        2: 8,
        2.5: 10,
        3: 12,
        3.5: 14,
        4: 16,
        true: 16,      // Taille par défaut (= $4)
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 40,
        11: 44,
        12: 48,
        14: 56,
        16: 64,
        20: 80,
        24: 96,
        28: 112,
        32: 128,
        36: 144,
        40: 160,
        44: 176,
        48: 192,
        52: 208,
        56: 224,
        60: 240,
        64: 256,
        72: 288,
        80: 320,
        96: 384,
    },
    
    // ═══ RAYONS (Border radius) ═══
    radius: {
        0: 0,
        1: 3,
        2: 6,
        3: 8,
        4: 10,
        5: 12,
        6: 14,
        7: 16,
        8: 18,
        9: 20,
        10: 24,
        11: 28,
        12: 32,
        round: 9999,
    },
    
    // ═══ Z-INDEX ═══
    zIndex: {
        0: 0,
        1: 100,
        2: 200,
        3: 300,
        4: 400,
        5: 500,
        modal: 1000,
        toast: 2000,
        tooltip: 3000,
    },
})

// ────────────────────────────────────────────────────────────────
// 4. THÈMES SÉMANTIQUES
// ────────────────────────────────────────────────────────────────
const darkTheme = {
    // ── BACKGROUNDS ──
    background: tokens.color.pokerGreenDark,
    backgroundStrong: tokens.color.night800,
    backgroundHover: tokens.color.glass3,
    backgroundPress: tokens.color.glass4,
    backgroundFocus: tokens.color.glass5,
    backgroundTransparent: 'transparent',
    backgroundCard: tokens.color.glass2,
    backgroundCardHover: tokens.color.glass4,
    
    // ── SURFACES ──
    surface1: tokens.color.glass1,
    surface2: tokens.color.glass2,
    surface3: tokens.color.glass3,
    surface4: tokens.color.glass4,
    surface5: tokens.color.glass5,
    
    // ── TEXTES ──
    color: tokens.color.textWhite,
    colorPrimary: tokens.color.text95,
    colorSecondary: tokens.color.text70,
    colorTertiary: tokens.color.text50,
    colorMuted: tokens.color.text40,
    colorDim: tokens.color.text30,
    colorFaint: tokens.color.text20,
    colorDisabled: tokens.color.text30,
    
    // ── BORDURES ──
    borderColor: tokens.color.glass4,
    borderColorHover: tokens.color.glass5,
    borderColorPress: tokens.color.glass6,
    borderColorFocus: tokens.color.gold400,
    
    // ── COULEURS PRINCIPALES ──
    primary: tokens.color.gold400,
    primaryHover: tokens.color.gold300,
    primaryPress: tokens.color.gold500,
    primaryBright: tokens.color.gold300,
    primaryDim: tokens.color.gold600,
    
    secondary: tokens.color.slate400,
    secondaryHover: tokens.color.slate300,
    secondaryPress: tokens.color.slate500,
    
    accent: tokens.color.blue500,
    accentHover: tokens.color.blue400,
    accentPress: tokens.color.blue600,
    
    // ── STATUS COLORS ──
    success: tokens.color.emerald500,
    successHover: tokens.color.emerald400,
    successPress: tokens.color.emerald600,
    successBg: tokens.color.successBg,
    
    danger: tokens.color.red500,
    dangerHover: tokens.color.red400,
    dangerPress: tokens.color.red600,
    dangerBg: tokens.color.dangerBg,
    
    warning: tokens.color.orange500,
    warningHover: tokens.color.orange400,
    warningPress: tokens.color.orange600,
    warningBg: tokens.color.warningBg,
    
    info: tokens.color.blue500,
    infoHover: tokens.color.blue400,
    infoPress: tokens.color.blue600,
    infoBg: tokens.color.infoBg,
    
    // ── POKER SPECIFIC ──
    pokerGreen: tokens.color.pokerGreen,
    pot: tokens.color.gold400,
    potBright: tokens.color.gold300,
    chip: tokens.color.blue500,
    bust: tokens.color.red500,
    
    // ── OVERLAYS ──
    overlay: tokens.color.overlay3,
    overlayStrong: tokens.color.overlay5,
    overlayDark: tokens.color.overlay7,
    
    // ── SHADOWS ──
    shadowColor: tokens.color.black,
    shadowColorStrong: tokens.color.overlay8,
}

const lightTheme = {
    // ── BACKGROUNDS ──
    background: tokens.color.slate50,
    backgroundStrong: tokens.color.white,
    backgroundHover: tokens.color.slate100,
    backgroundPress: tokens.color.slate200,
    backgroundFocus: tokens.color.slate100,
    backgroundTransparent: 'transparent',
    backgroundCard: tokens.color.white,
    backgroundCardHover: tokens.color.slate50,
    
    // ── SURFACES ──
    surface1: tokens.color.white,
    surface2: tokens.color.slate50,
    surface3: tokens.color.slate100,
    surface4: tokens.color.slate200,
    surface5: tokens.color.slate300,
    
    // ── TEXTES ──
    color: tokens.color.slate900,
    colorPrimary: tokens.color.slate900,
    colorSecondary: tokens.color.slate600,
    colorTertiary: tokens.color.slate500,
    colorMuted: tokens.color.slate400,
    colorDim: tokens.color.slate300,
    colorFaint: tokens.color.slate200,
    colorDisabled: tokens.color.slate300,
    
    // ── BORDURES ──
    borderColor: tokens.color.slate200,
    borderColorHover: tokens.color.slate300,
    borderColorPress: tokens.color.slate400,
    borderColorFocus: tokens.color.gold500,
    
    // ── COULEURS PRINCIPALES ──
    primary: tokens.color.gold500,
    primaryHover: tokens.color.gold400,
    primaryPress: tokens.color.gold600,
    primaryBright: tokens.color.gold400,
    primaryDim: tokens.color.gold700,
    
    secondary: tokens.color.slate600,
    secondaryHover: tokens.color.slate500,
    secondaryPress: tokens.color.slate700,
    
    accent: tokens.color.blue600,
    accentHover: tokens.color.blue500,
    accentPress: tokens.color.blue700,
    
    // ── STATUS COLORS ──
    success: tokens.color.emerald600,
    successHover: tokens.color.emerald500,
    successPress: tokens.color.emerald700,
    successBg: tokens.color.successBg,
    
    danger: tokens.color.red600,
    dangerHover: tokens.color.red500,
    dangerPress: tokens.color.red700,
    dangerBg: tokens.color.dangerBg,
    
    warning: tokens.color.orange600,
    warningHover: tokens.color.orange500,
    warningPress: tokens.color.orange700,
    warningBg: tokens.color.warningBg,
    
    info: tokens.color.blue600,
    infoHover: tokens.color.blue500,
    infoPress: tokens.color.blue700,
    infoBg: tokens.color.infoBg,
    
    // ── POKER SPECIFIC ──
    pokerGreen: tokens.color.pokerGreen,
    pot: tokens.color.gold600,
    potBright: tokens.color.gold500,
    chip: tokens.color.blue600,
    bust: tokens.color.red600,
    
    // ── OVERLAYS ──
    overlay: tokens.color.overlay1,
    overlayStrong: tokens.color.overlay2,
    overlayDark: tokens.color.overlay4,
    
    // ── SHADOWS ──
    shadowColor: tokens.color.slate300,
    shadowColorStrong: tokens.color.slate400,
}

// ────────────────────────────────────────────────────────────────
// 5. CONFIGURATION FINALE
// ────────────────────────────────────────────────────────────────
export const config = createTamagui({
    animations,
    defaultTheme: 'dark',
    shouldAddPrefersColorThemes: false,
    themeClassNameOnRoot: true,
    shorthands,
    fonts: {
        heading: headingFont,
        body: bodyFont,
        mono: monoFont,
    },
    themes: {
        light: lightTheme,
        dark: darkTheme,
    },
    tokens,
    media: {
        xs: { maxWidth: 660 },
        sm: { maxWidth: 800 },
        md: { maxWidth: 1020 },
        lg: { maxWidth: 1280 },
        xl: { maxWidth: 1420 },
        xxl: { maxWidth: 1600 },
        gtXs: { minWidth: 661 },
        gtSm: { minWidth: 801 },
        gtMd: { minWidth: 1021 },
        gtLg: { minWidth: 1281 },
        short: { maxHeight: 800 },
        tall: { minHeight: 801 },
    },
})

export default config

export type AppConfig = typeof config

declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig {}
}