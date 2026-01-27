import React from 'react';
import { YStack, Button, Text } from 'tamagui';
import { BookOpen, Settings, ShieldCheck, LogOut } from '@tamagui/lucide-icons';
import { ListItem } from './ListItem';

interface ProfileMenuProps {
  onSignOut: () => void;
  router: any;
}

export function ProfileMenu({ onSignOut, router }: ProfileMenuProps) {
  return (
    <>
      <YStack gap="$1">
        <ListItem
          icon={<BookOpen />}
          title="Règles & Combinaisons"
          subtitle="Mémo"
          onPress={() => router.push('/(main)/hand-ranking')}
        />
        <ListItem
          icon={<Settings />}
          title="Paramètres"
          onPress={() => {}}
        />
        <ListItem
          icon={<ShieldCheck />}
          title="Confidentialité"
          onPress={() => {}}
          isLast
        />
      </YStack>

      <Button
        marginTop="$4"
        backgroundColor="transparent"
        onPress={onSignOut}
        icon={<LogOut size="$base" color="$danger" />}
      >
        <Text color="$danger">Se déconnecter</Text>
      </Button>
    </>
  );
}
