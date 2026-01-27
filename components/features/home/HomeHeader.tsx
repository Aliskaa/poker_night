import React from 'react';
import { Avatar, Text, H3, XStack, YStack } from 'tamagui';

export function HomeHeader({ user }: { user: any }) {
  return (
    <XStack alignItems="center" gap="$3">
      <Avatar circular size="$6" borderWidth={2} borderColor="$borderColor">
        <Avatar.Image src={user?.imageUrl} />
        <Avatar.Fallback backgroundColor="$accent" />
      </Avatar>
      <YStack flex={1}>
        <Text 
          color="$colorMuted" 
          fontSize="$3" 
          letterSpacing={1} 
          textTransform="uppercase"
        >
          Bienvenue à la table
        </Text>
        <H3 color="$colorPrimary" fontWeight="900" letterSpacing={-0.5}>
          {user?.firstName || user?.username || "Joueur"}
        </H3>
      </YStack>
    </XStack>
  );
}