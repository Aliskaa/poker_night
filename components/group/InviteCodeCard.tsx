import React from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { Share2 } from '@tamagui/lucide-icons';

export function InviteCodeCard({ code, onShare }: { code: string, onShare: () => void }) {
  return (
    <YStack paddingHorizontal="$4" marginVertical="$4">
      <YStack 
        backgroundColor="$glass3" 
        borderColor="$glass5" 
        borderWidth={1}
        padding="$4" 
        borderRadius="$6"
        gap="$2"
      >
        <Text color="$text60" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1} textAlign="center">
          Code d'invitation du Club
        </Text>
        <XStack alignItems="center" justifyContent="center" gap="$3">
          <Text color="$primary" fontSize="$8" fontWeight="900" letterSpacing={4}>{code}</Text>
          <Button 
            circular 
            size="$7"
            backgroundColor="$primary" 
            icon={<Share2 size={18} color="$backgroundStrong" />} 
            onPress={onShare}
            pressStyle={{ scale: 0.95 }}
          />
        </XStack>
      </YStack>
    </YStack>
  );
}