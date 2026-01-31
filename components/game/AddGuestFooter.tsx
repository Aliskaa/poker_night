import React, { useState, useCallback } from 'react';
import { YStack, XStack, Input, Button } from 'tamagui';
import { UserPlus, Lock } from '@tamagui/lucide-icons';
import { debounce } from '@/utils/errorHandler';

export function AddGuestFooter({ isLateRegOpen, onAddGuest }: { isLateRegOpen: boolean, onAddGuest: (name: string) => void }) {
  const [newGuestName, setNewGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce pour éviter les clics multiples
  const handleAddGuest = useCallback(
    debounce(async (name: string) => {
      if (!name || isSubmitting) return;
      setIsSubmitting(true);
      await onAddGuest(name);
      setNewGuestName('');
      setIsSubmitting(false);
    }, 500),
    [onAddGuest, isSubmitting]
  );

  return (
    <YStack padding="$4" backgroundColor="$overlay9" borderTopWidth={1} borderTopColor="$overlay3">
      <XStack gap="$2">
        <Input
          flex={1} size="$7" 
          backgroundColor="$glass2" borderColor="$glass4" color="$text95"
          placeholder={isLateRegOpen ? "Ajouter un invité..." : "Inscriptions closes"}
          placeholderTextColor="$text40"
          value={newGuestName} onChangeText={setNewGuestName} editable={isLateRegOpen && !isSubmitting} opacity={isLateRegOpen ? 1 : 0.5}
        />
        <Button
          size="$7" icon={isLateRegOpen ? <UserPlus size={22} /> : <Lock size={22} />}
          backgroundColor={isLateRegOpen ? "$accent" : "$glass2"} color="$text95" fontWeight="bold"
          disabled={!newGuestName || !isLateRegOpen || isSubmitting}
          onPress={() => handleAddGuest(newGuestName)}
        >
          {isSubmitting ? "..." : isLateRegOpen ? "Ajouter" : "Fermé"}
        </Button>
      </XStack>
    </YStack>
  );
}