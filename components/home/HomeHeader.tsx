import React from 'react';
import { Avatar, Text, H3, XStack, YStack } from 'tamagui';

export function HomeHeader({ user }: { user: any }) {
  return (
    <XStack alignItems="center" gap="$4">
      <Avatar circular size="$7" borderWidth={3} borderColor="$primary" elevation={4} shadowColor="$primary" shadowOpacity={0.3} shadowRadius={8}>
        <Avatar.Image src={user?.imageUrl} />
        <Avatar.Fallback backgroundColor="$gold600" />
      </Avatar>
      <YStack flex={1}>
        <Text color="$text60" fontSize="$2" letterSpacing={1.5} textTransform="uppercase" fontWeight="600">
          Bienvenue à la table
        </Text>
        <H3 color="$text95" fontWeight="900" letterSpacing={-0.5} fontSize="$7" marginTop="$1">
          {user?.firstName || user?.username || "Joueur"}
        </H3>
      </YStack>
    </XStack>
  );
}