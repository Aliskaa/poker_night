import React from 'react';
import { Text, YStack } from 'tamagui';

interface StatItemProps {
  label: string;
  value: string;
  color?: string;
}

export function StatItem({ label, value, color = "$color" }: StatItemProps) {
  return (
    <YStack alignItems="center">
      <Text color="$colorDim" fontSize="$2" fontWeight="600">
        {label}
      </Text>
      <Text color={color} fontSize="$5" fontWeight="900">
        {value}
      </Text>
    </YStack>
  );
}
