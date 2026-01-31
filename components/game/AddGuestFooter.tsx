import React, { useState } from 'react';
import { YStack, XStack, Input, Button } from 'tamagui';
import { UserPlus, Lock } from '@tamagui/lucide-icons';

export function AddGuestFooter({ isLateRegOpen, onAddGuest }: { isLateRegOpen: boolean, onAddGuest: (name: string) => void }) {
  const [newGuestName, setNewGuestName] = useState('');

  return (
    <YStack padding="$4" backgroundColor="$overlay9" borderTopWidth={1} borderTopColor="$overlay3">
      <XStack gap="$2">
        <Input
          flex={1} size="$7" 
          backgroundColor="$glass2" borderColor="$glass4" color="$text95"
          placeholder={isLateRegOpen ? "Ajouter un invité..." : "Inscriptions closes"}
          placeholderTextColor="$text40"
          value={newGuestName} onChangeText={setNewGuestName} editable={isLateRegOpen} opacity={isLateRegOpen ? 1 : 0.5}
        />
        <Button
          size="$7" icon={isLateRegOpen ? <UserPlus size={22} /> : <Lock size={22} />}
          backgroundColor={isLateRegOpen ? "$accent" : "$glass2"} color="$text95" fontWeight="bold"
          disabled={!newGuestName || !isLateRegOpen}
          onPress={() => { onAddGuest(newGuestName); setNewGuestName(''); }}
        >
          {isLateRegOpen ? "Ajouter" : "Fermé"}
        </Button>
      </XStack>
    </YStack>
  );
}