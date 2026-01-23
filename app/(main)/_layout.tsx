import { router, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Button, XStack } from 'tamagui';
import { LogOut } from '@tamagui/lucide-icons';

export default function MainLayout() {
  const { signOut } = useAuth();

  const onPressSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212', // Dark theme background
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="home" 
        options={{
          title: "Dashboard",
          // Petit bouton de déconnexion temporaire dans le header
          headerRight: () => (
            <Button size="$2" chromeless onPress={onPressSignOut} icon={<LogOut size={20} color="$red10"/>} />
          )
        }} 
      />
      {/* On prépare la route pour la table de jeu */}
      <Stack.Screen 
        name="game/[id]" 
        options={{ title: "Table de jeu", headerShown: false }} 
      />
    </Stack>
  );
}