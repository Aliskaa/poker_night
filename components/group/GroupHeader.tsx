import React from 'react';
import { Avatar, H1, Text, XStack, YStack } from 'tamagui';
import { Users } from '@tamagui/lucide-icons';

export function GroupHeader({ name, totalPlayers }: { name: string, totalPlayers: number }) {
  return (
    <YStack alignItems="center" marginBottom="$4">
      <Avatar circular size="$6" borderColor="$potGold" borderWidth={2} marginBottom="$2">
        <Avatar.Fallback backgroundColor="$backgroundStrong" />
      </Avatar>
      <H1 color="$color" fontWeight="900" letterSpacing={-1}>{name}</H1>
      <XStack alignItems="center" gap="$2" marginTop="$1">
        <Users size={16} color="$colorMuted" />
        <Text color="$colorMuted" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
          {totalPlayers} Joueurs au total
        </Text>
      </XStack>
    </YStack>
  );
}