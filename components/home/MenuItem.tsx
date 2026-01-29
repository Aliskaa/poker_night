import React from 'react';
import { Card, Text, YStack } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';

export function MenuItem({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle: string, onPress: () => void }) {
  return (
    <Card bordered backgroundColor="$glass2" borderColor="$glass4" pressStyle={{ backgroundColor: '$glass3', scale: 0.98 }} onPress={onPress}>
      <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
        <YStack backgroundColor="$glass3" padding="$2" borderRadius="$3">
          {React.cloneElement(icon, { size: 20, color: '#3b82f6' })}
        </YStack>
        <YStack flex={1}>
          <Text color="$text95" fontSize="$4" fontWeight="bold">{title}</Text>
          <Text color="$text60" fontSize="$2">{subtitle}</Text>
        </YStack>
        <ChevronRight size={20} color="$text60" />
      </Card.Header>
    </Card>
  );
}