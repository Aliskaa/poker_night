import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { createAnimations } from '@tamagui/animations-react-native'
import { shorthands } from '@tamagui/shorthands'
import { tokens as defaultTokens } from '@tamagui/themes'

// --- 1. ANIMATIONS ---
const animations = createAnimations({
  bouncy: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
  lazy: { type: 'spring', damping: 20, stiffness: 60 },
  quick: { type: 'spring', damping: 20, mass: 1.2, stiffness: 250 },
  cardFlip: { type: 'spring', damping: 15, mass: 1, stiffness: 120 }, // Animation custom pour plus tard
})

// --- 2. FONTS (Modernisées pour plus d'impact) ---
const headingFont = createInterFont({
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 24,
    6: 32, // Parfait pour les sous-titres
    7: 48, // Énorme : Pour le Pot principal
    8: 64,
  },
  weight: {
    4: '700', // Plus gras pour les titres
    7: '900', // Ultra-bold pour l'argent
  },
  letterSpacing: {
    1: 0,
    6: -0.5,
    7: -1, // Rapproche les lettres des gros chiffres
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

// --- 3. TOKENS (La Palette "Poker Night") ---
const myTokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    // Couleurs sémantiques "Poker"
    pokerGreen: '#059669',   // Vert tapis de jeu classique
    potGold: '#fbbf24',      // Or riche pour la cagnotte
    potGoldDim: '#b45309',   // Ombre/Bordure Or
    bustRed: '#ef4444',      // Rouge vif pour les éliminés
    chipBlue: '#3b82f6',     // Bleu jeton de casino
    chipBlack: '#1f2937',    // Noir jeton
    
    // Nuances de fonds riches (Dark Slate)
    nightBase: '#0b0f19',    // Fond global (très sombre, ambiance nuit)
    nightCard: '#151c2c',    // Fond des cartes (légèrement plus clair)
    nightBorder: '#1e293b',  // Bordures subtiles
  },
  space: { ...defaultTokens.space },
  size: { ...defaultTokens.size },
  radius: { 
    ...defaultTokens.radius,
    4: 12, // Coins plus arrondis, style iOS moderne
    5: 16,
  },
})

// --- 4. THEMES ---
// On force le thème Dark par défaut pour l'ambiance, mais le light est dispo.
const darkTheme = {
  background: myTokens.color.nightBase,
  backgroundStrong: myTokens.color.nightCard, // Utilisé pour les Cards
  backgroundHover: '#1e293b',
  backgroundPress: '#0f172a',
  backgroundFocus: '#1e293b',
  
  color: '#ffffff',           // Texte principal pur blanc
  colorMuted: '#94a3b8',      // Texte secondaire (Gris bleuté)
  
  borderColor: myTokens.color.nightBorder,
  shadowColor: 'rgba(0,0,0,0.5)',
  
  // Couleurs principales mappées sur nos tokens Poker
  primary: myTokens.color.potGold,
  success: myTokens.color.pokerGreen,
  danger: myTokens.color.bustRed,
  accent: myTokens.color.chipBlue,
}

// Le thème clair (optionnel, mais propre)
const lightTheme = {
  background: '#f8fafc',
  backgroundStrong: '#ffffff',
  backgroundHover: '#f1f5f9',
  backgroundPress: '#e2e8f0',
  backgroundFocus: '#f1f5f9',
  color: '#0f172a',
  colorMuted: '#64748b',
  borderColor: '#e2e8f0',
  shadowColor: 'rgba(0,0,0,0.05)',
  primary: '#0f172a',
  success: myTokens.color.pokerGreen,
  danger: myTokens.color.bustRed,
  accent: myTokens.color.chipBlue,
}

// --- 5. CONFIGURATION FINALE ---
export const tamaguiConfig = createTamagui({
  animations,
  defaultTheme: 'dark', // ♠️ L'appli s'ouvrira en Dark Mode
  shouldAddPrefersColorThemes: false, // On impose notre style
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
  interface TamaguiCustomConfig extends Conf {}
}