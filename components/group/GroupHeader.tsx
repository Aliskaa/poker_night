import React from 'react';
import { Avatar, H1, Text, XStack, YStack } from 'tamagui';
import { Users } from '@tamagui/lucide-icons';

export function GroupHeader({ name, totalPlayers }: { name: string, totalPlayers: number }) {
  return (
    <YStack 
      alignItems="center" 
      paddingBottom="$4"
      paddingTop="$2"
      backgroundColor="$overlay5"
      borderBottomWidth={1}
      borderBottomColor="$overlay3"
    >
      <Avatar circular size="$6" borderColor="$primary" borderWidth={2} marginBottom="$2">
        <Avatar.Fallback backgroundColor="$glass4" />
      </Avatar>
      <H1 color="$text95" fontWeight="900" letterSpacing={-1}>{name}</H1>
      <XStack alignItems="center" gap="$2" marginTop="$1">
        <Users size={16} color="$text60" />
        <Text color="$text60" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
          {totalPlayers} Joueurs au total
        </Text>
      </XStack>
    </YStack>
  );
}