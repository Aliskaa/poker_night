import { HAND_RANKINGS } from '@/constants/poker'
import { HandRow } from '@/components/poker/HandRow'
import { Trophy } from '@tamagui/lucide-icons'
import React from 'react'
import { ScrollView } from 'react-native'
import { H4, Sheet, Text, XStack, YStack } from 'tamagui'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Liste des combinaisons (du Texas Hold'em) pendant une partie.
 * Ne dépend pas du tutoriel timer de HelpBottomSheet.
 */
export function HandRankingSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[88]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Handle backgroundColor="$glass5" />
      <Sheet.Frame padding="$4" gap="$3" backgroundColor="$background" flex={1}>
        <XStack alignItems="center" gap="$3" paddingBottom="$2">
          <Trophy size={28} color="$primary" />
          <YStack flex={1}>
            <H4 color="$color" fontWeight="900">
              Combinaisons
            </H4>
            <Text color="$colorMuted" fontSize="$2">
              Du plus fort au plus faible
            </Text>
          </YStack>
        </XStack>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
          <YStack gap="$3">
            {HAND_RANKINGS.map((hand) => (
              <HandRow key={hand.rank} hand={hand} />
            ))}
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  )
}
