import { ScrollView, YStack, H1, H2, XStack, Separator } from 'tamagui'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ChipStack } from '@/components/ui/ChipStack'
import { CountdownBadge } from '@/components/ui/CountdownBadge'
import { Stepper, useStepper } from '@/components/ui/Stepper'
import { BlindTimer } from '@/components/game/BlindTimer'
import { BlindLevel } from '@/components/game/BlindLevel'
import { PotDisplay } from '@/components/game/PotDisplay'
import { PokerButton } from '@/components/ui/PokerButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { Plus, Users, Settings, Trophy } from '@tamagui/lucide-icons'
import { useState } from 'react'

function StepperDemo() {
  const { currentStep, nextStep, prevStep } = useStepper(4)

  return (
    <YStack gap="$4">
      <Stepper currentStep={currentStep} totalSteps={4} labels={['Type', 'Config', 'Players', 'Confirm']} />
      <XStack gap="$2">
        <PokerButton 
          variant="secondary" 
          icon={<Settings />}
          title="Précédent"
          onPress={prevStep} 
          disabled={currentStep === 1}
        />
        <PokerButton 
          variant="primary" 
          icon={<Plus />}
          title="Suivant"
          onPress={nextStep} 
          disabled={currentStep === 4}
        />
      </XStack>
    </YStack>
  )
}

export default function ShowcaseScreen() {
  const [timerSeconds, setTimerSeconds] = useState(450)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <ScrollView flex={1} backgroundColor="$night900">
      <YStack padding="$4" gap="$6" paddingBottom="$20">
        <H1 color="$text95">🎨 UI Components Showcase</H1>

        {/* StatusBadge */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">StatusBadge</H2>
          <XStack gap="$2" flexWrap="wrap">
            <StatusBadge status="ACTIVE" />
            <StatusBadge status="ELIMINATED" />
            <StatusBadge status="REBUY" />
          </XStack>
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* ChipStack */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">ChipStack</H2>
          <YStack gap="$2">
            <H2 color="$text60" size="$3">Variants</H2>
            <XStack gap="$2" flexWrap="wrap">
              <ChipStack amount={1250} variant="default" />
              <ChipStack amount={5000} variant="pot" />
              <ChipStack amount={800} variant="stack" />
              <ChipStack amount={500} variant="rebuy" />
            </XStack>
          </YStack>
          <YStack gap="$2" marginTop="$2">
            <H2 color="$text60" size="$3">Sizes</H2>
            <XStack gap="$2" flexWrap="wrap" alignItems="center">
              <ChipStack amount={100} size="sm" />
              <ChipStack amount={100} size="md" />
              <ChipStack amount={100} size="lg" />
            </XStack>
          </YStack>
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* CountdownBadge */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">CountdownBadge</H2>
          <XStack gap="$2" flexWrap="wrap">
            <CountdownBadge seconds={600} label="Normal" />
            <CountdownBadge seconds={250} label="Warning" />
            <CountdownBadge seconds={45} label="Urgent" />
          </XStack>
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* Stepper */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">Stepper</H2>
          <StepperDemo />
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* PokerButton */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">PokerButton</H2>
          <YStack gap="$2">
            <PokerButton variant="primary" icon={<Plus />} title="Primary Button" subtitle="With subtitle" />
            <PokerButton variant="secondary" icon={<Settings />} title="Secondary" />
            <PokerButton variant="success" icon={<Trophy />} title="Success" />
            <PokerButton variant="danger" icon={<Users />} title="Danger" />
            <PokerButton variant="primary" icon={<Plus />} title="Disabled" disabled />
          </YStack>
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* GlassCard */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">GlassCard</H2>
          <YStack gap="$2">
            <GlassCard icon={<Users />} title="Card with subtitle" subtitle="And a description" />
            <GlassCard icon={<Settings />} title="With chevron" showChevron />
            <GlassCard icon={<Trophy />} title="Pressable card" onPress={() => alert('Pressed!')} />
          </YStack>
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* BlindLevel */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">BlindLevel</H2>
          <YStack gap="$2">
            <BlindLevel
              currentSmallBlind={50}
              currentBigBlind={100}
              currentAnte={10}
              nextSmallBlind={100}
              nextBigBlind={200}
              nextAnte={25}
            />
            <BlindLevel
              currentSmallBlind={50}
              currentBigBlind={100}
              nextSmallBlind={100}
              nextBigBlind={200}
            />
          </YStack>
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* BlindTimer */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">BlindTimer</H2>
          <BlindTimer
            seconds={timerSeconds}
            isRunning={isRunning}
            onToggle={() => setIsRunning(!isRunning)}
            onReset={() => setTimerSeconds(450)}
            showResetButton
          />
          <BlindTimer
            seconds={45}
            isRunning={false}
            onToggle={() => {}}
          />
        </YStack>

        <Separator borderColor="$overlay3" />

        {/* PotDisplay */}
        <YStack gap="$3">
          <H2 color="$text95" size="$6">PotDisplay</H2>
          <PotDisplay
            totalPot={5000}
            playerCount={8}
            payoutModel="winner_takes_all"
            showPayoutPreview
          />
          <PotDisplay
            totalPot={3000}
            playerCount={12}
            payoutModel="50_30_20"
            showPayoutPreview
          />
        </YStack>
      </YStack>
    </ScrollView>
  )
}

