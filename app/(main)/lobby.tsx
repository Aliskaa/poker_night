import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Button, H2, Separator, Spinner, Text, Theme, YStack } from 'tamagui';
import { Play, Users } from '@tamagui/lucide-icons';

import { useGameLogic } from '@/hooks/useGameLogic';
import { useGroupLogic } from '@/hooks/useGroupLogic';

// --- IMPORT DU SOUS-COMPOSANT ---
import { SelectionCard } from '@/components/lobby/SelectionCard';

export default function LobbyScreen() {
  const router = useRouter();
  const { user } = useUser();
  const params = useLocalSearchParams<{ groupId: string, config: string }>();
  const gameConfig = params.config ? JSON.parse(params.config) : null;

  const { currentGroup: group, memberDetails, loading } = useGroupLogic(params.groupId);
  const { createGame } = useGameLogic();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<any[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);

  // L'hôte est toujours sélectionné
  useEffect(() => {
    if (user?.id && !selectedMembers.includes(user.id)) setSelectedMembers(prev => [...prev, user.id]);
  }, [user?.id]);

  const toggleMember = (memberId: string) => {
    if (memberId === user?.id) return;
    setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
  };

  const toggleGuest = (guest: any) => {
    setSelectedGuests(prev => prev.some(g => g.id === guest.id) ? prev.filter(g => g.id !== guest.id) : [...prev, guest]);
  };

  const handleStartGame = async () => {
    setIsLaunching(true);
    const newGameId = await createGame(gameConfig, params.groupId);
    setIsLaunching(false);
    if (newGameId) router.replace(`/(main)/game/${newGameId}`);
    else alert("Erreur lors de la création.");
  };

  if (loading || !group) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$potGold" /></YStack>;

  const totalPlayers = selectedMembers.length + selectedGuests.length;

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        <YStack alignItems="center" marginBottom="$4">
          <Users size={40} color="$success" />
          <H2 color="$color" fontWeight="900" marginTop="$2">Qui est là ce soir ?</H2>
          <Text color="$colorMuted">Cochez les joueurs présents à la table</Text>
        </YStack>

        <Separator borderColor="$borderColor" marginBottom="$2" />

        <ScrollView>
          <YStack padding="$4" gap="$5">

            <YStack gap="$3">
              <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Membres Officiels</Text>
              {memberDetails.map(member => (
                <SelectionCard 
                  key={member.id}
                  isSelected={selectedMembers.includes(member.id)}
                  isDisabled={member.id === user?.id}
                  name={member.firstName || member.username}
                  avatarUrl={member.imageUrl || member.avatarUrl}
                  subtitle={member.id === user?.id ? "Hôte (Toi)" : undefined}
                  onToggle={() => toggleMember(member.id)}
                />
              ))}
            </YStack>

            <YStack gap="$3">
              <Text color="$colorMuted" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Invités (Shadow Profiles)</Text>
              {group.guests.length === 0 ? <Text color="$colorMuted" fontStyle="italic">Aucun invité.</Text> : 
                group.guests.map(guest => (
                  <SelectionCard 
                    key={guest.id}
                    isSelected={selectedGuests.some(g => g.id === guest.id)}
                    name={guest.name}
                    isGhost={true}
                    onToggle={() => toggleGuest(guest)}
                  />
                ))
              }
            </YStack>

          </YStack>
        </ScrollView>

        <YStack padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
          <Button size="$5" backgroundColor="$success" color="white" fontWeight="900" icon={isLaunching ? <Spinner color="white" /> : <Play size={20} />} disabled={isLaunching} onPress={handleStartGame}>
            {isLaunching ? "Distribution..." : `Lancer la partie (${totalPlayers} joueurs)`}
          </Button>
        </YStack>

      </YStack>
    </Theme>
  );
}