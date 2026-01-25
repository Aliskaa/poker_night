import { useToastController } from '@tamagui/toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  duration?: number;
  customData?: Record<string, any>;
}

export const useToast = () => {
  const toast = useToastController();

  const show = (
    title: string,
    options?: {
      message?: string;
      type?: ToastType;
      duration?: number;
    }
  ) => {
    const { message, type = 'info', duration = 4000 } = options || {};

    // Plus besoin des emojis ici, le composant CurrentToast gère les icônes !
    toast.show(title, {
      message: message || '',
      duration,
      customData: { type }, // C'est CA qui permet à CurrentToast de changer de couleur
    });
  };

  const success = (title: string, message?: string, options?: ToastOptions) => {
    show(title, { message, type: 'success', ...options });
  };

  const error = (title: string, message?: string, options?: ToastOptions) => {
    show(title, { message, type: 'error', ...options });
  };

  const warning = (title: string, message?: string, options?: ToastOptions) => {
    show(title, { message, type: 'warning', ...options });
  };

  const info = (title: string, message?: string, options?: ToastOptions) => {
    show(title, { message, type: 'info', ...options });
  };

  const hide = () => {
    toast.hide();
  };

  return {
    show,
    success,
    error,
    warning,
    info,
    hide,
  };
};
