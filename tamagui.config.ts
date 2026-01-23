import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { createAnimations } from '@tamagui/animations-react-native'
import { shorthands } from '@tamagui/shorthands'
import { tokens as defaultTokens } from '@tamagui/themes' // On part d'une base existante

// --- 1. ANIMATIONS ---
// Des animations fluides pour les interactions
const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 120,
  },
})

// --- 2. FONTS ---
// Configuration de la police Inter (très propre pour UI)
const headingFont = createInterFont({
  size: {
    1: 11,
    2: 13,
    3: 15,
    4: 18,
    5: 22,
    6: 28,
    7: 42,
    8: 60,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    1: '400',
    3: '700',
  },
  letterSpacing: {
    4: 0,
    8: -1,
  },
})

const bodyFont = createInterFont(
  {
    face: {
      700: { normal: 'InterBold' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
  }
)

// --- 3. TOKENS (Le Design System) ---
// On étend les tokens par défaut avec nos couleurs personnalisées
const myTokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    // Une palette "Brand" personnalisée (Bleu Océan / Violet)
    brandLight: '#6366f1',
    brandDark: '#4f46e5',
    brandSoft: '#c7d2fe',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
})

// --- 4. THEMES ---
// Définition simple Light/Dark
const lightTheme = {
  background: '#ffffff',
  backgroundHover: '#f3f4f6',
  backgroundPress: '#e5e7eb',
  backgroundFocus: '#f3f4f6',
  color: '#111827',
  borderColor: '#e5e7eb',
  shadowColor: 'rgba(0,0,0,0.1)',
  // Utilisation de nos tokens custom
  primary: myTokens.color.brandLight,
}

const darkTheme = {
  background: '#111827',
  backgroundHover: '#1f2937',
  backgroundPress: '#374151',
  backgroundFocus: '#1f2937',
  color: '#f9fafb',
  borderColor: '#374151',
  shadowColor: 'rgba(0,0,0,0.3)',
  primary: myTokens.color.brandDark,
}

// --- 5. CONFIGURATION FINALE ---
export const tamaguiConfig = createTamagui({
  animations,
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands, // Permet d'utiliser p={10} au lieu de padding={10}
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