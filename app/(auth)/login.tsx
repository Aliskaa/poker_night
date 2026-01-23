import React, { useCallback, useEffect, useState } from 'react';
import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { YStack, Input, Button, Text, H2, XStack, Spinner, useTheme } from 'tamagui';
import { Mail, Lock, LogIn, Chrome } from '@tamagui/lucide-icons';
import * as Linking from "expo-linking";
import * as WebBrowser from 'expo-web-browser'
import log from '@/services/logger';
import { Platform } from 'react-native';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {

    useWarmUpBrowser()

    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const theme = useTheme();
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
                router.replace('/(main)/home');
            }
        } catch (err: any) {
            alert("Identifiants incorrects.");
        } finally {
            setLoading(false);
        }
    };

    const onPressGoogle = useCallback(async () => {
        try {
            // On redirige vers la page courante pour que WebBrowser intercepte
            const linkedUrl = Linking.createURL("/(auth)/login", { scheme: "pokernight" });

            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: linkedUrl,
            });

            // CAS 1 : C'est une connexion normale (l'utilisateur existe déjà)
            if (createdSessionId) {
                log.debug("🟢 Google Login: Existing User, Session ID:", createdSessionId);
                await setActive!({ session: createdSessionId });
                router.replace('/(main)/home');
            } 
            // CAS 2 : C'est un NOUVEAU compte (Inscription via Google)
            else if (signUp?.createdSessionId) {
                log.debug("🟢 Google Signup: New User, Session ID:", signUp.createdSessionId);
                await setActive!({ session: signUp.createdSessionId });
                router.replace('/(main)/home');
            } 
            // CAS 3 : Échec ou 2FA manquant
            else {
                log.error("🔴 Google Auth: Pas de session créée. État SignIn:", signIn?.status, "État SignUp:", signUp?.status);
            }
        } catch (err) {
            log.error("🔴 Erreur Google SSO :", JSON.stringify(err, null, 2));
        }
    }, [startSSOFlow, router]);

    return (
        <YStack flex={1} justifyContent="center" padding="$4" backgroundColor="$background" gap="$4">
            <YStack gap="$2" marginBottom="$4">
                <H2 textAlign="center" color="$color">Poker Night ♠️</H2>
                <Text textAlign="center" color="$gray10" opacity={0.7}>
                    Connecte-toi pour plumer tes potes.
                </Text>
            </YStack>

            {/* Formulaire */}
            <YStack gap="$3">
                <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" borderRadius="$4" paddingHorizontal="$3">
                    <Mail size={20} color="$gray10" />
                    <Input
                        flex={1}
                        placeholder="Email"
                        value={emailAddress}
                        onChangeText={setEmailAddress}
                        autoCapitalize="none"
                        unstyled // Pour enlever le style par défaut et garder celui du container si besoin
                        backgroundColor="transparent"
                        borderWidth={0}
                    />
                </XStack>

                <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" borderRadius="$4" paddingHorizontal="$3">
                    <Lock size={20} color="$gray10" />
                    <Input
                        flex={1}
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        unstyled
                        backgroundColor="transparent"
                        borderWidth={0}
                    />
                </XStack>

                <Button
                    onPress={onSignInPress}
                    backgroundColor="$blue10"
                    color="white"
                    disabled={loading}
                    icon={loading ? <Spinner color="white" /> : <LogIn size={18} />}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
            </YStack>

            {/* Lien vers Signup */}
            <XStack justifyContent="center" marginTop="$4">
                <Text color="$gray10">Pas de compte ? </Text>
                <Link href="/(auth)/signup" asChild>
                    <Text color="$blue10" fontWeight="bold">Créer un compte</Text>
                </Link>
            </XStack>

            <XStack justifyContent="center" margin="$4" borderBlockColor="$borderColor" borderBlockWidth={1}>

            </XStack>
            <Button
                size="$4"
                borderColor="$borderColor"
                borderWidth={1}
                borderRadius={14}
                // m="$5"
                onPress={onPressGoogle}
                icon={<Chrome size={20} color="#EA4335" />}
                animation="bouncy"
                pressStyle={{ bg: '$backgroundHover', scale: 0.98 }}
            >
                <Text fontFamily="$body" fontWeight="600" color="$color">
                    Continuer avec Google
                </Text>
            </Button>


        </YStack>
    );
}