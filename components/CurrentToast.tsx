import { useToast } from '@/hooks/useToast'
import log from '@/services/logger'
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from '@tamagui/lucide-icons'
import { Toast, useToastController, useToastState } from '@tamagui/toast'
import { Button, H4, XStack, YStack, isWeb } from 'tamagui'

export function CurrentToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  // 1. Récupération du type envoyé depuis useToast (par défaut 'info')
  const type = currentToast.customData?.type || 'info';

  // 2. Configuration dynamique des styles selon le type
  const config = {
    success: {
      icon: <CheckCircle2 size={24} color="$success" />,
      bg: "$successBg",
      border: "$success"
    },
    error: {
      icon: <AlertCircle size={24} color="$danger" />,
      bg: "$dangerBg",
      border: "$danger"
    },
    warning: {
      icon: <AlertTriangle size={24} color="$warning" />,
      bg: "$warningBg",
      border: "$warning"
    },
    info: {
      icon: <Info size={24} color="$accent" />,
      bg: "$glass3",
      border: "$glass5"
    },
  }[type as 'success' | 'error' | 'warning' | 'info'];

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.95, y: -20 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={isWeb ? '$12' : 0}
      animation="quick"

      backgroundColor={config.bg}
      borderColor={config.border}
      borderWidth={1}
      borderRadius="$4"
      padding="$3"
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.3}
      shadowRadius={12}
    >
      <XStack gap="$3" alignItems="center">
        {config.icon}
        <YStack alignItems="center">
          <Toast.Title color="$color" fontWeight="900" fontSize="$4" letterSpacing={0.5}>{currentToast.title}</Toast.Title>
          {!!currentToast.message && (
            <Toast.Description color="$colorMuted" fontSize="$2" marginTop="$1">{currentToast.message}</Toast.Description>
          )}
        </YStack>
      </XStack>
    </Toast>
  )
}

export function ToastControl() {

  const { success, hide } = useToast();

  return (
    <YStack gap="$2" alignItems="center">
      <H4>Toast demo</H4>
      <XStack gap="$2" justifyContent="center">
        <Button
          onPress={() => {
            success("Opération réussie", "Votre action a été effectuée avec succès.");
          }}
        >
          Show
        </Button>
        <Button
          onPress={() => {
            hide()
          }}
        >
          Hide
        </Button>
      </XStack>
    </YStack>
  )
}
