import React from 'react';
import { YStack, View, Text } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 💰 CHIP STACK - Visualisation de stack en jetons empilés
// ═══════════════════════════════════════════════════════════════════

type ChipStackProps = {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  maxChips?: number;
  showLabel?: boolean;
};

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION CHIPS
// ─────────────────────────────────────────────────────────────────
const CHIP_COLORS = [
  { threshold: 0, color: '#ffffff', label: '1€' },
  { threshold: 5, color: '#ef4444', label: '5€' },
  { threshold: 10, color: '#3b82f6', label: '10€' },
  { threshold: 25, color: '#10b981', label: '25€' },
  { threshold: 100, color: '#0f172a', label: '100€' },
  { threshold: 500, color: '#a855f7', label: '500€' },
  { threshold: 1000, color: '#f97316', label: '1k€' },
  { threshold: 5000, color: '#ec4899', label: '5k€' },
];

const getChipColor = (amount: number): string => {
  for (let i = CHIP_COLORS.length - 1; i >= 0; i--) {
    if (amount >= CHIP_COLORS[i].threshold) {
      return CHIP_COLORS[i].color;
    }
  }
  return CHIP_COLORS[0].color;
};

const SIZES = {
  sm: { chip: 28, spacing: 3, fontSize: '$2' },
  md: { chip: 36, spacing: 4, fontSize: '$3' },
  lg: { chip: 44, spacing: 5, fontSize: '$4' },
};

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────
export const ChipStack: React.FC<ChipStackProps> = ({
  amount,
  size = 'md',
  animated = false,
  maxChips = 5,
  showLabel = true,
}) => {
  const chipColor = getChipColor(amount);
  const { chip: chipSize, spacing, fontSize } = SIZES[size];
  
  // Calcul nombre de jetons à afficher (basé sur montant)
  const numChips = Math.min(
    maxChips, 
    Math.max(1, Math.floor(Math.log10(amount + 1) + 1))
  );

  return (
    <YStack alignItems="center" gap="$2">
      {/* Stack visuel */}
      <View 
        position="relative" 
        height={chipSize + (numChips - 1) * spacing}
        width={chipSize}
      >
        {Array.from({ length: numChips }).map((_, i) => {
          // Variation légère de couleur pour effet 3D
          const shade = 1 - (i * 0.05);
          
          return (
            <View
              key={i}
              position="absolute"
              top={i * spacing}
              width={chipSize}
              height={chipSize}
              borderRadius="$round"
              backgroundColor={chipColor}
              borderWidth={2}
              borderColor="$white"
              shadowColor="$black"
              shadowOpacity={0.3}
              shadowRadius={6}
              shadowOffset={{ width: 0, height: 2 }}
              elevation={numChips - i}
              opacity={shade}
              animation={animated ? 'bouncy' : undefined}
              {...(animated && {
                animateOnly: ['transform'],
                enterStyle: { 
                  scale: 0, 
                  y: -20 
                },
              })}
            />
          );
        })}
        
        {/* Motif sur le chip du dessus (optionnel) */}
        <View
          position="absolute"
          top={0}
          width={chipSize}
          height={chipSize}
          borderRadius="$round"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          <View
            width={chipSize * 0.6}
            height={chipSize * 0.6}
            borderRadius="$round"
            borderWidth={2}
            borderColor="$white"
            opacity={0.3}
          />
        </View>
      </View>

      {/* Label montant */}
      {showLabel && (
        <Text
          fontSize={fontSize}
          fontWeight="700"
          color="$colorPrimary"
          textAlign="center"
        >
          {amount.toLocaleString('fr-FR')}€
        </Text>
      )}
    </YStack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// CHIP COLORS REFERENCE (Export pour usage ailleurs)
// ═══════════════════════════════════════════════════════════════════
export { CHIP_COLORS, getChipColor };

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <ChipStack amount={250} size="md" animated />
// <ChipStack amount={1500} size="lg" />
// <ChipStack amount={50} size="sm" showLabel={false} />
