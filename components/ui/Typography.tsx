import { styled, Text, H1, H2, H3, H4, H5, H6 } from 'tamagui'

// ═══════════════════════════════════════════════════════════════════
// 📝 TYPOGRAPHY COMPONENTS - Composants de texte standardisés
// ═══════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────
// HEADINGS - Titres
// ────────────────────────────────────────────────────────────────

/**
 * Titre principal (Hero)
 * Usage: Titre de page, headers importants
 * Exemple: "Poker Night", "Bienvenue Kevin"
 */
export const Title = styled(H1, {
  fontSize: '$9',           // 40px
  fontWeight: '900',
  color: '$text95',
  letterSpacing: -1,
  lineHeight: '$9',
  
  variants: {
    size: {
      sm: { fontSize: '$7', lineHeight: '$7' },    // 24px
      md: { fontSize: '$8', lineHeight: '$8' },    // 32px
      lg: { fontSize: '$9', lineHeight: '$9' },    // 40px (default)
      xl: { fontSize: '$10', lineHeight: '$10' },  // 48px
    },
    
    color: {
      primary: { color: '$text95' },
      secondary: { color: '$text70' },
      muted: { color: '$text50' },
      gold: { color: '$gold' },
      success: { color: '$success' },
      danger: { color: '$danger' },
      warning: { color: '$warning' },
    },
  } as const,
  
  defaultVariants: {
    size: 'lg',
    color: 'primary',
  },
})

/**
 * Titre de section
 * Usage: Titres de cartes, sections
 * Exemple: "Statistiques", "Parties Actives"
 */
export const Heading = styled(H2, {
  fontSize: '$7',           // 24px
  fontWeight: '700',
  color: '$text90',
  letterSpacing: -0.5,
  lineHeight: '$7',
  
  variants: {
    size: {
      sm: { fontSize: '$5', lineHeight: '$5' },    // 18px
      md: { fontSize: '$6', lineHeight: '$6' },    // 20px
      lg: { fontSize: '$7', lineHeight: '$7' },    // 24px (default)
      xl: { fontSize: '$8', lineHeight: '$8' },    // 32px
    },
    
    color: {
      primary: { color: '$text90' },
      secondary: { color: '$text70' },
      muted: { color: '$text50' },
      gold: { color: '$gold' },
    },
  } as const,
  
  defaultVariants: {
    size: 'lg',
    color: 'primary',
  },
})

/**
 * Sous-titre
 * Usage: Descriptifs, sous-sections
 * Exemple: "12 parties jouées", "Statistiques du mois"
 */
export const Subtitle = styled(H3, {
  fontSize: '$5',           // 18px
  fontWeight: '600',
  color: '$text70',
  letterSpacing: -0.2,
  lineHeight: '$5',
  
  variants: {
    size: {
      sm: { fontSize: '$3', lineHeight: '$3' },    // 14px
      md: { fontSize: '$4', lineHeight: '$4' },    // 16px
      lg: { fontSize: '$5', lineHeight: '$5' },    // 18px (default)
    },
    
    color: {
      primary: { color: '$text70' },
      secondary: { color: '$text60' },
      muted: { color: '$text40' },
      gold: { color: '$goldDark' },
    },
  } as const,
  
  defaultVariants: {
    size: 'lg',
    color: 'primary',
  },
})

/**
 * Label
 * Usage: Labels de formulaires, badges
 * Exemple: "Email", "Blinds", "Statut"
 */
export const Label = styled(Text, {
  fontSize: '$3',           // 14px
  fontWeight: '600',
  color: '$text60',
  letterSpacing: 0.3,
  textTransform: 'uppercase',
  lineHeight: '$3',
  
  variants: {
    size: {
      sm: { fontSize: '$2', lineHeight: '$2' },    // 12px
      md: { fontSize: '$3', lineHeight: '$3' },    // 14px (default)
      lg: { fontSize: '$4', lineHeight: '$4' },    // 16px
    },
    
    color: {
      primary: { color: '$text60' },
      secondary: { color: '$text50' },
      muted: { color: '$text40' },
      gold: { color: '$goldDark' },
      success: { color: '$success' },
      danger: { color: '$danger' },
      warning: { color: '$warning' },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

// ────────────────────────────────────────────────────────────────
// BODY TEXT - Texte de corps
// ────────────────────────────────────────────────────────────────

/**
 * Texte de corps principal
 * Usage: Paragraphes, descriptions longues
 * Exemple: Descriptions de parties, règles
 */
export const Body = styled(Text, {
  fontSize: '$4',           // 16px
  fontWeight: '400',
  color: '$text80',
  lineHeight: '$4',
  
  variants: {
    size: {
      sm: { fontSize: '$3', lineHeight: '$3' },    // 14px
      md: { fontSize: '$4', lineHeight: '$4' },    // 16px (default)
      lg: { fontSize: '$5', lineHeight: '$5' },    // 18px
    },
    
    weight: {
      regular: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      semibold: { fontWeight: '600' },
      bold: { fontWeight: '700' },
    },
    
    color: {
      primary: { color: '$text80' },
      secondary: { color: '$text70' },
      muted: { color: '$text60' },
      dim: { color: '$text40' },
      gold: { color: '$gold' },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
    weight: 'regular',
    color: 'primary',
  },
})

/**
 * Texte secondaire / Caption
 * Usage: Métadonnées, timestamps, infos complémentaires
 * Exemple: "Il y a 2 heures", "12 joueurs"
 */
export const Caption = styled(Text, {
  fontSize: '$3',           // 14px
  fontWeight: '400',
  color: '$text60',
  lineHeight: '$3',
  
  variants: {
    size: {
      xs: { fontSize: '$1', lineHeight: '$1' },    // 11px
      sm: { fontSize: '$2', lineHeight: '$2' },    // 12px
      md: { fontSize: '$3', lineHeight: '$3' },    // 14px (default)
    },
    
    color: {
      primary: { color: '$text60' },
      secondary: { color: '$text50' },
      muted: { color: '$text40' },
      dim: { color: '$text30' },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

// ────────────────────────────────────────────────────────────────
// SPECIAL - Textes spéciaux
// ────────────────────────────────────────────────────────────────

/**
 * Valeur numérique mise en avant
 * Usage: Stats importantes, montants, scores
 * Exemple: "$2,500", "12", "65%"
 */
export const StatValue = styled(Text, {
  fontSize: '$8',           // 32px
  fontWeight: '900',
  color: '$text95',
  letterSpacing: -0.8,
  lineHeight: '$8',
  fontVariant: ['tabular-nums'],  // Chiffres alignés
  
  variants: {
    size: {
      sm: { fontSize: '$6', lineHeight: '$6' },    // 20px
      md: { fontSize: '$7', lineHeight: '$7' },    // 24px
      lg: { fontSize: '$8', lineHeight: '$8' },    // 32px (default)
      xl: { fontSize: '$9', lineHeight: '$9' },    // 40px
    },
    
    color: {
      primary: { color: '$text95' },
      gold: { color: '$gold' },
      success: { color: '$success' },
      danger: { color: '$danger' },
      warning: { color: '$warning' },
    },
  } as const,
  
  defaultVariants: {
    size: 'lg',
    color: 'primary',
  },
})

/**
 * Lien cliquable
 * Usage: Navigation, actions textuelles
 * Exemple: "Voir plus", "Règles du jeu"
 */
export const Link = styled(Text, {
  fontSize: '$4',           // 16px
  fontWeight: '600',
  color: '$gold',
  textDecorationLine: 'underline',
  cursor: 'pointer',
  lineHeight: '$4',
  
  pressStyle: {
    color: '$goldDark',
    opacity: 0.8,
  },
  
  hoverStyle: {
    color: '$goldLight',
  },
  
  variants: {
    size: {
      sm: { fontSize: '$3', lineHeight: '$3' },    // 14px
      md: { fontSize: '$4', lineHeight: '$4' },    // 16px (default)
      lg: { fontSize: '$5', lineHeight: '$5' },    // 18px
    },
    
    underline: {
      true: { textDecorationLine: 'underline' },
      false: { textDecorationLine: 'none' },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
    underline: true,
  },
})

/**
 * Code monospace
 * Usage: Codes d'invitation, identifiants techniques
 * Exemple: "ABC123", "poker-night-b24c7"
 */
export const Code = styled(Text, {
  fontSize: '$3',           // 14px
  fontWeight: '500',
  color: '$text90',
  fontFamily: '$mono',
  backgroundColor: '$glass3',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: '$2',
  lineHeight: '$3',
  
  variants: {
    size: {
      sm: { fontSize: '$2', lineHeight: '$2' },    // 12px
      md: { fontSize: '$3', lineHeight: '$3' },    // 14px (default)
      lg: { fontSize: '$4', lineHeight: '$4' },    // 16px
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
  },
})

// ────────────────────────────────────────────────────────────────
// EXPORTS
// ────────────────────────────────────────────────────────────────

export default {
  Title,
  Heading,
  Subtitle,
  Label,
  Body,
  Caption,
  StatValue,
  Link,
  Code,
}
