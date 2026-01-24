import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, H2, Spinner, Text, Theme, XStack, YStack } from 'tamagui';
import { Clock, Coins, Play, Settings2, Timer, Trophy } from '@tamagui/lucide-icons';

import { useGameLogic } from '@/hooks/useGameLogic';

// --- IMPORT DES SOUS-COMPOSANTS ---
import { ConfigSection } from '@/components/create-game/ConfigSection';
import { OptionButton } from '@/components/create-game/OptionButton';
import { PayoutCard } from '@/components/create-game/PayoutCard';

export default function CreateGameScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { createGame } = useGameLogic();

  // --- ÉTATS DU FORMULAIRE ---
  const [isCreating, setIsCreating] = useState(false);
  const [buyIn, setBuyIn] = useState(10);
  const [blindDuration, setBlindDuration] = useState(15);
  const [lateReg, setLateReg] = useState(60);
  const [payoutModel, setPayoutModel] = useState<'50_30_20' | 'winner_takes_all'>('50_30_20');

  const handleLaunchGame = async () => {
    const gameConfig = { defaultBuyIn: buyIn, defaultTimeBlindDuration: blindDuration, lateRegLimit: lateReg, payoutModel };

    if (groupId) {
      router.push({ pathname: '/(main)/lobby', params: { groupId, config: JSON.stringify(gameConfig) } });
    } else {
      setIsCreating(true);
      const newGameId = await createGame(gameConfig);
      setIsCreating(false);
      if (newGameId) router.replace(`/(main)/game/${newGameId}`);
      else alert("Erreur lors de la création de la partie.");
    }
  };

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        <YStack alignItems="center" marginBottom="$4">
          <Settings2 size={40} color="$potGold" />
          <H2 color="$color" fontWeight="900" marginTop="$2">Configuration</H2>
          <Text color="$colorMuted">Règles de la table</Text>
        </YStack>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <YStack padding="$4" gap="$5">

            <ConfigSection title="Mise de départ (Buy-in)" icon={<Coins size={18} color="$potGold" />}>
              <XStack gap="$2" flexWrap="wrap">
                {[5, 10, 20, 50].map((val) => (
                  <OptionButton key={val} label={`${val}€`} isSelected={buyIn === val} onPress={() => setBuyIn(val)} />
                ))}
              </XStack>
            </ConfigSection>

            <ConfigSection title="Augmentation des Blindes" icon={<Timer size={18} color="$accent" />}>
              <XStack gap="$2" flexWrap="wrap">
                {[15, 20, 30].map((val) => (
                  <OptionButton key={val} label={`${val} min`} isSelected={blindDuration === val} onPress={() => setBlindDuration(val)} />
                ))}
              </XStack>
            </ConfigSection>

            <ConfigSection title="Fermeture des inscriptions" icon={<Clock size={18} color="$danger" />}>
              <XStack gap="$2" flexWrap="wrap">
                <OptionButton label="60 min" isSelected={lateReg === 60} onPress={() => setLateReg(60)} />
                <OptionButton label="90 min" isSelected={lateReg === 90} onPress={() => setLateReg(90)} />
                <OptionButton label="Ouvert" isSelected={lateReg === 0} onPress={() => setLateReg(0)} />
              </XStack>
              <Text color="$colorMuted" fontSize="$2" marginTop="$2">
                {lateReg === 0 ? "Les joueurs peuvent rejoindre à tout moment." : `Impossible de rejoindre ou recaver après ${lateReg} minutes.`}
              </Text>
            </ConfigSection>

            <ConfigSection title="Structure des gains (Payout)" icon={<Trophy size={18} color="$success" />}>
              <YStack gap="$2">
                <PayoutCard title="Podium (50 / 30 / 20)" description="Récompense les 3 premiers joueurs." isSelected={payoutModel === '50_30_20'} onPress={() => setPayoutModel('50_30_20')} />
                <PayoutCard title="Winner Takes All" description="Le 1er ramasse tout le pot." isSelected={payoutModel === 'winner_takes_all'} onPress={() => setPayoutModel('winner_takes_all')} />
              </YStack>
            </ConfigSection>

          </YStack>
        </ScrollView>

        <YStack position="absolute" bottom="$0" left="$0" right="$0" padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
          <Button size="$5" backgroundColor="$success" color="white" fontWeight="900" icon={isCreating ? <Spinner color="white" /> : <Play size={20} />} disabled={isCreating} onPress={handleLaunchGame}>
            {isCreating ? "Création..." : "Ouvrir la table"}
          </Button>
        </YStack>

      </YStack>
    </Theme>
  );
}