import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { YStack, Input, Button, Text, H2, XStack, Spinner, useTheme } from 'tamagui';
import { Mail, Lock, User, CheckCircle2 } from '@tamagui/lucide-icons';
import log from '@/services/logger';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Étape 1 : Infos de base
  const [firstName, setFirstName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  
  // Étape 2 : Vérification
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ÉTAPE 1 : Création du compte ---
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      await signUp.create({
        firstName,
        emailAddress,
        password,
      });

      // Envoi du code de vérification par email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true); // Bascule sur l'écran du code
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // --- ÉTAPE 2 : Vérification du code OTP ---
  const onPressVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      log.debug("SignUp Status:", completeSignUp.status);

      if (completeSignUp.status === 'complete') {
        // 1. On active la session
        await setActive({ session: completeSignUp.createdSessionId });
        
        // 2. CORRECTION ICI : On redirige explicitement l'utilisateur vers le Dashboard
        router.replace('/(main)/home');
      }
      // La redirection vers (main)/home est automatique via app/index.tsx
    } catch (err: any) {
      alert("Code incorrect ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Rendu de l'écran de Vérification (Étape 2)
  // ---------------------------------------------------------------------------
  if (pendingVerification) {
    return (
      <YStack flex={1} justifyContent="center" padding="$4" backgroundColor="$background" gap="$4">
        <YStack gap="$2" marginBottom="$4" alignItems="center">
          <CheckCircle2 size={48} color="$green10" />
          <H2 textAlign="center" color="$color">Vérification</H2>
          <Text textAlign="center" color="$color">
            Un code a été envoyé à {emailAddress}. Entre-le ci-dessous.
          </Text>
        </YStack>

        <Input
          placeholder="Code à 6 chiffres"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          size="$5"
          textAlign="center"
          letterSpacing={5}
        />

        <Button onPress={onPressVerify} backgroundColor="$green10" color="white" disabled={loading}>
          {loading ? <Spinner color="white" /> : 'Valider'}
        </Button>
      </YStack>
    );
  }

  // ---------------------------------------------------------------------------
  // Rendu de l'écran d'Inscription (Étape 1)
  // ---------------------------------------------------------------------------
  return (
    <YStack flex={1} justifyContent="center" padding="$4" backgroundColor="$background" gap="$4">
      <YStack gap="$2" marginBottom="$4">
        <H2 textAlign="center" color="$color">Nouveau Joueur</H2>
        <Text textAlign="center" color="$color">
          Rejoins la table.
        </Text>
      </YStack>

      <YStack gap="$3">
        {/* Champ Prénom (Important pour l'affichage in-game) */}
        <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" borderRadius="$4" paddingHorizontal="$3">
          <User size={20} color="$color" />
          <Input flex={1} placeholder="Prénom (ou Pseudo)" value={firstName} onChangeText={setFirstName} unstyled />
        </XStack>

        <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" borderRadius="$4" paddingHorizontal="$3">
          <Mail size={20} color="$color" />
          <Input flex={1} placeholder="Email" value={emailAddress} onChangeText={setEmailAddress} autoCapitalize="none" unstyled />
        </XStack>

        <XStack alignItems="center" gap="$2" borderWidth={1} borderColor="$borderColor" borderRadius="$4" paddingHorizontal="$3">
          <Lock size={20} color="$color" />
          <Input flex={1} placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry unstyled />
        </XStack>

        <Button onPress={onSignUpPress} backgroundColor="$blue10" color="white" disabled={loading}>
          {loading ? <Spinner color="white" /> : "S'inscrire"}
        </Button>
      </YStack>

      <XStack justifyContent="center" marginTop="$4">
        <Text color="$color">Déjà inscrit ? </Text>
        <Link href="/(auth)/login" asChild>
          <Text color="$blue10" fontWeight="bold">Se connecter</Text>
        </Link>
      </XStack>
    </YStack>
  );
}