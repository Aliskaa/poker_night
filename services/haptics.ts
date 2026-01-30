import * as Haptics from 'expo-haptics';

/**
 * Service de feedback haptique pour améliorer l'UX
 */

export const hapticFeedback = {
  /**
   * Feedback léger pour interactions standard
   */
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptic feedback not available', error);
    }
  },

  /**
   * Feedback moyen pour confirmations
   */
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptic feedback not available', error);
    }
  },

  /**
   * Feedback fort pour actions importantes
   */
  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.warn('Haptic feedback not available', error);
    }
  },

  /**
   * Feedback de succès
   */
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Haptic feedback not available', error);
    }
  },

  /**
   * Feedback d'avertissement
   */
  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptic feedback not available', error);
    }
  },

  /**
   * Feedback d'erreur
   */
  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptic feedback not available', error);
    }
  },

  /**
   * Feedback de sélection (roue/picker)
   */
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn('Haptic feedback not available', error);
    }
  },

  /**
   * Feedback poker : Deal de cartes
   */
  dealCard: async () => {
    await hapticFeedback.light();
  },

  /**
   * Feedback poker : Mise de jetons
   */
  placeBet: async () => {
    await hapticFeedback.medium();
  },

  /**
   * Feedback poker : Victoire
   */
  win: async () => {
    // Double vibration pour célébration
    await hapticFeedback.success();
    setTimeout(async () => await hapticFeedback.medium(), 100);
  },

  /**
   * Feedback poker : Élimination
   */
  eliminated: async () => {
    await hapticFeedback.heavy();
  },

  /**
   * Feedback poker : Changement de niveau de blinds
   */
  blindLevelUp: async () => {
    await hapticFeedback.warning();
  },
};
