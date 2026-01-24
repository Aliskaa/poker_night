import React from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';
import { Ghost, UserPlus } from '@tamagui/lucide-icons';

export function GuestList({ guests, isOwner, onAddGuest }: { guests: any[], isOwner: boolean, onAddGuest: () => void }) {
  return (
    <YStack gap="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <Text color="$colorMuted" fontWeight="bold" fontSize="$3" letterSpacing={1} textTransform="uppercase">
          Invités du Club ({guests.length})
        </Text>
        {isOwner && (
          <Button size="$3" backgroundColor="$accent" color="white" icon={<UserPlus size={16} />} onPress={onAddGuest}>
            Ajouter
          </Button>
        )}
      </XStack>

      {guests.length === 0 ? (
        <Text color="$colorMuted" fontStyle="italic">Aucun invité enregistré.</Text>
      ) : (
        guests.map((guest) => (
          <XStack key={guest.id} alignItems="center" gap="$3" backgroundColor="$background" padding="$3" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
            <YStack backgroundColor="$borderColor" padding="$2" borderRadius="$3">
              <Ghost size={20} color="$colorMuted" />
            </YStack>
            <YStack flex={1}>
              <Text color="$color" fontWeight="bold" fontSize="$4">{guest.name}</Text>
              <Text color="$colorMuted" fontSize="$2">{guest.netProfit}€ profit net • {guest.gamesPlayed} parties</Text>
            </YStack>
          </XStack>
        ))
      )}
    </YStack>
  );
}