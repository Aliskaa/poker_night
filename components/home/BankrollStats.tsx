import React from 'react';
import { Card, H1, Text, XStack, YStack } from 'tamagui';
import { Shield, TrendingUp } from '@tamagui/lucide-icons';

export function BankrollStats({ stats }: { stats: { netProfit: number, gamesPlayed: number } }) {
  const isProfitable = stats.netProfit >= 0;
  const profitColor = isProfitable ? "$success" : "$danger";

  return (
    <YStack gap="$2">
      <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
        Ma Bankroll
      </Text>
      <XStack gap="$3">
        <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong" borderColor="$borderColor">
          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <TrendingUp size={16} color={isProfitable ? "#059669" : "#ef4444"} />
              <Text color="$colorMuted" fontSize="$2" fontWeight="600">Profit Net</Text>
            </XStack>
            <H1 color={profitColor} fontSize="$8" fontWeight="900" letterSpacing={-1}>
              {isProfitable ? "+" : ""}{String(stats.netProfit)}€
            </H1>
          </YStack>
        </Card>

        <Card flex={1} bordered padding="$3" backgroundColor="$backgroundStrong" borderColor="$borderColor">
          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <Shield size={16} color="$accent" />
              <Text color="$colorMuted" fontSize="$2" fontWeight="600">Parties</Text>
            </XStack>
            <H1 color="$color" fontSize="$8" fontWeight="900" letterSpacing={-1}>
              {String(stats.gamesPlayed)}
            </H1>
          </YStack>
        </Card>
      </XStack>
    </YStack>
  );
}