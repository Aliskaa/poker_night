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

  if (loading || !group) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#064e3b"><Spinner size="large" color="$potGold" /></YStack>;

  const totalPlayers = selectedMembers.length + selectedGuests.length;

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">

          <YStack alignItems="center" marginBottom="$4">
            <Users size={40} color="$potGold" />
            <H2 color="white" fontWeight="900" marginTop="$2">Qui est là ?</H2>
            <Text color="rgba(255,255,255,0.6)">Cochez les joueurs présents</Text>
          </YStack>

          <Separator borderColor="rgba(255,255,255,0.1)" marginBottom="$2" />

          <ScrollView>
            <YStack padding="$4" gap="$5">

              <YStack gap="$3">
                <Text color="rgba(255,255,255,0.5)" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Membres Officiels</Text>
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
                <Text color="rgba(255,255,255,0.5)" fontWeight="bold" textTransform="uppercase" fontSize="$2" letterSpacing={1}>Invités</Text>
                {group.guests.length === 0 ? <Text color="rgba(255,255,255,0.4)" fontStyle="italic">Aucun invité.</Text> : 
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

          <YStack padding="$4" backgroundColor="rgba(0,0,0,0.5)" borderTopWidth={1} borderColor="rgba(255,255,255,0.1)">
            <Button size="$5" backgroundColor="$potGold" color="$nightBase" fontWeight="900" icon={isLaunching ? <Spinner color="black" /> : <Play size={20} color="black" />} disabled={isLaunching} onPress={handleStartGame}>
              {isLaunching ? "Distribution..." : `Lancer la partie (${totalPlayers})`}
            </Button>
          </YStack>

        </YStack>
      </PokerBackground>
    </Theme>
  );
}