import { auth } from '@/services/firebase'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { Chrome } from '@tamagui/lucide-icons'
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'expo-router'
import React, { useCallback } from 'react'
import { Platform } from 'react-native'
import { Button, Spinner, Text } from 'tamagui'

WebBrowser.maybeCompleteAuthSession()

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID

function googleAuthErrorMessage(code: string): string {
  const map: Record<string, string> = {
    'auth/popup-closed-by-user': 'Fenêtre de connexion fermée.',
    'auth/cancelled-popup-request': 'Connexion annulée.',
    'auth/unauthorized-domain':
      'Domaine non autorisé (Firebase → Authentication → Paramètres → Domaines autorisés).',
  }
  return map[code] ?? `Erreur Google (${code})`
}

/** Web : popup Firebase. Natif : OAuth Google (expo-auth-session) puis signInWithCredential. */
export function GoogleSignInButton({
  disabled,
  loading,
  onLoadingChange,
  onError,
}: {
  disabled?: boolean
  loading: boolean
  onLoadingChange: (v: boolean) => void
  onError: (msg: string | null) => void
}) {
  const router = useRouter()

  const onSuccess = useCallback(() => {
    router.replace('/(main)/(tabs)/home')
  }, [router])

  if (Platform.OS === 'web') {
    return (
      <WebGoogleButton
        disabled={disabled}
        loading={loading}
        onLoadingChange={onLoadingChange}
        onError={onError}
        onSuccess={onSuccess}
      />
    )
  }

  return (
    <NativeGoogleButton
      disabled={disabled}
      loading={loading}
      onLoadingChange={onLoadingChange}
      onError={onError}
      onSuccess={onSuccess}
    />
  )
}

function WebGoogleButton({
  disabled,
  loading,
  onLoadingChange,
  onError,
  onSuccess,
}: {
  disabled?: boolean
  loading: boolean
  onLoadingChange: (v: boolean) => void
  onError: (msg: string | null) => void
  onSuccess: () => void
}) {
  const onPress = async () => {
    onError(null)
    onLoadingChange(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
      onSuccess()
    } catch (e: unknown) {
      const code =
        typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: string }).code) : ''
      onError(code ? googleAuthErrorMessage(code) : 'Connexion Google impossible.')
    } finally {
      onLoadingChange(false)
    }
  }

  return (
    <Button
      size="$5"
      height="$11"
      borderColor="$borderColor"
      backgroundColor="$backgroundStrong"
      borderWidth={1}
      onPress={onPress}
      icon={loading ? <Spinner color="$color" /> : <Chrome size={20} color="$danger" />}
      animation="bouncy"
      pressStyle={{ bg: '$backgroundHover', scale: 0.98 }}
      disabled={disabled || loading}
    >
      <Text fontWeight="600" color="$color">
        Continuer avec Google
      </Text>
    </Button>
  )
}

function NativeGoogleButton({
  disabled,
  loading,
  onLoadingChange,
  onError,
  onSuccess,
}: {
  disabled?: boolean
  loading: boolean
  onLoadingChange: (v: boolean) => void
  onError: (msg: string | null) => void
  onSuccess: () => void
}) {
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: webClientId ?? undefined,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  })

  const onPress = async () => {
    onError(null)
    if (!webClientId) {
      onError(
        'Définissez EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (ID client Web, ex. depuis Firebase → Auth → Google).'
      )
      return
    }
    if (!request) {
      onError('Préparation de la connexion Google… réessayez dans un instant.')
      return
    }

    onLoadingChange(true)
    try {
      const result = await promptAsync()

      if (
        result.type === 'cancel' ||
        result.type === 'dismiss' ||
        result.type === 'opened' ||
        result.type === 'locked'
      ) {
        return
      }
      if (result.type === 'error') {
        onError(result.error?.message ?? 'Erreur OAuth Google.')
        return
      }
      if (result.type !== 'success') {
        return
      }

      const idToken = result.params.id_token
      if (!idToken) {
        onError(
          'Jeton id_token manquant. Vérifiez les identifiants OAuth Google (Web / iOS / Android) et le fournisseur Google dans Firebase.'
        )
        return
      }

      const credential = GoogleAuthProvider.credential(idToken)
      await signInWithCredential(auth, credential)
      onSuccess()
    } catch (e: unknown) {
      const code =
        typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: string }).code) : ''
      onError(code ? googleAuthErrorMessage(code) : 'Connexion Google impossible.')
    } finally {
      onLoadingChange(false)
    }
  }

  return (
    <Button
      size="$5"
      height="$11"
      borderColor="$borderColor"
      backgroundColor="$backgroundStrong"
      borderWidth={1}
      onPress={onPress}
      icon={loading ? <Spinner color="$color" /> : <Chrome size={20} color="$danger" />}
      animation="bouncy"
      pressStyle={{ bg: '$backgroundHover', scale: 0.98 }}
      disabled={disabled || loading || !request}
    >
      <Text fontWeight="600" color="$color">
        Continuer avec Google
      </Text>
    </Button>
  )
}
