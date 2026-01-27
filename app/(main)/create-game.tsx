import { ConfigSection } from '@/components/features/create/ConfigSection';
import { OptionButton } from '@/components/features/create/OptionButton';
import { PayoutCard } from '@/components/features/create/PayoutCard';
import { PokerBackground } from '@/components/layouts/PokerBackground';
import { PAYOUT_MODELS } from '@/constants/game';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Clock, Coins, Play, Settings2, Timer, Trophy } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, H2, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

export default function CreateGameScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { createGame } = useGameLogic();
  const [isCreating, setIsCreating] = useState(false);

  const [buyIn, setBuyIn] = useState(10);
  const [blindDuration, setBlindDuration] = useState(15);
  const [lateReg, setLateReg] = useState(60);
  const [payoutModel, setPayoutModel] = useState<keyof typeof PAYOUT_MODELS>('50_30_20');

  const handleLaunchGame = async () => {
    const gameConfig = { defaultBuyIn: buyIn, defaultTimeBlindDuration: blindDuration, lateRegLimit: lateReg, payoutModel };
    if (groupId) {
      router.push({ pathname: '/(main)/lobby', params: { groupId, config: JSON.stringify(gameConfig) } });
    } else {
      setIsCreating(true);
      const newGameId = await createGame(gameConfig);
      setIsCreating(false);
      if (newGameId) router.replace(`/(main)/game/${newGameId}`);
      else alert("Erreur.");
    }
  };

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">
          <YStack alignItems="center" marginBottom="$4">
            <Settings2 size={40} color="$primary" />
            <H2 color="$colorPrimary" fontWeight="900" marginTop="$2">Configuration</H2>
            <Text color="$colorMuted">Règles de la table</Text>
          </YStack>

          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <YStack padding="$4" gap="$5">
              <ConfigSection title="Mise de départ" icon={<Coins size={18} color="$primary" />}>
                <XStack gap="$2" flexWrap="wrap">
                  {[5, 10, 20, 50].map((val) => (
                    <OptionButton key={val} label={`${val}€`} isSelected={buyIn === val} onPress={() => setBuyIn(val)} />
                  ))}
                </XStack>
              </ConfigSection>

              <ConfigSection title="Blindes" icon={<Timer size={18} color="$info" />}>
                <XStack gap="$2" flexWrap="wrap">
                  {[15, 20, 30].map((val) => (
                    <OptionButton key={val} label={`${val} min`} isSelected={blindDuration === val} onPress={() => setBlindDuration(val)} />
                  ))}
                </XStack>
              </ConfigSection>

              <ConfigSection title="Inscriptions" icon={<Clock size={18} color="$danger" />}>
                <XStack gap="$2" flexWrap="wrap">
                  <OptionButton label="60 min" isSelected={lateReg === 60} onPress={() => setLateReg(60)} />
                  <OptionButton label="Ouvert" isSelected={lateReg === 0} onPress={() => setLateReg(0)} />
                </XStack>
              </ConfigSection>

              <ConfigSection title="Payout" icon={<Trophy size={18} color="$success" />}>
                <YStack gap="$2">
                  {Object.entries(PAYOUT_MODELS).map(([key, model]) => (
                    <PayoutCard key={key} title={model.title} description={model.description} isSelected={payoutModel === key} onPress={() => setPayoutModel(key as keyof typeof PAYOUT_MODELS)} />
                  ))}
                </YStack>
              </ConfigSection>
            </YStack>
          </ScrollView>

          <YStack position="absolute" bottom="$0" left="$0" right="$0" padding="$4" backgroundColor="$overlay8" borderTopWidth={1} borderColor="$borderColor">
            <Button size="$5" backgroundColor="$primary" color="$night900" fontWeight="900" icon={isCreating ? <Spinner color="$night900" /> : <Play size={20} color="$night900" />} disabled={isCreating} onPress={handleLaunchGame}>
              {isCreating ? "Création..." : "Ouvrir la table"}
            </Button>
          </YStack>
        </YStack>
      </PokerBackground>
    </Theme>
  );
}