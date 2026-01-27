import { useSyncUser } from '@/hooks/useSyncUser';
import { Stack } from 'expo-router';

export default function MainLayout() {
  useSyncUser();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 1. LA ZONE AVEC LA BARRE DE NAVIGATION */}
      <Stack.Screen name="(tabs)" />

      {/* 2. LES ÉCRANS MODAUX (Plein écran, SANS la barre de navigation) */}
      <Stack.Screen
        name="create-game"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Créer une Partie',
          headerStyle: {
            backgroundColor: '#121212', // Dark theme background
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
            backgroundColor: '#121212', // Dark theme background
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
            backgroundColor: '#121212', // Dark theme background
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      {/* 3. L'ÉCRAN DE JEU (Plein écran) */}
      <Stack.Screen name="game/[id]" />
      <Stack.Screen name="groups/[id]" />
    </Stack>
  );
}