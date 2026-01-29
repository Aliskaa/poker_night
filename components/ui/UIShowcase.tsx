import { ScrollView } from 'react-native'
import { YStack, XStack, Text, H3, Separator } from 'tamagui'
import { StatusBadge } from './StatusBadge'
import { ChipStack } from './ChipStack'
import { CountdownBadge, CountdownOrClosed } from './CountdownBadge'
import { Stepper } from './Stepper'

/**
 * 🎨 COMPOSANT SHOWCASE
 * 
 * Démo de tous les nouveaux composants UI primitifs
 * À utiliser pour tester visuellement ou comme référence
 */
export function UIShowcase() {
  return (
    <ScrollView>
      <YStack padding="$4" gap="$6" backgroundColor="$background">
        
        {/* STATUS BADGES */}
        <YStack gap="$3">
          <H3 color="$colorPrimary">Status Badges</H3>
          <XStack gap="$3" flexWrap="wrap">
            <StatusBadge status="ACTIVE" />
            <StatusBadge status="ELIMINATED" />
            <StatusBadge status="REBUY" />
            <StatusBadge status="ACTIVE" showIcon={false} />
          </XStack>
        </YStack>

        <Separator borderColor="$glass4" />

        {/* CHIP STACKS */}
        <YStack gap="$3">
          <H3 color="$colorPrimary">Chip Stacks</H3>
          
          <Text color="$colorSecondary" fontSize="$3">Variants:</Text>
          <XStack gap="$3" flexWrap="wrap">
            <ChipStack amount={250} variant="default" />
            <ChipStack amount={500} variant="pot" />
            <ChipStack amount={1500} variant="stack" />
            <ChipStack amount={100} variant="rebuy" />
          </XStack>

          <Text color="$colorSecondary" fontSize="$3">Sizes:</Text>
          <XStack gap="$3" flexWrap="wrap" alignItems="center">
            <ChipStack amount={50} size="sm" variant="pot" />
            <ChipStack amount={250} size="md" variant="pot" />
            <ChipStack amount={1000} size="lg" variant="pot" />
          </XStack>

          <Text color="$colorSecondary" fontSize="$3">Options:</Text>
          <XStack gap="$3" flexWrap="wrap">
            <ChipStack amount={2500} variant="pot" showIcon={false} />
            <ChipStack amount={100} variant="stack" currency="$" />
          </XStack>
        </YStack>

        <Separator borderColor="$glass4" />

        {/* COUNTDOWN BADGES */}
        <YStack gap="$3">
          <H3 color="$colorPrimary">Countdown Badges</H3>
          
          <Text color="$colorSecondary" fontSize="$3">Auto-detect variant:</Text>
          <XStack gap="$3" flexWrap="wrap">
            <CountdownBadge seconds={600} />
            <CountdownBadge seconds={240} />
            <CountdownBadge seconds={45} />
            <CountdownOrClosed seconds={0} />
          </XStack>

          <Text color="$colorSecondary" fontSize="$3">With labels:</Text>
          <XStack gap="$3" flexWrap="wrap">
            <CountdownBadge seconds={300} label="Late Reg" />
            <CountdownBadge seconds={45} label="Break" />
          </XStack>

          <Text color="$colorSecondary" fontSize="$3">Manual variants:</Text>
          <XStack gap="$3" flexWrap="wrap">
            <CountdownBadge seconds={600} variant="default" />
            <CountdownBadge seconds={600} variant="warning" />
            <CountdownBadge seconds={600} variant="urgent" />
          </XStack>
        </YStack>

        <Separator borderColor="$glass4" />

        {/* STEPPER */}
        <YStack gap="$3">
          <H3 color="$colorPrimary">Stepper</H3>
          
          <Text color="$colorSecondary" fontSize="$3">Basic (no labels):</Text>
          <Stepper currentStep={2} totalSteps={4} />

          <Text color="$colorSecondary" fontSize="$3">With labels:</Text>
          <Stepper 
            currentStep={3} 
            totalSteps={4}
            labels={['Config', 'Joueurs', 'Révision', 'Lancement']}
          />

          <Text color="$colorSecondary" fontSize="$3">Step 1 of 4:</Text>
          <Stepper 
            currentStep={1} 
            totalSteps={4}
            labels={['Type', 'Config', 'Players', 'Go']}
          />
        </YStack>

        <Separator borderColor="$glass4" />

        {/* COMBINATIONS */}
        <YStack gap="$3">
          <H3 color="$colorPrimary">Combinations</H3>
          
          <YStack 
            backgroundColor="$glass2" 
            borderColor="$glass4"
            borderWidth={1}
            borderRadius="$5"
            padding="$4"
            gap="$3"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text color="$colorPrimary" fontWeight="600">Player Name</Text>
              <StatusBadge status="ACTIVE" />
            </XStack>
            
            <XStack gap="$3" flexWrap="wrap">
              <ChipStack amount={1500} variant="stack" size="sm" />
              <ChipStack amount={200} variant="rebuy" size="sm" />
            </XStack>
          </YStack>

          <YStack 
            backgroundColor="$goldBg" 
            borderColor="$primary"
            borderWidth={2}
            borderRadius="$6"
            padding="$4"
            gap="$2"
            alignItems="center"
          >
            <Text color="$primary" fontSize="$3" fontWeight="600" textTransform="uppercase">Total Pot</Text>
            <ChipStack amount={5250} variant="pot" size="lg" />
            <CountdownBadge seconds={180} label="Late Reg" />
          </YStack>
        </YStack>

      </YStack>
    </ScrollView>
  )
}
