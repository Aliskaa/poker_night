import { YStack, XStack, Spinner, Text, type YStackProps } from 'tamagui'
import { AlertCircle } from '@tamagui/lucide-icons'

interface LoadingStateProps extends YStackProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

export function LoadingState({ 
  message = 'Chargement...', 
  size = 'medium',
  ...props 
}: LoadingStateProps) {
  const sizeConfig = {
    small: { spinnerSize: 'small' as const, fontSize: '$3' as const },
    medium: { spinnerSize: 'large' as const, fontSize: '$4' as const },
    large: { spinnerSize: 'large' as const, fontSize: '$6' as const },
  }[size]

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$3"
      padding="$4"
      opacity={1}
      {...props}
    >
      <Spinner size={sizeConfig.spinnerSize} color="$primary" />
      <Text 
        color="$colorSecondary" 
        fontSize={sizeConfig.fontSize}
        textAlign="center"
      >
        {message}
      </Text>
    </YStack>
  )
}

interface ErrorStateProps extends YStackProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ 
  message = 'Une erreur est survenue',
  onRetry,
  ...props 
}: ErrorStateProps) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$4"
      padding="$4"
      {...props}
    >
      <AlertCircle size={48} color="$danger" />
      <Text 
        color="$colorPrimary" 
        fontSize="$6"
        fontWeight="700"
        textAlign="center"
      >
        Oups !
      </Text>
      <Text 
        color="$colorSecondary" 
        fontSize="$4"
        textAlign="center"
      >
        {message}
      </Text>
      {onRetry && (
        <YStack
          backgroundColor="$primary"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderRadius="$5"
          onPress={onRetry}
          pressStyle={{ scale: 0.95 }}
          animation="quick"
        >
          <Text color="$night900" fontWeight="700">
            Réessayer
          </Text>
        </YStack>
      )}
    </YStack>
  )
}

interface EmptyStateProps extends YStackProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onPress: () => void
  }
}

export function EmptyState({ 
  icon,
  title,
  description,
  action,
  ...props 
}: EmptyStateProps) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$3"
      padding="$4"
      {...props}
    >
      {icon && (
        <YStack opacity={0.4}>
          {icon}
        </YStack>
      )}
      <Text 
        color="$colorPrimary" 
        fontSize="$6"
        fontWeight="700"
        textAlign="center"
      >
        {title}
      </Text>
      {description && (
        <Text 
          color="$colorSecondary" 
          fontSize="$4"
          textAlign="center"
          maxWidth={300}
        >
          {description}
        </Text>
      )}
      {action && (
        <YStack
          backgroundColor="$primary"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderRadius="$5"
          marginTop="$2"
          onPress={action.onPress}
          pressStyle={{ scale: 0.95 }}
          animation="quick"
        >
          <Text color="$night900" fontWeight="700">
            {action.label}
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
