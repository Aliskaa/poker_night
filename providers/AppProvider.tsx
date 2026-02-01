import { CurrentToast } from '@/components/CurrentToast';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

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
  )
}
