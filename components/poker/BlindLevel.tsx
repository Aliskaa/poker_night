import React from 'react';
import { XStack, YStack, Text, View } from 'tamagui';
import { ArrowRight } from '@tamagui/lucide-icons';

// ═══════════════════════════════════════════════════════════════════
// 🎯 BLIND LEVEL - Affichage du niveau de blinds actuel
// ═══════════════════════════════════════════════════════════════════

type BlindLevelProps = {
  small: number;
  big: number;
  ante?: number;
  level: number;
  nextLevel?: {
    small: number;
    big: number;
    ante?: number;
  };
  variant?: 'compact' | 'full';
  showNext?: boolean;
};

// ─────────────────────────────────────────────────────────────────
// VARIANT: COMPACT
// ─────────────────────────────────────────────────────────────────
const CompactBlindLevel: React.FC<BlindLevelProps> = ({
  small,
  big,
  ante,
  level,
}) => {
  return (
    <XStack alignItems="center" gap="$2">
      <View
        backgroundColor="$primary"
        paddingHorizontal="$2"
        paddingVertical="$1"
        borderRadius="$2"
      >
        <Text fontSize="$1" fontWeight="900" color="$night900">
          NIV {level}
        </Text>
      </View>
      
      <Text fontSize="$3" fontWeight="700" color="$colorPrimary">
        {small}/{big}
      </Text>
      
      {ante && ante > 0 && (
        <>
          <Text fontSize="$2" color="$colorMuted">•</Text>
          <Text fontSize="$2" color="$colorSecondary">
            Ante: {ante}
          </Text>
        </>
      )}
    </XStack>
  );
};

// ─────────────────────────────────────────────────────────────────
// VARIANT: FULL
// ─────────────────────────────────────────────────────────────────
const FullBlindLevel: React.FC<BlindLevelProps> = ({
  small,
  big,
  ante,
  level,
  nextLevel,
  showNext = true,
}) => {
  return (
    <YStack
      backgroundColor="$glass3"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$5"
      padding="$4"
      gap="$3"
    >
      {/* Header niveau */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text 
          fontSize="$2" 
          fontWeight="600" 
          color="$colorMuted"
          textTransform="uppercase"
          letterSpacing={1}
        >
          Niveau Actuel
        </Text>
        <View
          backgroundColor="$primary"
          paddingHorizontal="$3"
          paddingVertical="$1.5"
          borderRadius="$3"
        >
          <Text fontSize="$2" fontWeight="900" color="$night900">
            NIVEAU {level}
          </Text>
        </View>
      </XStack>

      {/* Blinds actuelles */}
      <XStack gap="$4" alignItems="center">
        <YStack flex={1} gap="$1">
          <Text fontSize="$2" color="$colorMuted" fontWeight="600">
            Small Blind
          </Text>
          <Text fontSize="$6" fontWeight="900" color="$colorPrimary">
            {small.toLocaleString('fr-FR')}
          </Text>
        </YStack>

        <View width={1} height={40} backgroundColor="$borderColor" />

        <YStack flex={1} gap="$1">
          <Text fontSize="$2" color="$colorMuted" fontWeight="600">
            Big Blind
          </Text>
          <Text fontSize="$6" fontWeight="900" color="$colorPrimary">
            {big.toLocaleString('fr-FR')}
          </Text>
        </YStack>

        {ante && ante > 0 && (
          <>
            <View width={1} height={40} backgroundColor="$borderColor" />
            <YStack flex={1} gap="$1">
              <Text fontSize="$2" color="$colorMuted" fontWeight="600">
                Ante
              </Text>
              <Text fontSize="$6" fontWeight="900" color="$warning">
                {ante.toLocaleString('fr-FR')}
              </Text>
            </YStack>
          </>
        )}
      </XStack>

      {/* Prochain niveau */}
      {showNext && nextLevel && (
        <>
          <View height={1} backgroundColor="$borderColor" />
          
          <XStack alignItems="center" gap="$2">
            <ArrowRight size={16} color="$colorMuted" />
            <Text fontSize="$2" color="$colorMuted" fontWeight="600">
              Prochain:
            </Text>
            <Text fontSize="$3" fontWeight="700" color="$colorSecondary">
              {nextLevel.small}/{nextLevel.big}
              {nextLevel.ante && nextLevel.ante > 0 && ` • Ante: ${nextLevel.ante}`}
            </Text>
          </XStack>
        </>
      )}
    </YStack>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export const BlindLevel: React.FC<BlindLevelProps> = ({
  variant = 'full',
  ...props
}) => {
  if (variant === 'compact') {
    return <CompactBlindLevel {...props} />;
  }
  
  return <FullBlindLevel {...props} />;
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <BlindLevel 
//   small={50} 
//   big={100} 
//   ante={10} 
//   level={3} 
//   variant="compact" 
// />
//
// <BlindLevel 
//   small={100} 
//   big={200} 
//   ante={25}
//   level={4}
//   nextLevel={{ small: 200, big: 400, ante: 50 }}
//   variant="full"
//   showNext
// />
