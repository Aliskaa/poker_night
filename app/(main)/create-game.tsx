import { ConfigSection } from '@/components/create-game/ConfigSection';
import { OptionButton } from '@/components/create-game/OptionButton';
import { SummaryRow } from '@/components/create-game/SummaryRow';
import { PotDisplay } from '@/components/game/PotDisplay';
import { ChipStack } from '@/components/ui/ChipStack';
import { GlassCard } from '@/components/ui/GlassCard';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { PokerButton } from '@/components/ui/PokerButton';
import { Step, StepContainer, Stepper, useStepper } from '@/components/ui/Stepper';
import { PAYOUT_MODELS } from '@/constants/game';
import { useGameLogic } from '@/hooks/useGameLogic';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Coins, Play, Settings2, Timer, Trophy, Users } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, H2, Separator, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

export default function CreateGameScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { createGame } = useGameLogic();
  const [isCreating, setIsCreating] = useState(false);

  // Wizard state
  const { currentStep, nextStep, prevStep, isFirstStep, isLastStep } = useStepper(4);

  // Game config state
  const [gameType, setGameType] = useState<'casual' | 'tournament'>('casual');
  const [buyIn, setBuyIn] = useState(10);
  const [blindDuration, setBlindDuration] = useState(15);
  const [lateReg, setLateReg] = useState(60);
  const [payoutModel, setPayoutModel] = useState<'50_30_20' | 'winner_takes_all'>('50_30_20');
  const [estimatedPlayers, setEstimatedPlayers] = useState(8);

  const handleLaunchGame = async () => {
    const gameConfig = {
      defaultBuyIn: buyIn,
      defaultTimeBlindDuration: blindDuration,
      lateRegLimit: lateReg,
      payoutModel
    };

    if (groupId) {
      router.push({
        pathname: '/(main)/lobby',
        params: { groupId, config: JSON.stringify(gameConfig) }
      });
    } else {
      setIsCreating(true);
      const newGameId = await createGame(gameConfig);
      setIsCreating(false);
      if (newGameId) router.replace(`/(main)/game/${newGameId}`);
      else alert("Erreur lors de la création.");
    }
  };

  const estimatedPot = buyIn * estimatedPlayers;

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$6">
          {/* Header avec Stepper */}
          <YStack paddingHorizontal="$4" marginBottom="$4">
            <YStack alignItems="center" marginBottom="$4">
              <Settings2 size={40} color="$primary" />
              <H2 color="$text95" fontWeight="900" marginTop="$2">Nouvelle Partie</H2>
              <Text color="$text60">Configuration en {currentStep}/4 étapes</Text>
            </YStack>

            <Stepper
              currentStep={currentStep}
              totalSteps={4}
              labels={['Type', 'Config', 'Joueurs', 'Confirmer']}
            />
          </YStack>

          {/* Steps content */}
          <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
            <YStack padding="$4" gap="$5">
              <StepContainer currentStep={currentStep}>

                {/* STEP 1: Type de partie */}
                <Step title="Type de partie">
                  <YStack gap="$3">
                    <Text color="$text60" fontSize="$3">
                      Choisis le format de ta partie
                    </Text>

                    <GlassCard
                      icon={<Users />}
                      title="Partie Casual"
                      subtitle="Entre amis, sans pression"
                      onPress={() => setGameType('casual')}
                      showChevron={false}
                      borderColor={gameType === 'casual' ? '$primary' : '$glass4'}
                      borderWidth={gameType === 'casual' ? 2 : 1}
                    />

                    <GlassCard
                      icon={<Trophy />}
                      title="Tournoi"
                      subtitle="Compétition avec classement"
                      onPress={() => setGameType('tournament')}
                      showChevron={false}
                      borderColor={gameType === 'tournament' ? '$primary' : '$glass4'}
                      borderWidth={gameType === 'tournament' ? 2 : 1}
                    />
                  </YStack>
                </Step>

                {/* STEP 2: Configuration */}
                <Step title="Configuration de la table">
                  <YStack gap="$5">
                    <ConfigSection title="Mise de départ" icon={<Coins size={18} color="$primary" />}>
                      <XStack gap="$2" flexWrap="wrap">
                        {[5, 10, 20, 50].map((val) => (
                          <OptionButton
                            key={val}
                            label={`${val}€`}
                            isSelected={buyIn === val}
                            onPress={() => setBuyIn(val)}
                          />
                        ))}
                      </XStack>
                    </ConfigSection>

                    <ConfigSection title="Durée des blindes" icon={<Timer size={18} color="$accent" />}>
                      <XStack gap="$2" flexWrap="wrap">
                        {[10, 15, 20, 30].map((val) => (
                          <OptionButton
                            key={val}
                            label={`${val} min`}
                            isSelected={blindDuration === val}
                            onPress={() => setBlindDuration(val)}
                          />
                        ))}
                      </XStack>
                    </ConfigSection>

                    <ConfigSection title="Inscriptions tardives" icon={<Clock size={18} color="$danger" />}>
                      <XStack gap="$2" flexWrap="wrap">
                        <OptionButton
                          label="30 min"
                          isSelected={lateReg === 30}
                          onPress={() => setLateReg(30)}
                        />
                        <OptionButton
                          label="60 min"
                          isSelected={lateReg === 60}
                          onPress={() => setLateReg(60)}
                        />
                        <OptionButton
                          label="Ouvert"
                          isSelected={lateReg === 0}
                          onPress={() => setLateReg(0)}
                        />
                      </XStack>
                    </ConfigSection>

                    <ConfigSection title="Répartition des gains" icon={<Trophy size={18} color="$success" />}>
                      <YStack gap="$2">
                        {Object.entries(PAYOUT_MODELS).map(([key, model]) => (
                          <GlassCard
                            key={key}
                            icon={<Trophy />}
                            title={model.title}
                            subtitle={model.description}
                            onPress={() => setPayoutModel(key as keyof typeof PAYOUT_MODELS)}
                            showChevron={false}
                            borderColor={payoutModel === key ? '$primary' : '$glass4'}
                            borderWidth={payoutModel === key ? 2 : 1}
                          />
                        ))}
                      </YStack>
                    </ConfigSection>
                  </YStack>
                </Step>

                {/* STEP 3: Joueurs */}
                <Step title="Nombre de joueurs">
                  <YStack gap="$3">
                    <Text color="$text60" fontSize="$3">
                      Combien de joueurs estimes-tu pour cette partie ?
                    </Text>

                    <YStack gap="$2">
                      <Text color="$text95" fontSize="$5" fontWeight="700">
                        Joueurs attendus : {estimatedPlayers}
                      </Text>

                      <XStack gap="$2" flexWrap="wrap">
                        {[4, 6, 8, 10, 12, 15].map((val) => (
                          <OptionButton
                            key={val}
                            label={`${val}`}
                            isSelected={estimatedPlayers === val}
                            onPress={() => setEstimatedPlayers(val)}
                          />
                        ))}
                      </XStack>
                    </YStack>

                    <Separator marginVertical="$3" borderColor="$overlay3" />

                    <YStack gap="$2">
                      <Text color="$text60" fontSize="$3">
                        Pot estimé avec {estimatedPlayers} joueurs :
                      </Text>
                      <XStack justifyContent="center" marginTop="$2">
                        <ChipStack amount={estimatedPot} variant="pot" size="lg" />
                      </XStack>
                    </YStack>
                  </YStack>
                </Step>

                {/* STEP 4: Confirmation */}
                <Step title="Récapitulatif">
                  <YStack gap="$4">
                    <Text color="$text60" fontSize="$3">
                      Vérifie ta configuration avant de lancer la partie
                    </Text>

                    {/* Preview du pot */}
                    <PotDisplay
                      totalPot={estimatedPot}
                      playerCount={estimatedPlayers}
                      payoutModel={payoutModel}
                      showPayoutPreview
                    />

                    <Separator borderColor="$overlay3" />

                    {/* Résumé configuration */}
                    <YStack gap="$3">
                      <SummaryRow icon={<Trophy size={18} color="$primary" />} label="Type" value={gameType === 'casual' ? 'Casual' : 'Tournoi'} />
                      <SummaryRow icon={<Coins size={18} color="$primary" />} label="Buy-in" value={`${buyIn}€`} />
                      <SummaryRow icon={<Timer size={18} color="$primary" />} label="Blindes" value={`${blindDuration} min`} />
                      <SummaryRow icon={<Clock size={18} color="$primary" />} label="Late reg" value={lateReg === 0 ? 'Ouvert' : `${lateReg} min`} />
                      <SummaryRow icon={<Users size={18} color="$primary" />} label="Joueurs" value={`~${estimatedPlayers}`} />
                      <SummaryRow
                        icon={<CheckCircle2 size={18} color="$primary" />}
                        label="Payout"
                        value={PAYOUT_MODELS[payoutModel].title}
                      />
                    </YStack>
                  </YStack>
                </Step>

              </StepContainer>
            </YStack>
          </ScrollView>

          {/* Navigation buttons */}
          <YStack
            position="absolute"
            bottom="$0"
            left="$0"
            right="$0"
            padding="$4"
            backgroundColor="$overlay9"
            borderTopWidth={1}
            borderColor="$overlay3"
            gap="$2"
          >
            <XStack gap="$2">
              {!isFirstStep && (
                <PokerButton
                  flex={1}
                  variant="secondary"
                  icon={<ArrowLeft />}
                  title="Précédent"
                  onPress={prevStep}
                />
              )}

              {!isLastStep ? (
                <PokerButton
                  flex={1}
                  variant="primary"
                  icon={<ArrowRight />}
                  title="Suivant"
                  onPress={nextStep}
                />
              ) : (
                <PokerButton
                  flex={1}
                  variant="success"
                  icon={isCreating ? <Spinner color="$night900" /> : <Play />}
                  title={isCreating ? "Création..." : "Lancer la partie"}
                  disabled={isCreating}
                  onPress={handleLaunchGame}
                />
              )}
            </XStack>
          </YStack>
        </YStack>
      </PokerBackground>
    </Theme>
  );
}