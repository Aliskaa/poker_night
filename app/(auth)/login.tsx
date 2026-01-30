import React, { useCallback, useEffect, useState } from 'react';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { YStack, Input, Button, Text, H1, XStack, Spinner, useTheme, Separator, Theme } from 'tamagui';
import { Mail, Lock, LogIn, Chrome, Spade } from '@tamagui/lucide-icons';
import * as Linking from "expo-linking";
import * as WebBrowser from 'expo-web-browser';
import log from '@/services/logger';
import { Platform } from 'react-native';
import { PokerBackground } from '@/components/ui/PokerBackground';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
    useWarmUpBrowser()

    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const { startSSOFlow } = useSSO()

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId });
                router.replace('/(main)/(tabs)/home');
            }
        } catch (err: any) {
            alert("Identifiants incorrects.");
        } finally {
            setLoading(false);
        }
    };

    const onPressGoogle = useCallback(async () => {
        try {
            const linkedUrl = Linking.createURL("/(auth)/login", { scheme: "pokernight" });

            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: linkedUrl,
            });

            if (createdSessionId) {
                log.debug("🟢 Google Login: Existing User, Session ID:", createdSessionId);
                await setActive!({ session: createdSessionId });
                router.replace('/(main)/(tabs)/home');
            } else if (signUp?.createdSessionId) {
                log.debug("🟢 Google Signup: New User, Session ID:", signUp.createdSessionId);
                await setActive!({ session: signUp.createdSessionId });
                router.replace('/(main)/(tabs)/home');
            } else {
                log.error("🔴 Google Auth: Pas de session créée.");
            }
        } catch (err) {
            log.error("🔴 Erreur Google SSO :", JSON.stringify(err, null, 2));
        }
    }, [startSSOFlow, router]);

    return (
        <Theme name="dark">
            <PokerBackground>
                <YStack flex={1} justifyContent="center" padding="$4" gap="$4">
                
                {/* EN-TÊTE : Logo et Titre */}
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

                {/* FORMULAIRE TRADITIONNEL */}
                <YStack gap="$3">
                    <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
                        <Mail size={20} color="$colorMuted" />
                        <Input
                            flex={1}
                            placeholder="Email"
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                            autoCapitalize="none"
                            unstyled 
                            backgroundColor="transparent"
                            borderWidth={0}
                            color="$color"
                            height={50}
                        />
                    </XStack>

                    <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
                        <Lock size={20} color="$colorMuted" />
                        <Input
                            flex={1}
                            placeholder="Mot de passe"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            unstyled
                            backgroundColor="transparent"
                            borderWidth={0}
                            color="$color"
                            height={50}
                        />
                    </XStack>

                    {/* BOUTON CONNEXION EN OR */}
                    <Button
                        size="$5"
                        onPress={onSignInPress}
                        backgroundColor="$primary"
                        color="$backgroundStrong"
                        fontWeight="900"
                        disabled={loading}
                        icon={loading ? <Spinner color="$backgroundStrong" /> : <LogIn size={20} color="$backgroundStrong" />}
                        pressStyle={{ scale: 0.98, opacity: 0.8 }}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </YStack>

                {/* SÉPARATION */}
                <XStack alignItems="center" gap="$3" marginVertical="$4">
                    <Separator borderColor="$borderColor" flex={1} />
                    <Text color="$colorMuted" fontSize="$2" fontWeight="bold">OU</Text>
                    <Separator borderColor="$borderColor" flex={1} />
                </XStack>

                {/* BOUTON GOOGLE */}
                <Button
                    size="$5"
                    borderColor="$borderColor"
                    backgroundColor="$backgroundStrong"
                    borderWidth={1}
                    onPress={onPressGoogle}
                    icon={<Chrome size={20} color="#EA4335" />}
                    animation="bouncy"
                    pressStyle={{ bg: '$backgroundHover', scale: 0.98 }}
                >
                    <Text fontWeight="600" color="$color">
                        Continuer avec Google
                    </Text>
                </Button>

                {/* LIEN VERS SIGNUP */}
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