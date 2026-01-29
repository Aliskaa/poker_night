import React from 'react';
import { Button, Card, H4, Text, XStack } from 'tamagui';
import { Crown, Plus } from '@tamagui/lucide-icons';

export function CreateGameCard({ onPress }: { onPress: () => void }) {
  return (
    <Card bordered elevate size="$4" backgroundColor="$backgroundStrong" borderColor="$borderColor">
      <Card.Header padded>
        <XStack gap="$2" alignItems="center">
          <Crown size={20} color="$primary" />
          <H4 color="$color" fontWeight="bold">Soirée Poker</H4>
        </XStack>
        <Text color="$colorMuted" fontSize="$3" marginTop="$1">
          Crée une table, définis la mise et invite tes amis.
        </Text>
      </Card.Header>
      <Card.Footer padded>
        <Button
          flex={1}
          size="$4"
          icon={<Plus size={20} color="$backgroundStrong" />}
          backgroundColor="$primary"
          color="$backgroundStrong"
          fontWeight="900"
          onPress={onPress}
        >
          Ouvrir une table
        </Button>
      </Card.Footer>
    </Card>
  );
}