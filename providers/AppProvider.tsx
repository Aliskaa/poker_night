import { CurrentToast } from '@/components/CurrentToast';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ToastProvider
          swipeDirection="horizontal"
          duration={6000}
          native={
            [
              // uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go
              // 'mobile'
            ]
          }
        >
          {children}
          <CurrentToast />
          <ToastViewport top="$8" left={0} right={0} />
        </ToastProvider>
      </TamaguiProvider>
    </AuthProvider>
  );
}
