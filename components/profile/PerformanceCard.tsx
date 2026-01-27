import React from 'react';
import { Card, Text, XStack, YStack } from 'tamagui';
import { TrendingUp, Trophy, Wallet } from '@tamagui/lucide-icons';
import { DetailCard } from './DetailCard';

interface PerformanceCardProps {
  stats: {
    netProfit: number;
    totalInvested: number;
    totalWinnings: number;
  };
}

export function PerformanceCard({ stats }: PerformanceCardProps) {
  const isProfit = stats.netProfit >= 0;

  return (
    <YStack gap="$3">
      <Text 
        color="$colorDim" 
        fontWeight="bold" 
        fontSize="$2" 
        textTransform="uppercase" 
        letterSpacing={1}
      >
        Performance
      </Text>

      <Card
        flex={2}
        bordered
        backgroundColor="$overlayMedium"
        borderColor={isProfit ? "$success" : "$danger"}
        padding="$3"
      >
        <YStack>
          <XStack alignItems="center" gap="$2" marginBottom="$1">
            <Wallet size="$md" color={isProfit ? "$success" : "$danger"} />
            <Text color={isProfit ? "$success" : "$danger"} fontWeight="bold">
              Profit Net
            </Text>
          </XStack>
          <Text color="$color" fontSize="$8" fontWeight="900">
            {stats.netProfit > 0 ? "+" : ""}{stats.netProfit}€
          </Text>
        </YStack>
      </Card>

      <XStack gap="$3">
        <DetailCard 
          label="Investi" 
          value={`${stats.totalInvested}€`} 
          icon={<TrendingUp size="$sm" />} 
        />
        <DetailCard 
          label="Gagné" 
          value={`${stats.totalWinnings}€`} 
          icon={<Trophy size="$sm" />} 
        />
      </XStack>
    </YStack>
  );
}
