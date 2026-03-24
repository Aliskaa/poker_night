import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, ScrollView, Share } from 'react-native';
import { useUser } from '@/providers/AuthProvider';
import { H4, Spinner, Text, Theme, XStack, YStack, Sheet } from 'tamagui';
import { Settings2, Trash2 } from '@tamagui/lucide-icons';

import { useGroupLogic } from '@/hooks/useGroupLogic';
import { GroupHeader } from '@/components/group/GroupHeader';
import { InviteCodeCard } from '@/components/group/InviteCodeCard';
import { MemberList } from '@/components/group/MemberList';
import { GuestList } from '@/components/group/GuestList';
import { GroupActions } from '@/components/group/GroupActions';
import { AddGuestSheet } from '@/components/group/AddGuestSheet';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { PokerButton } from '@/components/ui/PokerButton';

// --- IMPORT DES SOUS-COMPOSANTS ---

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const router = useRouter();
  
  const { currentGroup: group, memberDetails, loading, addGuestToGroup, deleteGroup } = useGroupLogic(id);

  // --- ÉTATS POUR LA SHEET INVITÉ ---
  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);
  const topSpacing = Platform.OS === 'web' ? '$6' : '$10';

  // --- ACTIONS ---
  const shareInviteCode = async () => {
    if (!group) return;
    try {
      await Share.share({ message: `♠️ Rejoins mon Club de Poker "${group.name}" sur l'appli ! \n\nCode d'invitation : ${group.inviteCode}` });
    } catch (error) { console.log("Erreur partage:", error); }
  };

  const handleLaunchGroupGame = () => {
    if (group) router.push({ pathname: '/(main)/create-game', params: { groupId: group.id } });
  };

  const handleDeleteGroup = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteGroup = async () => {
    setDeletingGroup(true);
    try {
      if (await deleteGroup()) {
        setIsDeleteConfirmOpen(false);
        router.replace('/(main)/(tabs)/groups');
      }
    } finally {
      setDeletingGroup(false);
    }
  };

  if (loading || !group) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$primary" /></YStack>;

  const isOwner = group.ownerId === user?.id;

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop={topSpacing}>

          <GroupHeader name={group.name} totalPlayers={group.members.length + group.guests.length} />

          <InviteCodeCard code={group.inviteCode} onShare={shareInviteCode} />

          <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$5">
              <MemberList members={memberDetails} ownerId={group.ownerId} currentUserId={user?.id} />
              <GuestList guests={group.guests} isOwner={isOwner} onAddGuest={() => setIsGuestSheetOpen(true)} />
            </YStack>
          </ScrollView>

          <GroupActions
            isOwner={isOwner}
            onConfigureGame={handleLaunchGroupGame}
            onDeleteGroup={handleDeleteGroup}
            deletingGroup={deletingGroup}
          />

          <AddGuestSheet isOpen={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen} onAddGuest={(name) => addGuestToGroup(name)} />

          <Sheet
            modal
            open={isDeleteConfirmOpen}
            onOpenChange={(open) => {
              if (!deletingGroup) setIsDeleteConfirmOpen(open);
            }}
            snapPoints={[38]}
            dismissOnSnapToBottom
          >
            <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
            <Sheet.Handle />
            <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
              <YStack gap="$2">
                <H4 color="$color">Supprimer ce club ?</H4>
                <Text color="$colorMuted">
                  Cette action est irreversible. Le club et tous les invites seront supprimes.
                </Text>
              </YStack>

              <XStack gap="$3">
                <PokerButton
                  variant="secondary"
                  icon={<Settings2 size={16} />}
                  title="Annuler"
                  flex={1}
                  onPress={() => setIsDeleteConfirmOpen(false)}
                  disabled={deletingGroup}
                />
                <PokerButton
                  variant="danger"
                  icon={<Trash2 size={16} />}
                  title={deletingGroup ? 'Suppression...' : 'Supprimer'}
                  flex={1}
                  onPress={confirmDeleteGroup}
                  disabled={deletingGroup}
                />
              </XStack>
            </Sheet.Frame>
          </Sheet>

        </YStack>
      </PokerBackground>
    </Theme>
  );
}