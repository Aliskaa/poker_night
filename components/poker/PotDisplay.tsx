import React, { useEffect, useState } from 'react';
import { YStack, Text, View } from 'tamagui';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
} from 'react-native-reanimated';

// ═══════════════════════════════════════════════════════════════════
// 💰 POT DISPLAY - Affichage animé du pot total
// ═══════════════════════════════════════════════════════════════════

type PotDisplayProps = {
  amount: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showCurrency?: boolean;
};

const SIZES = {
  sm: { fontSize: '$5', labelSize: '$2', padding: '$3' },
  md: { fontSize: '$7', labelSize: '$3', padding: '$4' },
  lg: { fontSize: '$9', labelSize: '$4', padding: '$5' },
  xl: { fontSize: '$11', labelSize: '$5', padding: '$6' },
};

export const PotDisplay: React.FC<PotDisplayProps> = ({
  amount,
  label = 'POT TOTAL',
  size = 'lg',
  animated = true,
  showCurrency = true,
}) => {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const scale = useSharedValue(1);
  
  const { fontSize, labelSize, padding } = SIZES[size];

  // Animation quand le montant change
  useEffect(() => {
    if (animated && amount !== displayAmount) {
      // Pulse animation
      scale.value = withSequence(
        withSpring(1.15, { damping: 10 }),
        withSpring(1, { damping: 8 })
      );
    }
    
    // Counter animation (nombre qui monte)
    if (amount > displayAmount) {
      const diff = amount - displayAmount;
      const steps = Math.min(20, diff);
      const increment = diff / steps;
      let current = displayAmount;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= amount) {
          setDisplayAmount(amount);
          clearInterval(interval);
        } else {
          setDisplayAmount(Math.floor(current));
        }
      }, 30);
      
      return () => clearInterval(interval);
    } else {
      setDisplayAmount(amount);
    }
  }, [amount, animated, displayAmount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <YStack
      alignItems="center"
      gap="$2"
      backgroundColor="$glass2"
      borderWidth={2}
      borderColor="$primary"
      borderRadius="$6"
      padding={padding}
      shadowColor="$primary"
      shadowOpacity={0.3}
      shadowRadius={16}
      elevation={8}
    >
      {/* Label */}
      <Text
        fontSize={labelSize}
        fontWeight="700"
        color="$colorMuted"
        textTransform="uppercase"
        letterSpacing={2}
      >
        {label}
      </Text>

      {/* Montant animé */}
      <Animated.View style={animatedStyle}>
        <YStack alignItems="center">
          {/* Icône pot/jetons */}
          <View
            width={size === 'xl' ? 48 : size === 'lg' ? 40 : size === 'md' ? 32 : 24}
            height={size === 'xl' ? 48 : size === 'lg' ? 40 : size === 'md' ? 32 : 24}
            borderRadius="$round"
            backgroundColor="$primary"
            alignItems="center"
            justifyContent="center"
            marginBottom="$2"
          >
            <Text fontSize={size === 'xl' ? '$7' : size === 'lg' ? '$6' : '$5'}>
              💰
            </Text>
          </View>

          <Text
            fontSize={fontSize}
            fontWeight="900"
            color="$primary"
            fontVariant={['tabular-nums']}
            letterSpacing={1}
          >
            {displayAmount.toLocaleString('fr-FR')}
            {showCurrency && '€'}
          </Text>
        </YStack>
      </Animated.View>

      {/* Effet glow subtil (optionnel) */}
      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        borderRadius="$6"
        backgroundColor="$primary"
        opacity={0.05}
        pointerEvents="none"
      />
    </YStack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <PotDisplay amount={450} />
// <PotDisplay amount={1250} size="xl" animated />
// <PotDisplay amount={75} size="sm" label="PRIZE POOL" />
