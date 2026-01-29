import { XStack, YStack, Text, Circle, type XStackProps } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'
import { Children, ReactNode } from 'react'

interface StepperProps extends XStackProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
  onStepPress?: (step: number) => void
  allowStepNavigation?: boolean
}

export function Stepper({ 
  currentStep, 
  totalSteps,
  labels = [],
  onStepPress,
  allowStepNavigation = false,
  ...props 
}: StepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)
  
  return (
    <XStack 
      justifyContent="space-between" 
      alignItems="center"
      paddingHorizontal="$4"
      paddingVertical="$3"
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep
        const isClickable = allowStepNavigation && (isCompleted || isCurrent)
        
        return (
          <XStack key={step} alignItems="center" flex={1}>
            {/* Step Circle */}
            <YStack 
              alignItems="center" 
              gap="$2"
              onPress={isClickable ? () => onStepPress?.(step) : undefined}
              cursor={isClickable ? 'pointer' : 'default'}
            >
              <Circle
                size={40}
                backgroundColor={
                  isCompleted ? '$success' : 
                  isCurrent ? '$primary' : 
                  '$glass2'
                }
                borderWidth={2}
                borderColor={
                  isCompleted ? '$success' : 
                  isCurrent ? '$primary' : 
                  '$glass4'
                }
                animation="quick"
                scale={isCurrent ? 1.1 : 1}
              >
                {isCompleted ? (
                  <Check size={20} color="$night900" strokeWidth={3} />
                ) : (
                  <Text 
                    color={isCurrent ? '$night900' : '$colorSecondary'}
                    fontWeight="700"
                    fontSize="$4"
                  >
                    {step}
                  </Text>
                )}
              </Circle>
              
              {labels[index] && (
                <Text
                  color={isCurrent ? '$primary' : '$colorTertiary'}
                  fontSize="$2"
                  fontWeight={isCurrent ? '600' : '400'}
                  textAlign="center"
                  maxWidth={80}
                  numberOfLines={2}
                >
                  {labels[index]}
                </Text>
              )}
            </YStack>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <YStack 
                flex={1} 
                height={2}
                backgroundColor={step < currentStep ? '$success' : '$glass3'}
                marginHorizontal="$2"
                marginTop={labels[index] ? -20 : 0}
                animation="quick"
              />
            )}
          </XStack>
        )
      })}
    </XStack>
  )
}

// Composant pour gérer les contenus de steps avec navigation
interface StepContainerProps {
  currentStep: number
  children: ReactNode
}

export function StepContainer({ currentStep, children }: StepContainerProps) {
  const steps = Children.toArray(children)
  return <>{steps[currentStep - 1]}</>
}

// Composant Step individuel (wrapper sémantique)
interface StepProps {
  children: ReactNode
  title?: string
}

export function Step({ children, title }: StepProps) {
  return (
    <YStack flex={1} gap="$4">
      {title && (
        <Text 
          fontSize="$6" 
          fontWeight="700" 
          color="$colorPrimary"
          paddingHorizontal="$4"
        >
          {title}
        </Text>
      )}
      {children}
    </YStack>
  )
}

// Hook helper pour gérer la navigation du stepper
export function useStepper(totalSteps: number, initialStep: number = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }
  
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  
  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
  }
}

// Import nécessaire pour le hook
import { useState } from 'react'
