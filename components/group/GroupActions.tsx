import React from 'react';
import { YStack } from 'tamagui';
import { Play, Trash2 } from '@tamagui/lucide-icons';
import { PokerButton } from '@/components/ui/PokerButton';

export function GroupActions({ isOwner, onConfigureGame, onDeleteGroup }: { isOwner: boolean, onConfigureGame: () => void, onDeleteGroup: () => void }) {
  return (
    <YStack 
      padding="$4" 
      backgroundColor="$overlay9" 
      borderTopWidth={1} 
      borderTopColor="$overlay3" 
      gap="$3"
    >
      <PokerButton 
        variant="primary" 
        icon={<Play size={20} />} 
        title="Configurer une partie"
        onPress={onConfigureGame}
      />

      {isOwner && (
        <PokerButton 
          variant="danger"
          icon={<Trash2 />} 
          title="Supprimer le Club"
          fontsizeTitle="$2"
          height="$14"
          iconSize={16}
          onPress={onDeleteGroup}
        />
      )}
    </YStack>
  );
}