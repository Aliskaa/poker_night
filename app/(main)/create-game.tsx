import { useGameLogic } from '@/hooks/useGameLogic';
import { Check, Clock, Coins, Play, Settings2, Timer, Trophy } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, H2, H4, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

export default function CreateGameScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>(); // Si on vient d'un Club
  const { createGame } = useGameLogic();
  const [isCreating, setIsCreating] = useState(false);

  // --- ÉTATS DU FORMULAIRE ---
  const [buyIn, setBuyIn] = useState(10);
  const [blindDuration, setBlindDuration] = useState(15); // en minutes
  const [lateReg, setLateReg] = useState(60); // en minutes (0 = pas de limite)
  const [payoutModel, setPayoutModel] = useState<'50_30_20' | 'winner_takes_all'>('50_30_20');

  const handleLaunchGame = async () => {
    // 1. On prépare notre objet de configuration
    const gameConfig = {
      defaultBuyIn: buyIn,
      defaultTimeBlindDuration: blindDuration,
      lateRegLimit: lateReg,
      payoutModel: payoutModel
    };

    // -----------------------------------------------------------------
    // VOIE N°1 : PARTIE DE CLUB -> Direction le Lobby
    // -----------------------------------------------------------------
    if (groupId) {
      router.push({
        pathname: '/(main)/lobby',
        params: {
          groupId: groupId,
          config: JSON.stringify(gameConfig)
        }
      });
    }
    // -----------------------------------------------------------------
    // VOIE N°2 : PARTIE LIBRE -> Création directe et go sur la table !
    // -----------------------------------------------------------------
    else {
      setIsCreating(true);
      // On crée la partie immédiatement sans groupId
      const newGameId = await createGame(gameConfig);
      setIsCreating(false);

      if (newGameId) {
        router.replace(`/(main)/game/${newGameId}`);
      } else {
        alert("Erreur lors de la création de la partie.");
      }
    }
  };

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">

        {/* EN-TÊTE */}
        <YStack alignItems="center" marginBottom="$4">
          <Settings2 size={40} color="$potGold" />
          <H2 color="$color" fontWeight="900" marginTop="$2">Configuration</H2>
          <Text color="$colorMuted">Règles de la table</Text>
        </YStack>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <YStack padding="$4" gap="$5">

            {/* 1. BUY-IN */}
            <ConfigSection title="Mise de départ (Buy-in)" icon={<Coins size={18} color="$potGold" />}>
              <XStack gap="$2" flexWrap="wrap">
                {[5, 10, 20, 50].map((val) => (
                  <OptionButton key={val} label={`${val}€`} isSelected={buyIn === val} onPress={() => setBuyIn(val)} />
                ))}
              </XStack>
            </ConfigSection>

            {/* 2. DURÉE DES BLINDES */}
            <ConfigSection title="Augmentation des Blindes" icon={<Timer size={18} color="$accent" />}>
              <XStack gap="$2" flexWrap="wrap">
                {[15, 20, 30].map((val) => (
                  <OptionButton key={val} label={`${val} min`} isSelected={blindDuration === val} onPress={() => setBlindDuration(val)} />
                ))}
              </XStack>
            </ConfigSection>

            {/* 3. LATE REGISTRATION (Inscriptions tardives) */}
            <ConfigSection title="Fermeture des inscriptions" icon={<Clock size={18} color="$danger" />}>
              <XStack gap="$2" flexWrap="wrap">
                <OptionButton label="60 min" isSelected={lateReg === 60} onPress={() => setLateReg(60)} />
                <OptionButton label="90 min" isSelected={lateReg === 90} onPress={() => setLateReg(90)} />
                <OptionButton label="Ouvert" isSelected={lateReg === 0} onPress={() => setLateReg(0)} />
              </XStack>
              <Text color="$colorMuted" fontSize="$2" marginTop="$2">
                {lateReg === 0 ? "Les joueurs peuvent rejoindre à tout moment." : `Impossible de rejoindre ou recaver après ${lateReg} minutes de jeu.`}
              </Text>
            </ConfigSection>

            {/* 4. RÉPARTITION DES GAINS */}
            <ConfigSection title="Structure des gains (Payout)" icon={<Trophy size={18} color="$success" />}>
              <YStack gap="$2">
                <PayoutCard
                  title="Podium (50 / 30 / 20)"
                  description="Récompense les 3 premiers joueurs."
                  isSelected={payoutModel === '50_30_20'}
                  onPress={() => setPayoutModel('50_30_20')}
                />
                <PayoutCard
                  title="Winner Takes All"
                  description="Le 1er ramasse tout le pot."
                  isSelected={payoutModel === 'winner_takes_all'}
                  onPress={() => setPayoutModel('winner_takes_all')}
                />
              </YStack>
            </ConfigSection>

          </YStack>
        </ScrollView>

        {/* BOUTON FLOTTANT DE LANCEMENT */}
        <YStack position="absolute" bottom="$0" left="$0" right="$0" padding="$4" backgroundColor="$backgroundStrong" borderTopWidth={1} borderColor="$borderColor">
          <Button size="$5" backgroundColor="$success" color="white" fontWeight="900" icon={isCreating ? <Spinner color="white" /> : <Play size={20} />} disabled={isCreating} onPress={handleLaunchGame}>
            {isCreating ? "Création..." : "Ouvrir la table"}
          </Button>
        </YStack>

      </YStack>
    </Theme>
  );
}

// --- SOUS-COMPOSANTS POUR RENDRE LE CODE PROPRE ---

function ConfigSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <YStack gap="$3">
      <XStack alignItems="center" gap="$2">
        {icon}
        <H4 color="$color" fontWeight="bold">{title}</H4>
      </XStack>
      {children}
    </YStack>
  );
}

function OptionButton({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) {
  return (
    <Button size="$3" flex={1} minWidth={70} backgroundColor={isSelected ? "$potGold" : "$backgroundStrong"} borderColor={isSelected ? "$potGold" : "$borderColor"} borderWidth={1} onPress={onPress}>
      <Text color={isSelected ? "$nightBase" : "$color"} fontWeight={isSelected ? "900" : "600"}>{label}</Text>
    </Button>
  );
}

function PayoutCard({ title, description, isSelected, onPress }: { title: string, description: string, isSelected: boolean, onPress: () => void }) {
  return (
    <Card bordered backgroundColor={isSelected ? "rgba(5, 150, 105, 0.1)" : "$backgroundStrong"} borderColor={isSelected ? "$success" : "$borderColor"} pressStyle={{ scale: 0.98 }} onPress={onPress}>
      <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
        <YStack flex={1}>
          <Text color={isSelected ? "$success" : "$color"} fontWeight="bold" fontSize="$4">{title}</Text>
          <Text color="$colorMuted" fontSize="$2">{description}</Text>
        </YStack>
        {isSelected && <Check size={20} color="$success" />}
      </Card.Header>
    </Card>
  );
}