import { useEffect } from 'react';
import { View, Spinner } from 'tamagui';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace('/(main)/(tabs)/home' as any);
    } else {
      router.replace('/(auth)/login');
    }
  }, [isSignedIn, isLoaded]);

  return (
    <View flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
      <Spinner size="large" color="$color" />
    </View>
  );
}