import { XStack, YStack, Text, type YStackProps } from 'tamagui'
import { TrendingUp, ArrowRight } from '@tamagui/lucide-icons'

interface BlindLevelProps extends Omit<YStackProps, 'children'> {
  currentSmallBlind: number
  currentBigBlind: number
  currentAnte?: number
  nextSmallBlind?: number
  nextBigBlind?: number
  nextAnte?: number
  showNext?: boolean
}

export function BlindLevel({ 
  currentSmallBlind,
  currentBigBlind,
  currentAnte = 0,
  nextSmallBlind,
  nextBigBlind,
  nextAnte,
  showNext = true,
  ...props 
}: BlindLevelProps) {
  return (
    <YStack gap="$2" {...props}>
      {/* Niveau actuel */}
      <XStack gap="$2" alignItems="center">
        <TrendingUp size={16} color="$primary" />
        <Text color="$colorTertiary" fontSize="$2" fontWeight="600" textTransform="uppercase">
          Blindes
        </Text>
      </XStack>
      
      <XStack gap="$3" alignItems="center">
        {/* Niveau actuel */}
        <YStack
          backgroundColor="$goldBg"
          borderColor="$primary"
          borderWidth={2}
          borderRadius="$5"
          paddingHorizontal="$3"
          paddingVertical="$2"
        >
          <Text 
            fontFamily="$mono" 
            fontSize="$5" 
            fontWeight="900"
            color="$primary"
            textAlign="center"
          >
            {currentSmallBlind}/{currentBigBlind}
          </Text>
          {currentAnte > 0 && (
            <Text 
              fontFamily="$mono" 
              fontSize="$2" 
              color="$primary"
              textAlign="center"
              opacity={0.8}
            >
              Ante {currentAnte}
            </Text>
          )}
        </YStack>
        
        {/* Flèche vers suivant */}
        {showNext && nextSmallBlind && nextBigBlind && (
          <>
            <ArrowRight size={16} color="$colorMuted" />
            
            {/* Niveau suivant */}
            <YStack
              backgroundColor="$glass2"
              borderColor="$glass4"
              borderWidth={1}
              borderRadius="$5"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <Text 
                fontFamily="$mono" 
                fontSize="$4" 
                fontWeight="700"
                color="$colorSecondary"
                textAlign="center"
              >
                {nextSmallBlind}/{nextBigBlind}
              </Text>
              {nextAnte && nextAnte > 0 && (
                <Text 
                  fontFamily="$mono" 
                  fontSize="$1" 
                  color="$colorTertiary"
                  textAlign="center"
                >
                  Ante {nextAnte}
                </Text>
              )}
            </YStack>
          </>
        )}
      </XStack>
    </YStack>
  )
}

// Version compacte pour header
export function BlindLevelCompact({ 
  currentSmallBlind,
  currentBigBlind,
  currentAnte = 0,
  ...props 
}: Omit<BlindLevelProps, 'nextSmallBlind' | 'nextBigBlind' | 'showNext'> & YStackProps) {
  return (
    <YStack 
      backgroundColor="$goldBg"
      borderColor="$primary"
      borderWidth={1}
      borderRadius="$5"
      paddingHorizontal="$2.5"
      paddingVertical="$1.5"
      alignItems="center"
      {...props}
    >
      <Text 
        fontFamily="$mono" 
        fontSize="$4" 
        fontWeight="900"
        color="$primary"
      >
        {currentSmallBlind}/{currentBigBlind}
      </Text>
      {currentAnte > 0 && (
        <Text 
          fontFamily="$mono" 
          fontSize="$1" 
          color="$primary"
          opacity={0.7}
        >
          A{currentAnte}
        </Text>
      )}
    </YStack>
  )
}
