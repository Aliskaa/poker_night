import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { YStack, Input, Button, Text, H1, XStack, Spinner, Theme, Separator } from 'tamagui';
import { Mail, Lock, LogIn, Spade } from '@tamagui/lucide-icons';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuthContext } from '@/providers/AuthProvider';
import { PokerBackground } from '@/components/ui/PokerBackground';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn, isLoaded } = useAuthContext();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);
        setError(null);

        try {
            const result = await signIn(emailAddress, password);

            if (result.success) {
                router.replace('/(main)/(tabs)/home');
            } else {
                setError(result.error || 'Identifiants incorrects.');
            }
        } catch (err: any) {
            setError('Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Theme name="dark">
            <PokerBackground>
                <YStack flex={1} justifyContent="center" padding="$4" gap="$4">

                    <YStack gap="$2" marginBottom="$6" alignItems="center">
                        <YStack backgroundColor="$goldBg" padding="$3" borderRadius="$5" marginBottom="$2">
                            <Spade size={40} color="$primary" />
                        </YStack>
                        <H1 textAlign="center" color="$primary" fontWeight="900" letterSpacing={-1}>
                            Poker Night
                        </H1>
                        <Text textAlign="center" color="$colorMuted" letterSpacing={1} textTransform="uppercase" fontSize="$2">
                            Prends place à la table
                        </Text>
                    </YStack>

                    {error && (
                        <YStack backgroundColor="$red2" borderRadius="$3" padding="$3" marginBottom="$2">
                            <Text color="$red10" textAlign="center" fontSize="$3">
                                {error}
                            </Text>
                        </YStack>
                    )}

                    <YStack gap="$3">
                        <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
                            <Mail size={20} color="$colorMuted" />
                            <Input
                                flex={1}
                                placeholder="Email"
                                value={emailAddress}
                                onChangeText={(text) => {
                                    setEmailAddress(text);
                                    setError(null);
                                }}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                unstyled
                                backgroundColor="transparent"
                                borderWidth={0}
                                color="$color"
                                height="$14"
                            />
                        </XStack>

                        <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
                            <Lock size={20} color="$colorMuted" />
                            <Input
                                flex={1}
                                placeholder="Mot de passe"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError(null);
                                }}
                                secureTextEntry
                                unstyled
                                backgroundColor="transparent"
                                borderWidth={0}
                                color="$color"
                                height="$14"
                            />
                        </XStack>

                        <Button
                            size="$5"
                            height="$11"
                            onPress={onSignInPress}
                            backgroundColor="$primary"
                            color="$backgroundStrong"
                            fontWeight="900"
                            disabled={loading || !emailAddress || !password}
                            icon={loading ? <Spinner color="$backgroundStrong" /> : <LogIn size={20} color="$backgroundStrong" />}
                            pressStyle={{ scale: 0.98, opacity: 0.8 }}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </YStack>

                    <XStack alignItems="center" gap="$3" marginVertical="$4">
                        <Separator borderColor="$borderColor" flex={1} />
                        <Text color="$colorMuted" fontSize="$2" fontWeight="bold">OU</Text>
                        <Separator borderColor="$borderColor" flex={1} />
                    </XStack>

                    <GoogleSignInButton
                        disabled={loading}
                        loading={loading}
                        onLoadingChange={setLoading}
                        onError={setError}
                    />

                    <XStack justifyContent="center" marginTop="$4">
                        <Text color="$colorMuted">Pas encore inscrit ? </Text>
                        <Link href="/(auth)/signup" asChild>
                            <Text color="$primary" fontWeight="bold">Créer un compte</Text>
                        </Link>
                    </XStack>

                </YStack>
            </PokerBackground>
        </Theme>
    );
}
