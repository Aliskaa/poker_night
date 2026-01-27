import React from 'react';
import { H4, XStack, YStack } from 'tamagui';

export function ConfigSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <YStack gap="$3">
      <XStack alignItems="center" gap="$2">
        {icon}
        <H4 color="$color" fontWeight="bold">{title}</H4>
      </XStack>
      {children}
    </YStack>
  );
}