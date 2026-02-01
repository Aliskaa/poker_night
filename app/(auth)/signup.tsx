import React, { useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { YStack, Input, Button, Text, H1, XStack, Spinner, Theme } from 'tamagui';
import { Mail, Lock, User, CheckCircle2, Crown } from '@tamagui/lucide-icons';
import { useAuthContext } from '@/providers/AuthProvider';
import { PokerBackground } from '@/components/ui/PokerBackground';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoaded } = useAuthContext();

  // Infos utilisateur
  const [firstName, setFirstName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  // État
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError(null);

    try {
      const result = await signUp(emailAddress, password, firstName);

      if (result.success) {
        // Email de vérification envoyé, afficher le message
        setEmailSent(true);
        // Rediriger vers home après un délai
        setTimeout(() => {
          router.replace('/(main)/(tabs)/home');
        }, 2000);
      } else {
        setError(result.error || 'Une erreur est survenue.');
      }
    } catch (err: any) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Rendu : Message de confirmation
  // ---------------------------------------------------------------------------
  if (emailSent) {
    return (
      <Theme name="dark">
        <PokerBackground>
          <YStack flex={1} justifyContent="center" padding="$4" gap="$4">
            <YStack gap="$2" marginBottom="$4" alignItems="center">
              <CheckCircle2 size={56} color="$success" />
              <H1 textAlign="center" color="$color" fontWeight="900" marginTop="$2">
                Bienvenue !
              </H1>
              <Text textAlign="center" color="$colorMuted">
                Un email de vérification a été envoyé à {emailAddress}.
              </Text>
              <Text textAlign="center" color="$colorMuted" fontSize="$3" marginTop="$2">
                Redirection en cours...
              </Text>
              <Spinner color="$primary" size="large" marginTop="$4" />
            </YStack>
          </YStack>
        </PokerBackground>
      </Theme>
    );
  }

  // ---------------------------------------------------------------------------
  // Rendu : Formulaire d'inscription
  // ---------------------------------------------------------------------------
  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} justifyContent="center" padding="$4" gap="$4">

          {/* EN-TÊTE */}
          <YStack gap="$2" marginBottom="$6" alignItems="center">
            <YStack backgroundColor="$goldBg" padding="$3" borderRadius="$5" marginBottom="$2">
              <Crown size={40} color="$primary" />
            </YStack>
            <H1 textAlign="center" color="$color" fontWeight="900">Nouveau Joueur</H1>
            <Text textAlign="center" color="$colorMuted" letterSpacing={1} textTransform="uppercase" fontSize="$2">
              Crée ton compte
            </Text>
          </YStack>

          {/* MESSAGE D'ERREUR */}
          {error && (
            <YStack backgroundColor="$red2" borderRadius="$3" padding="$3" marginBottom="$2">
              <Text color="$red10" textAlign="center" fontSize="$3">
                {error}
              </Text>
            </YStack>
          )}

          <YStack gap="$3">
            <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
              <User size={20} color="$colorMuted" />
              <Input 
                flex={1} 
                placeholder="Prénom (ou Pseudo)" 
                value={firstName} 
                onChangeText={(text) => {
                  setFirstName(text);
                  setError(null);
                }} 
                unstyled 
                color="$color"
                height="$14" 
              />
            </XStack>

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
                color="$color"
                height="$14" 
              />
            </XStack>

            <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
              <Lock size={20} color="$colorMuted" />
              <Input 
                flex={1} 
                placeholder="Mot de passe (min. 6 caractères)" 
                value={password} 
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null);
                }} 
                secureTextEntry 
                unstyled 
                color="$color"
                height="$14" 
              />
            </XStack>

            <Button
              size="$5"
              height="$11"
              onPress={onSignUpPress}
              backgroundColor="$primary"
              color="$backgroundStrong"
              fontWeight="900"
              disabled={loading || !emailAddress || !password || password.length < 6}
              pressStyle={{ scale: 0.98, opacity: 0.8 }}
            >
              {loading ? <Spinner color="$backgroundStrong" /> : "Rejoindre la table"}
            </Button>
          </YStack>

          <XStack justifyContent="center" marginTop="$4">
            <Text color="$colorMuted">Déjà inscrit ? </Text>
            <Link href="/(auth)/login" asChild>
              <Text color="$primary" fontWeight="bold">Se connecter</Text>
            </Link>
          </XStack>
        </YStack>
      </PokerBackground>
    </Theme>
  );
}
