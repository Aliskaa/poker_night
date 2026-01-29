import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { YStack, Input, Button, Text, H1, XStack, Spinner, Theme } from 'tamagui';
import { Mail, Lock, User, CheckCircle2, Crown } from '@tamagui/lucide-icons';
import log from '@/services/logger';
import { PokerBackground } from '@/components/ui/PokerBackground';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Étape 1 : Infos
  const [firstName, setFirstName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  
  // Étape 2 : OTP
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ÉTAPE 1 : Création ---
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      await signUp.create({ firstName, emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true); 
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // --- ÉTAPE 2 : Vérification ---
  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      log.debug("SignUp Status:", completeSignUp.status);

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(main)/(tabs)/home');
      }
    } catch (err: any) {
      alert("Code incorrect ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Rendu : ÉTAPE 2 (OTP)
  // ---------------------------------------------------------------------------
  if (pendingVerification) {
    return (
      <Theme name="dark">
        <PokerBackground>
          <YStack flex={1} justifyContent="center" padding="$4" gap="$4">
          <YStack gap="$2" marginBottom="$4" alignItems="center">
            <CheckCircle2 size={56} color="$success" />
            <H1 textAlign="center" color="$color" fontWeight="900" marginTop="$2">Vérification</H1>
            <Text textAlign="center" color="$colorMuted">
              Un code a été envoyé à {emailAddress}.
            </Text>
          </YStack>

          <Input
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            size="$5"
            textAlign="center"
            letterSpacing={8}
            backgroundColor="$backgroundStrong"
            borderColor="$borderColor"
            borderWidth={1}
            color="$color"
            fontWeight="bold"
            fontSize="$6"
            height={60}
          />

          <Button 
            size="$5" 
            onPress={onPressVerify} 
            backgroundColor="$success" 
            color="white" 
            fontWeight="900"
            disabled={loading}
          >
            {loading ? <Spinner color="white" /> : 'Valider mon compte'}
          </Button>
          </YStack>
        </PokerBackground>
      </Theme>
    );
  }

  // ---------------------------------------------------------------------------
  // Rendu : ÉTAPE 1 (Formulaire)
  // ---------------------------------------------------------------------------
  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} justifyContent="center" padding="$4" gap="$4">
        
        {/* EN-TÊTE */}
        <YStack gap="$2" marginBottom="$6" alignItems="center">
            <YStack backgroundColor="rgba(251, 191, 36, 0.1)" padding="$3" borderRadius="$5" marginBottom="$2">
                <Crown size={40} color="$primary" />
            </YStack>
            <H1 textAlign="center" color="$color" fontWeight="900">Nouveau Joueur</H1>
            <Text textAlign="center" color="$colorMuted" letterSpacing={1} textTransform="uppercase" fontSize="$2">
                Crée ton compte
            </Text>
        </YStack>

        <YStack gap="$3">
          <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
            <User size={20} color="$colorMuted" />
            <Input flex={1} placeholder="Prénom (ou Pseudo)" value={firstName} onChangeText={setFirstName} unstyled color="$color" height={50} />
          </XStack>

          <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
            <Mail size={20} color="$colorMuted" />
            <Input flex={1} placeholder="Email" value={emailAddress} onChangeText={setEmailAddress} autoCapitalize="none" unstyled color="$color" height={50} />
          </XStack>

          <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" backgroundColor="$backgroundStrong" borderRadius="$4" paddingHorizontal="$3">
            <Lock size={20} color="$colorMuted" />
            <Input flex={1} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry unstyled color="$color" height={50} />
          </XStack>

          <Button 
            size="$5" 
            onPress={onSignUpPress} 
            backgroundColor="$primary" 
            color="$backgroundStrong" 
            fontWeight="900"
            disabled={loading}
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