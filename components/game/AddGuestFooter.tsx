import React, { useState } from 'react';
import { YStack, XStack, Input, Button } from 'tamagui';
import { UserPlus, Lock } from '@tamagui/lucide-icons';

export function AddGuestFooter({ isLateRegOpen, onAddGuest }: { isLateRegOpen: boolean, onAddGuest: (name: string) => void }) {
  const [newGuestName, setNewGuestName] = useState('');

  return (
    <YStack padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
      <XStack gap="$2">
        <Input
          flex={1} size="$4" backgroundColor="$background" borderColor="$borderColor"
          placeholder={isLateRegOpen ? "Ajouter un invité..." : "Inscriptions closes"}
          value={newGuestName} onChangeText={setNewGuestName} editable={isLateRegOpen} opacity={isLateRegOpen ? 1 : 0.5}
        />
        <Button
          size="$4" icon={isLateRegOpen ? <UserPlus size={20} /> : <Lock size={20} />}
          backgroundColor={isLateRegOpen ? "$accent" : "$gray8"} color="white" fontWeight="bold"
          disabled={!newGuestName || !isLateRegOpen}
          onPress={() => { onAddGuest(newGuestName); setNewGuestName(''); }}
        >
          {isLateRegOpen ? "Ajouter" : "Fermé"}
        </Button>
      </XStack>
    </YStack>
  );
}