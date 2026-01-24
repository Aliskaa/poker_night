import React, { useState } from 'react';
import { Button, H4, Input, Sheet, Spinner, Text } from 'tamagui';

export function AddGuestSheet({ isOpen, onOpenChange, onAddGuest }: { isOpen: boolean, onOpenChange: (open: boolean) => void, onAddGuest: (name: string) => Promise<void> }) {
  const [newGuestName, setNewGuestName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newGuestName) return;
    setIsAdding(true);
    await onAddGuest(newGuestName);
    setIsAdding(false);
    setNewGuestName('');
    onOpenChange(false);
  };

  return (
    <Sheet modal open={isOpen} onOpenChange={onOpenChange} snapPoints={[40]} dismissOnSnapToBottom>
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
        <H4 color="$color" textAlign="center">Créer un Invité</H4>
        <Text color="$colorMuted" textAlign="center" marginBottom="$2">
          Cet invité sera sauvegardé dans ce club. Ses statistiques seront conservées partie après partie.
        </Text>
        <Input 
          size="$5" placeholder="Prénom de l'invité (ex: Julien)" 
          value={newGuestName} onChangeText={setNewGuestName} 
          backgroundColor="$backgroundStrong" borderColor="$borderColor" color="$color"
        />
        <Button size="$5" backgroundColor="$accent" color="white" fontWeight="900" disabled={!newGuestName || isAdding} onPress={handleAdd}>
          {isAdding ? <Spinner color="white" /> : 'Créer le profil invité'}
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
}