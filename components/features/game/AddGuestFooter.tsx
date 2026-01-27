import React, { useState } from 'react';
import { YStack, XStack, Input, Button } from 'tamagui';
import { UserPlus, Lock } from '@tamagui/lucide-icons';

export function AddGuestFooter({ isLateRegOpen, onAddGuest }: { isLateRegOpen: boolean, onAddGuest: (name: string) => void }) {
  const [newGuestName, setNewGuestName] = useState('');

  return (
    // Fond semi-transparent pour laisser voir le tapis dessous
    <YStack padding="$4" backgroundColor="rgba(0,0,0,0.4)" borderTopWidth={1} borderColor="$borderColor">
      <XStack gap="$2">
        <Input
          flex={1} size="$4" 
          backgroundColor="$borderColor" borderColor="rgba(255,255,255,0.2)" color="white"
          placeholder={isLateRegOpen ? "Ajouter un invité..." : "Inscriptions closes"}
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={newGuestName} onChangeText={setNewGuestName} editable={isLateRegOpen} opacity={isLateRegOpen ? 1 : 0.5}
        />
        <Button
          size="$4" icon={isLateRegOpen ? <UserPlus size={20} /> : <Lock size={20} />}
          backgroundColor={isLateRegOpen ? "$accent" : "$borderColor"} color="white" fontWeight="bold"
          disabled={!newGuestName || !isLateRegOpen}
          onPress={() => { onAddGuest(newGuestName); setNewGuestName(''); }}
        >
          {isLateRegOpen ? "Ajouter" : "Fermé"}
        </Button>
      </XStack>
    </YStack>
  );
}