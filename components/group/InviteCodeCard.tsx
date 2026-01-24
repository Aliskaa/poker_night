import React from 'react';
import { Button, Card, Text, XStack, YStack } from 'tamagui';
import { Share2 } from '@tamagui/lucide-icons';

export function InviteCodeCard({ code, onShare }: { code: string, onShare: () => void }) {
  return (
    <YStack paddingHorizontal="$4" marginBottom="$4">
      <Card bordered backgroundColor="$backgroundStrong" borderColor="$borderColor" padding="$4">
        <YStack alignItems="center" gap="$2">
          <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
            Code d'invitation du Club
          </Text>
          <XStack alignItems="center" gap="$3">
            <Text color="$potGold" fontSize="$8" fontWeight="900" letterSpacing={4}>{code}</Text>
            <Button circular size="$4" backgroundColor="$accent" icon={<Share2 size={18} color="white" />} onPress={onShare} />
          </XStack>
        </YStack>
      </Card>
    </YStack>
  );
}