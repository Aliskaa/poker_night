import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Button, H2, Separator, Spinner, Text, Theme, YStack } from 'tamagui';
import { Play, Users } from '@tamagui/lucide-icons';

import { useGameLogic } from '@/hooks/useGameLogic';
import { useGroupLogic } from '@/hooks/useGroupLogic';
import { SelectionCard } from '@/components/lobby/SelectionCard';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { PokerButton } from '@/components/ui/PokerButton';
import { GlassCard } from '@/components/ui/GlassCard';

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

  if (loading || !group) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$primary" /></YStack>;

  const totalPlayers = selectedMembers.length + selectedGuests.length;

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">

          <YStack
            alignItems="center"
            paddingBottom="$4"
            paddingTop="$2"
            backgroundColor="$overlay5"
            borderBottomWidth={1}
            borderBottomColor="$overlay3"
          >
            <Users size={40} color="$primary" />
            <H2 color="$text95" fontWeight="900" marginTop="$2">Qui est là ?</H2>
            <Text color="$text60">Cochez les joueurs présents</Text>
          </YStack>

          <ScrollView>
            <YStack padding="$4" gap="$5">

              <YStack gap="$3">
                <Text color="$text60" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Membres Officiels</Text>
                {memberDetails.map(member => (
                  <SelectionCard
                    key={member.id}
                    isSelected={selectedMembers.includes(member.id)}
                    isDisabled={member.id === user?.id}
                    name={member.displayName || "Joueur"}
                    avatarUrl={member.avatarUrl}
                    subtitle={member.id === user?.id ? "Hôte (Toi)" : undefined}
                    onToggle={() => toggleMember(member.id)}
                  />
                ))}
              </YStack>

              <YStack gap="$3">
                <Text color="$text60" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Invités</Text>
                {group.guests.length === 0 ?
                  <YStack
                    padding="$4"
                    backgroundColor="$glass2"
                    borderRadius="$5"
                    borderWidth={1}
                    borderColor="$glass4"
                  >
                    <Text color="$text40" fontStyle="italic" textAlign="center">Aucun invité pour le moment</Text>
                  </YStack> :
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

          <YStack
            padding="$4"
            backgroundColor="$overlay9"
            borderTopWidth={1}
            borderTopColor="$overlay3"
          >
            <PokerButton
              variant="primary"
              icon={isLaunching ? <Spinner color="$backgroundStrong" /> : <Play size={20} />}
              title={isLaunching ? "Distribution..." : `Lancer la partie (${totalPlayers})`}
              disabled={isLaunching}
              onPress={handleStartGame}
            />
          </YStack>

        </YStack>
      </PokerBackground>
    </Theme>
  );
}