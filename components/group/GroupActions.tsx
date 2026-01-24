import React from 'react';
import { Button, YStack } from 'tamagui';
import { Play, Trash2 } from '@tamagui/lucide-icons';

export function GroupActions({ isOwner, onConfigureGame, onDeleteGroup }: { isOwner: boolean, onConfigureGame: () => void, onDeleteGroup: () => void }) {
  return (
    <YStack padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor" gap="$3">
      <Button size="$5" backgroundColor="$success" color="white" fontWeight="900" icon={<Play size={20} color="white" />} onPress={onConfigureGame}>
        Configurer une partie de Club
      </Button>

      {isOwner && (
        <Button size="$4" backgroundColor="transparent" color="$danger" icon={<Trash2 size={16} />} onPress={onDeleteGroup}>
          Supprimer le Club
        </Button>
      )}
    </YStack>
  );
}