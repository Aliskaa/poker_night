import React from 'react';
import { Card, Text, XStack, YStack } from 'tamagui';

interface DetailCardProps {
  label: string;
  value: string;
  icon: React.ReactElement;
}

export function DetailCard({ label, value, icon }: DetailCardProps) {
  return (
    <Card
      flex={1}
      bordered
      backgroundColor="$glass"
      borderColor="$borderColor"
      padding="$3"
    >
      <XStack alignItems="center" gap="$2" marginBottom="$1">
        {React.cloneElement(icon, { color: '$grayMuted' })}
        <Text color="$colorDim" fontSize="$2">
          {label}
        </Text>
      </XStack>
      <Text color="$color" fontSize="$5" fontWeight="bold">
        {value}
      </Text>
    </Card>
  );
}
