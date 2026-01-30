/**
 * Configuration centralisée des animations pour l'app Poker Night
 * Utilise les animations Tamagui pour une performance optimale
 */

export const animations = {
  // Animations de base
  quick: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
  smooth: {
    type: 'spring',
    damping: 25,
    stiffness: 250,
  },
  bouncy: {
    type: 'spring',
    damping: 15,
    stiffness: 200,
  },
  lazy: {
    type: 'spring',
    damping: 30,
    stiffness: 150,
  },

  // Animations poker spécifiques
  cardFlip: {
    type: 'spring',
    damping: 18,
    stiffness: 280,
  },
  chipStack: {
    type: 'spring',
    damping: 12,
    stiffness: 220,
  },
  potIncrement: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
  dealerButton: {
    type: 'spring',
    damping: 16,
    stiffness: 240,
  },

  // Animations UI
  fadeIn: {
    type: 'timing',
    duration: 300,
  },
  fadeOut: {
    type: 'timing',
    duration: 200,
  },
  slideUp: {
    type: 'spring',
    damping: 22,
    stiffness: 280,
  },
  slideDown: {
    type: 'spring',
    damping: 22,
    stiffness: 280,
  },
  scaleIn: {
    type: 'spring',
    damping: 18,
    stiffness: 260,
  },
  pulse: {
    type: 'spring',
    damping: 10,
    stiffness: 300,
  },
} as const;

export type AnimationType = keyof typeof animations;

/**
 * Variants d'animation pour composants communs
 */
export const animationVariants = {
  // Button press
  button: {
    initial: { scale: 1, opacity: 1 },
    pressed: { scale: 0.95, opacity: 0.8 },
    hover: { scale: 1.02, opacity: 1 },
  },

  // Card animations
  card: {
    initial: { rotateY: 0, opacity: 1, scale: 1 },
    flip: { rotateY: 180, opacity: 1, scale: 1 },
    deal: { y: -20, opacity: 0, scale: 0.8 },
    dealt: { y: 0, opacity: 1, scale: 1 },
  },

  // Chip animations
  chip: {
    initial: { y: 0, scale: 1, opacity: 1 },
    toBet: { y: -50, scale: 0.8, opacity: 0.6 },
    toPot: { y: -30, x: 0, scale: 0.5, opacity: 0 },
  },

  // Pot display
  pot: {
    initial: { scale: 1 },
    increment: { scale: 1.15 },
    pulse: { scale: 1.05 },
  },

  // Toast/notification
  toast: {
    initial: { y: -100, opacity: 0, scale: 0.9 },
    enter: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -100, opacity: 0, scale: 0.9 },
  },

  // Modal/sheet
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    enter: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  },

  // List item
  listItem: {
    initial: { x: -20, opacity: 0 },
    enter: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },

  // Confetti/celebration
  celebration: {
    initial: { scale: 0, rotate: 0, opacity: 0 },
    explode: { scale: 1.5, rotate: 360, opacity: 1 },
    fall: { y: 100, opacity: 0 },
  },
} as const;

/**
 * Durées standard (en ms)
 */
export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

/**
 * Easings personnalisés
 */
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
} as const;
