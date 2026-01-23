import '../tamagui-web.css'

import { AppProvider } from '@/providers/AppProvider'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const colorScheme = useColorScheme()

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
    <AppProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <Stack
        screenOptions={{
          headerShown: false, // On gère nos propres headers avec Tamagui souvent, ou on active au cas par cas
          contentStyle: { backgroundColor: '#121212' } // Fond sombre par défaut
        }}
      >
        {/* L'index vérifie l'auth */}
        <Stack.Screen name="index" />

        {/* Groupe Auth (Login/Signup) */}
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />

        {/* Groupe Main (App principale) */}
        <Stack.Screen name="(main)" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AppProvider>
  )
}
