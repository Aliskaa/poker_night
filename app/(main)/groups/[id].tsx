import { useGameLogic } from '@/hooks/useGameLogic';
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Share } from 'react-native';
import { useGroupLogic } from '@/hooks/useGroupLogic';
import { Crown, Ghost, Play, Share2, UserPlus, Users } from '@tamagui/lucide-icons';
import { Avatar, Button, Card, H1, H4, Input, Separator, Sheet, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const router = useRouter();
  const { currentGroup: group, memberDetails, loading, addGuestToGroup } = useGroupLogic(id);
  const { createGame } = useGameLogic();

  // États pour la création d'invité
  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');

  // --- ACTION : Partager le code d'invitation ---
  const shareInviteCode = async () => {
    if (!group) return;
    try {
      await Share.share({
        message: `♠️ Rejoins mon Club de Poker "${group.name}" sur l'appli ! \n\nCode d'invitation : ${group.inviteCode}`,
      });
    } catch (error) {
      console.log("Erreur partage:", error);
    }
  };

  // --- ACTION : Lancer une partie POUR CE GROUPE ---
  const handleLaunchGroupGame = async () => {
    // Note: Dans une future V2.1, on passera group.id à createGame()
    // pour lier la partie au groupe dans la BDD.
    const newGameId = await createGame(5); 
    if (newGameId) router.push(`/(main)/game/${newGameId}`);
  };

  if (loading || !group) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$potGold" />
      </YStack>
    );
  }

  const isOwner = group.ownerId === user?.id;

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        {/* 1. EN-TÊTE DU CLUB */}
        <YStack alignItems="center" marginBottom="$4">
          <Avatar circular size="$6" borderColor="$potGold" borderWidth={2} marginBottom="$2">
            <Avatar.Fallback backgroundColor="$backgroundStrong" />
          </Avatar>
          <H1 color="$color" fontWeight="900" letterSpacing={-1}>{group.name}</H1>
          <XStack alignItems="center" gap="$2" marginTop="$1">
            <Users size={16} color="$colorMuted" />
            <Text color="$colorMuted" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
              {group.members.length + group.guests.length} Joueurs au total
            </Text>
          </XStack>
        </YStack>

        {/* 2. LE CODE SECRET (Seulement pour les membres) */}
        <YStack paddingHorizontal="$4" marginBottom="$4">
          <Card bordered backgroundColor="$backgroundStrong" borderColor="$borderColor" padding="$4">
            <YStack alignItems="center" gap="$2">
              <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
                Code d'invitation du Club
              </Text>
              <XStack alignItems="center" gap="$3">
                <Text color="$potGold" fontSize="$8" fontWeight="900" letterSpacing={4}>
                  {group.inviteCode}
                </Text>
                <Button circular size="$4" backgroundColor="$accent" icon={<Share2 size={18} color="white" />} onPress={shareInviteCode} />
              </XStack>
            </YStack>
          </Card>
        </YStack>

        <Separator borderColor="$borderColor" />

        <ScrollView style={{ flex: 1 }}>
          <YStack padding="$4" gap="$5">

            {/* SECTION 1 : MEMBRES (Comptes officiels) */}
            <YStack gap="$3">
              <Text color="$colorMuted" fontWeight="bold" fontSize="$3" letterSpacing={1} textTransform="uppercase">
                Membres Officiels ({group.members.length})
              </Text>
              {memberDetails.map((member) => {
                const isGroupOwner = member.id === group.ownerId;
                const isMe = member.id === user?.id;

                return (
                  <XStack key={member.id} alignItems="center" gap="$3" backgroundColor="$backgroundStrong" padding="$3" borderRadius="$4" borderWidth={1} borderColor={isGroupOwner ? "$potGold" : "$borderColor"}>
                    <Avatar circular size="$4">
                      <Avatar.Image src={member.imageUrl || member.avatarUrl} />
                      <Avatar.Fallback backgroundColor="$accent" />
                    </Avatar>
                    <YStack flex={1}>
                      <Text color="$color" fontWeight="bold" fontSize="$4">
                        {member.firstName || member.username || "Joueur"} {isMe && "(Moi)"}
                      </Text>
                      {isGroupOwner ? (
                        <XStack alignItems="center" gap="$1">
                          <Crown size={12} color="$potGold" />
                          <Text color="$potGold" fontSize="$2" fontWeight="bold">Créateur</Text>
                        </XStack>
                      ) : (
                        <Text color="$colorMuted" fontSize="$2">Membre</Text>
                      )}
                    </YStack>
                  </XStack>
                );
              })}
            </YStack>

            {/* SECTION 2 : INVITÉS (Shadow Profiles) */}
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text color="$colorMuted" fontWeight="bold" fontSize="$3" letterSpacing={1} textTransform="uppercase">
                  Invités du Club ({group.guests.length})
                </Text>
                {/* Seul le créateur peut ajouter des invités permanents */}
                {isOwner && (
                  <Button size="$3" backgroundColor="$accent" color="white" icon={<UserPlus size={16} />} onPress={() => setIsGuestSheetOpen(true)}>
                    Ajouter
                  </Button>
                )}
              </XStack>

              {group.guests.length === 0 ? (
                <Text color="$colorMuted" fontStyle="italic">Aucun invité enregistré.</Text>
              ) : (
                group.guests.map((guest) => (
                  <XStack key={guest.id} alignItems="center" gap="$3" backgroundColor="$background" padding="$3" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
                    <YStack backgroundColor="$borderColor" padding="$2" borderRadius="$3">
                      <Ghost size={20} color="$colorMuted" />
                    </YStack>
                    <YStack flex={1}>
                      <Text color="$color" fontWeight="bold" fontSize="$4">{guest.name}</Text>
                      <Text color="$colorMuted" fontSize="$2">{guest.netProfit}€ profit net • {guest.gamesPlayed} parties</Text>
                    </YStack>
                  </XStack>
                ))
              )}
            </YStack>

          </YStack>
        </ScrollView>

        {/* 3. BOUTON LANCER PARTIE */}
        <YStack padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
          <Button 
            size="$5" 
            backgroundColor="$success" 
            color="white" 
            fontWeight="900" 
            icon={<Play size={20} color="white" />}
            onPress={handleLaunchGroupGame}
          >
            Ouvrir une table pour ce Club
          </Button>
        </YStack>

        {/* BOTTOM SHEET : Ajouter un invité */}
        <Sheet modal open={isGuestSheetOpen} onOpenChange={setIsGuestSheetOpen} snapPoints={[40]} dismissOnSnapToBottom>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
            <H4 color="$color" textAlign="center">Créer un Invité</H4>
            <Text color="$colorMuted" textAlign="center" marginBottom="$2">
              Cet invité sera sauvegardé dans ce club. Ses statistiques (gains/pertes) seront conservées partie après partie.
            </Text>
            <Input 
              size="$5" 
              placeholder="Prénom de l'invité (ex: Julien)" 
              value={newGuestName} 
              onChangeText={setNewGuestName} 
              backgroundColor="$backgroundStrong"
              borderColor="$borderColor"
              color="$color"
            />
            <Button size="$5" backgroundColor="$accent" color="white" fontWeight="900" disabled={!newGuestName || loading} onPress={() => addGuestToGroup(newGuestName)}>
              {loading ? <Spinner color="white" /> : 'Créer le profil invité'}
            </Button>
          </Sheet.Frame>
        </Sheet>

      </YStack>
    </Theme>
  );
}