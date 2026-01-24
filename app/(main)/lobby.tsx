import { useGameLogic } from '@/hooks/useGameLogic';
import { useGroupLogic } from '@/hooks/useGroupLogic';
import { useUser } from '@clerk/clerk-expo';
import { Check, Ghost, Play, Users } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Button, Card, Checkbox, H2, Separator, Spinner, Text, Theme, YStack } from 'tamagui';

export default function LobbyScreen() {
  const router = useRouter();
  const { user } = useUser();
  
  // 1. Récupération des paramètres envoyés par l'écran "create-game"
  const params = useLocalSearchParams<{ groupId: string, config: string }>();
  const groupId = params.groupId;
  const gameConfig = params.config ? JSON.parse(params.config) : null;

  // 2. Récupération des données du Groupe (Membres et Invités)
  const { currentGroup: group, memberDetails, loading } = useGroupLogic(groupId);
  const { createGame } = useGameLogic();

  // 3. États pour les sélections
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<any[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);

  // L'hôte est toujours sélectionné par défaut
  useEffect(() => {
    if (user?.id && !selectedMembers.includes(user.id)) {
      setSelectedMembers(prev => [...prev, user.id]);
    }
  }, [user?.id]);

  // --- ACTIONS DE SÉLECTION ---
  const toggleMember = (memberId: string) => {
    if (memberId === user?.id) return; // L'hôte ne peut pas se décocher
    setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
  };

  const toggleGuest = (guest: any) => {
    setSelectedGuests(prev => prev.some(g => g.id === guest.id) ? prev.filter(g => g.id !== guest.id) : [...prev, guest]);
  };

  // --- LANCEMENT DE LA PARTIE ---
  const handleStartGame = async () => {
    setIsLaunching(true);

    // Dans une V2.1, on passera ces tableaux à `createGame` pour qu'ils soient ajoutés dès la création.
    // Pour l'instant, on lance la partie avec la config.
    const newGameId = await createGame(gameConfig, groupId);
    
    setIsLaunching(false);
    if (newGameId) {
      router.replace(`/(main)/game/${newGameId}`);
    } else {
      alert("Erreur lors de la création de la partie.");
    }
  };

  if (loading || !group) {
    return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$potGold" /></YStack>;
  }

  const totalPlayers = selectedMembers.length + selectedGuests.length;

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        {/* EN-TÊTE */}
        <YStack alignItems="center" marginBottom="$4">
          <Users size={40} color="$success" />
          <H2 color="$color" fontWeight="900" marginTop="$2">Qui est là ce soir ?</H2>
          <Text color="$colorMuted">Cochez les joueurs présents à la table</Text>
        </YStack>

        <Separator borderColor="$borderColor" marginBottom="$2" />

        <ScrollView>
          <YStack padding="$4" gap="$5">

            {/* 1. MEMBRES OFFICIELS */}
            <YStack gap="$3">
              <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
                Membres Officiels
              </Text>
              {memberDetails.map(member => {
                const isSelected = selectedMembers.includes(member.id);
                const isHost = member.id === user?.id;

                return (
                  <Card key={member.id} bordered backgroundColor={isSelected ? "rgba(16, 185, 129, 0.1)" : "$backgroundStrong"} borderColor={isSelected ? "$success" : "$borderColor"} pressStyle={{ scale: 0.98 }} onPress={() => toggleMember(member.id)}>
                    <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
                      <Checkbox checked={isSelected} backgroundColor={isSelected ? "$success" : "$background"} borderColor={isSelected ? "$success" : "$borderColor"} disabled={isHost}>
                        <Checkbox.Indicator><Check color="white" /></Checkbox.Indicator>
                      </Checkbox>
                      <Avatar circular size="$3"><Avatar.Image src={member.imageUrl || member.avatarUrl} /></Avatar>
                      <YStack flex={1}>
                        <Text color={isSelected ? "$success" : "$color"} fontWeight="bold">{member.firstName || member.username}</Text>
                        {isHost && <Text color="$potGold" fontSize="$2">Hôte (Toi)</Text>}
                      </YStack>
                    </Card.Header>
                  </Card>
                );
              })}
            </YStack>

            {/* 2. INVITÉS DU CLUB */}
            <YStack gap="$3">
              <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>
                Invités (Shadow Profiles)
              </Text>
              {group.guests.length === 0 ? (
                <Text color="$colorMuted" fontStyle="italic">Aucun invité dans ce club.</Text>
              ) : (
                group.guests.map(guest => {
                  const isSelected = selectedGuests.some(g => g.id === guest.id);

                  return (
                    <Card key={guest.id} bordered backgroundColor={isSelected ? "rgba(16, 185, 129, 0.1)" : "$background"} borderColor={isSelected ? "$success" : "$borderColor"} pressStyle={{ scale: 0.98 }} onPress={() => toggleGuest(guest)}>
                      <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
                        <Checkbox checked={isSelected} backgroundColor={isSelected ? "$success" : "$background"} borderColor={isSelected ? "$success" : "$borderColor"}>
                          <Checkbox.Indicator><Check color="white" /></Checkbox.Indicator>
                        </Checkbox>
                        <Ghost size={20} color={isSelected ? "$success" : "$colorMuted"} />
                        <Text flex={1} color={isSelected ? "$success" : "$color"} fontWeight="bold">{guest.name}</Text>
                      </Card.Header>
                    </Card>
                  );
                })
              )}
            </YStack>

          </YStack>
        </ScrollView>

        {/* FOOTER : LANCER LA PARTIE */}
        <YStack padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
          <Button size="$5" backgroundColor="$success" color="white" fontWeight="900" icon={isLaunching ? <Spinner color="white" /> : <Play size={20} />} disabled={isLaunching} onPress={handleStartGame}>
            {isLaunching ? "Distribution..." : `Lancer la partie (${totalPlayers} joueurs)`}
          </Button>
        </YStack>

      </YStack>
    </Theme>
  );
}