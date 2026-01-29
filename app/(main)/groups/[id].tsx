import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Share, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { YStack, Separator, Spinner, Theme } from 'tamagui';

import { useGroupLogic } from '@/hooks/useGroupLogic';
import { GroupHeader } from '@/components/group/GroupHeader';
import { InviteCodeCard } from '@/components/group/InviteCodeCard';
import { MemberList } from '@/components/group/MemberList';
import { GuestList } from '@/components/group/GuestList';
import { GroupActions } from '@/components/group/GroupActions';
import { AddGuestSheet } from '@/components/group/AddGuestSheet';

// --- IMPORT DES SOUS-COMPOSANTS ---

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const router = useRouter();
  
  const { currentGroup: group, memberDetails, loading, addGuestToGroup, deleteGroup } = useGroupLogic(id);

  // --- ÉTATS POUR LA SHEET INVITÉ ---
  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);

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
    Alert.alert("Supprimer le Club", "Es-tu sûr de vouloir supprimer définitivement ce Club et tous ses invités ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
          if (await deleteGroup()) router.replace('/(main)/groups');
        } 
      }
    ]);
  };

  if (loading || !group) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$primary" /></YStack>;

  const isOwner = group.ownerId === user?.id;

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        <GroupHeader name={group.name} totalPlayers={group.members.length + group.guests.length} />

        <InviteCodeCard code={group.inviteCode} onShare={shareInviteCode} />

        <Separator borderColor="$borderColor" />

        <ScrollView style={{ flex: 1 }}>
          <YStack padding="$4" gap="$5">
            <MemberList members={memberDetails} ownerId={group.ownerId} currentUserId={user?.id} />
            <GuestList guests={group.guests} isOwner={isOwner} onAddGuest={() => setIsGuestSheetOpen(true)} />
          </YStack>
        </ScrollView>

        <GroupActions isOwner={isOwner} onConfigureGame={handleLaunchGroupGame} onDeleteGroup={handleDeleteGroup} />

        <AddGuestSheet isOpen={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen} onAddGuest={(name) => addGuestToGroup(name)} />

      </YStack>
    </Theme>
  );
}