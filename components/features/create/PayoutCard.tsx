import React from 'react';
import { Card, Text, YStack } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';

export function PayoutCard({ title, description, isSelected, onPress }: { title: string, description: string, isSelected: boolean, onPress: () => void }) {
  return (
    <Card bordered backgroundColor={isSelected ? "$successBg" : "$backgroundStrong"} borderColor={isSelected ? "$success" : "$borderColor"} pressStyle={{ scale: 0.98 }} onPress={onPress}>
      <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
        <YStack flex={1}>
          <Text color={isSelected ? "$success" : "$color"} fontWeight="bold" fontSize="$4">{title}</Text>
          <Text color="$colorMuted" fontSize="$2">{description}</Text>
        </YStack>
        {isSelected && <Check size={20} color="$success" />}
      </Card.Header>
    </Card>
  );
}