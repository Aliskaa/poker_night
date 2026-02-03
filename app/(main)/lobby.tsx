import { useUser } from '@/providers/AuthProvider';
import { Play, Users } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { H2, Spinner, Text, Theme, YStack } from 'tamagui';

import { SelectionCard } from '@/components/lobby/SelectionCard';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { PokerButton } from '@/components/ui/PokerButton';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useGroupLogic } from '@/hooks/useGroupLogic';
import { usePlayerSubcollection } from '@/hooks/usePlayerSubcollection';

export default function LobbyScreen() {
  const router = useRouter();
  const { user } = useUser();
  const params = useLocalSearchParams<{ groupId: string, config: string }>();
  const gameConfig = params.config ? JSON.parse(params.config) : null;

  const { currentGroup: group, memberDetails, loading } = useGroupLogic(params.groupId);
  const { createGame } = useGameLogic();
  const [newGameId, setNewGameId] = useState<string | null>(null);
  const { addPlayer } = usePlayerSubcollection(newGameId || undefined);

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
    if (totalPlayers === 0) {
      alert("Sélectionnez au moins un joueur");
      return;
    }

    setIsLaunching(true);
    
    // Créer la partie vide
    const gameId = await createGame(gameConfig, params.groupId);
    
    if (!gameId) {
      setIsLaunching(false);
      alert("Erreur lors de la création.");
      return;
    }

    // Stocker l'ID pour usePlayerSubcollection
    setNewGameId(gameId);

    // Ajouter tous les membres sélectionnés via subcollection
    for (const memberId of selectedMembers) {
      const member = memberDetails.find(m => m.id === memberId) || (memberId === user?.id ? user : null);
      if (member) {
        await addPlayer({
          userId: member.id,
          name: (member as any).displayName || (member as any).email?.split('@')[0] || 'Joueur',
          avatarUrl: (member as any).photoURL || undefined,
          isActive: true,
          buyInAmount: gameConfig.defaultBuyIn,
          totalInvested: gameConfig.defaultBuyIn,
          rebuyCount: 0,
          position: undefined,
          finalRank: null,
          winnings: 0,
        });
      }
    }

    // Ajouter les invités
    for (const guest of selectedGuests) {
      await addPlayer({
        userId: null,
        name: guest.name,
        avatarUrl: undefined,
        isActive: true,
        buyInAmount: gameConfig.defaultBuyIn,
        totalInvested: gameConfig.defaultBuyIn,
        rebuyCount: 0,
        position: undefined,
        finalRank: null,
        winnings: 0,
      });
    }

    setIsLaunching(false);
    router.replace(`/(main)/game/${gameId}`);
  };

  if (loading || !group) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$primary" /></YStack>;

  const totalPlayers = selectedMembers.length + selectedGuests.length;

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">

          <YStack
            alignItems="center"
            paddingBottom="$5"
            paddingTop="$4"
            backgroundColor="$overlay7"
            borderBottomWidth={2}
            borderBottomColor="$glass5"
          >
            <Users size={44} color="$primary" />
            <H2 color="$text95" fontWeight="900" marginTop="$3" fontSize="$8">Qui est là ?</H2>
            <Text color="$text70" fontSize="$3" marginTop="$1">Sélectionnez les joueurs présents</Text>
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
            paddingBottom="$5"
            backgroundColor="$night900"
            borderTopWidth={2}
            borderTopColor="$glass5"
            elevation={10}
            shadowColor="$overlay9"
            shadowOpacity={0.5}
            shadowRadius={12}
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