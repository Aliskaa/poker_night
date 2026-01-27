import React from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { Trophy, TrendingUp } from '@tamagui/lucide-icons';
import { Card } from '@/components/primitives/Cards';

// ═══════════════════════════════════════════════════════════════════
// 🏆 PAYOUT TABLE - Tableau des payouts pour tournois
// ═══════════════════════════════════════════════════════════════════

type PayoutStructure = {
  position: number;
  percentage: number;
  amount?: number;
};

type PayoutTableProps = {
  totalPot: number;
  payoutModel: PayoutStructure[];
  highlightPositions?: number[];
  variant?: 'compact' | 'detailed';
};

export const PayoutTable: React.FC<PayoutTableProps> = ({
  totalPot,
  payoutModel,
  highlightPositions = [],
  variant = 'detailed',
}) => {
  const calculateAmount = (percentage: number) => {
    return Math.floor((totalPot * percentage) / 100);
  };

  return (
    <Card variant="glass" padding="md">
      <YStack gap="$3">
        {/* Header */}
        <XStack alignItems="center" gap="$2">
          <Trophy size={20} color="$primary" />
          <Text fontSize="$4" fontWeight="700" color="$colorPrimary">
            Structure de Payout
          </Text>
        </XStack>

        {/* Total Pot */}
        <XStack
          padding="$3"
          backgroundColor="$goldBg"
          borderRadius="$4"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="$3" color="$colorSecondary" fontWeight="600">
            Prize Pool Total
          </Text>
          <Text fontSize="$5" fontWeight="900" color="$primary">
            {totalPot.toLocaleString('fr-FR')}€
          </Text>
        </XStack>

        {/* Payout List */}
        <YStack gap="$2">
          {payoutModel.map((payout) => {
            const amount = calculateAmount(payout.percentage);
            const isHighlighted = highlightPositions.includes(payout.position);

            return (
              <XStack
                key={payout.position}
                padding="$3"
                backgroundColor={isHighlighted ? '$successBg' : '$surface2'}
                borderRadius="$4"
                borderWidth={isHighlighted ? 2 : 1}
                borderColor={isHighlighted ? '$success' : '$borderColor'}
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Position */}
                <XStack gap="$3" alignItems="center" flex={1}>
                  <View
                    width={32}
                    height={32}
                    borderRadius="$round"
                    backgroundColor={isHighlighted ? '$success' : '$surface4'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="900"
                      color={isHighlighted ? '$white' : '$colorPrimary'}
                    >
                      {payout.position}
                    </Text>
                  </View>

                  {variant === 'detailed' && (
                    <YStack>
                      <Text fontSize="$3" color="$colorSecondary">
                        {payout.position === 1 && '🥇 Vainqueur'}
                        {payout.position === 2 && '🥈 Second'}
                        {payout.position === 3 && '🥉 Troisième'}
                        {payout.position > 3 && `${payout.position}e place`}
                      </Text>
                      <Text fontSize="$2" color="$colorMuted">
                        {payout.percentage}% du pot
                      </Text>
                    </YStack>
                  )}

                  {variant === 'compact' && (
                    <Text fontSize="$3" color="$colorSecondary">
                      {payout.percentage}%
                    </Text>
                  )}
                </XStack>

                {/* Amount */}
                <Text
                  fontSize={variant === 'detailed' ? '$5' : '$4'}
                  fontWeight="900"
                  color={isHighlighted ? '$success' : '$primary'}
                >
                  {amount.toLocaleString('fr-FR')}€
                </Text>
              </XStack>
            );
          })}
        </YStack>

        {/* Footer stats */}
        {variant === 'detailed' && (
          <XStack
            padding="$3"
            backgroundColor="$surface2"
            borderRadius="$4"
            gap="$4"
          >
            <XStack flex={1} alignItems="center" gap="$2">
              <TrendingUp size={16} color="$info" />
              <YStack>
                <Text fontSize="$1" color="$colorMuted">
                  ITM
                </Text>
                <Text fontSize="$3" fontWeight="700" color="$colorPrimary">
                  {payoutModel.length} places
                </Text>
              </YStack>
            </XStack>

            <View width={1} backgroundColor="$borderColor" />

            <XStack flex={1} alignItems="center" gap="$2">
              <Trophy size={16} color="$primary" />
              <YStack>
                <Text fontSize="$1" color="$colorMuted">
                  1ère place
                </Text>
                <Text fontSize="$3" fontWeight="700" color="$primary">
                  {payoutModel[0]?.percentage}%
                </Text>
              </YStack>
            </XStack>
          </XStack>
        )}
      </YStack>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PAYOUT MODELS PRÉDÉFINIS
// ═══════════════════════════════════════════════════════════════════
export const PAYOUT_STRUCTURES = {
  winner_takes_all: [
    { position: 1, percentage: 100 },
  ],
  
  top_2: [
    { position: 1, percentage: 65 },
    { position: 2, percentage: 35 },
  ],
  
  top_3: [
    { position: 1, percentage: 50 },
    { position: 2, percentage: 30 },
    { position: 3, percentage: 20 },
  ],
  
  top_4: [
    { position: 1, percentage: 45 },
    { position: 2, percentage: 25 },
    { position: 3, percentage: 18 },
    { position: 4, percentage: 12 },
  ],
  
  top_5: [
    { position: 1, percentage: 40 },
    { position: 2, percentage: 25 },
    { position: 3, percentage: 18 },
    { position: 4, percentage: 10 },
    { position: 5, percentage: 7 },
  ],
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <PayoutTable 
//   totalPot={450} 
//   payoutModel={PAYOUT_STRUCTURES.top_3}
//   highlightPositions={[1]}
// />
//
// <PayoutTable 
//   totalPot={1200} 
//   payoutModel={PAYOUT_STRUCTURES.top_5}
//   variant="compact"
// />
