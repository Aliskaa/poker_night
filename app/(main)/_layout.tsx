import { useSyncUser } from '@/hooks/useSyncUser';
import { useAuthContext } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';
import { Spinner, YStack } from 'tamagui';

export default function MainLayout() {
  const { isSignedIn, isLoaded } = useAuthContext();

  useSyncUser();

  if (!isLoaded) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />

      <Stack.Screen
        name="create-game"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Créer une Partie',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="lobby"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Lobby de la Partie',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="hand-ranking"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Classement des Combinaisons',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <Stack.Screen name="game/[id]" />
      <Stack.Screen name="groups/[id]" />

      <Stack.Screen
        name="showcase"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: '🎨 UI Showcase',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}
