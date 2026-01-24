import { Game } from "@/types/Game";
import { Trophy } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Button, Card, H1, H3, H4, ScrollView, Text, Theme, XStack, YStack } from "tamagui";

export function GamePodium({ game, onClose }: { game: Game, onClose: () => void }) {
    const finalRankings = [...game.players].sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

    return (
      <Theme name="dark">
        <YStack flex={1} backgroundColor="$background" padding="$4" paddingTop="$10" gap="$4">
          <YStack alignItems="center" marginVertical="$6">
            <Trophy size={64} color="$potGold" />
            <H1 color="$potGold" marginTop="$2" fontWeight="900">Résultats</H1>
            <Text color="$colorMuted" fontSize="$4">Pot final: {String(game.totalPot)}€</Text>
          </YStack>

          <ScrollView>
            <YStack gap="$3">
              {finalRankings.map((player) => {
                const isWinner = player.finalRank === 1;
                const profit = (player.payout || 0) - player.totalInvested;
                const profitColor = profit >= 0 ? "$success" : "$danger";

                return (
                  <Card
                    key={player.id}
                    bordered
                    backgroundColor={isWinner ? "rgba(251, 191, 36, 0.1)" : "$backgroundStrong"}
                    borderColor={isWinner ? "$potGold" : "$borderColor"}
                  >
                    <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                      <XStack gap="$3" alignItems="center">
                        <H3 fontWeight="900" color={isWinner ? "$potGold" : "$colorMuted"}>
                          #{String(player.finalRank)}
                        </H3>
                        <YStack>
                          <H4 color="$color">{player.name}</H4>
                          <Text color={profitColor} fontWeight="bold">
                            {profit >= 0 ? "+" : ""}{String(profit)}€ profit
                          </Text>
                        </YStack>
                      </XStack>
                      <YStack alignItems="flex-end">
                        <Text color="$color" fontWeight="900" fontSize="$6">{String(player.payout)}€</Text>
                        <Text color="$colorMuted" fontSize="$2">Misé: {String(player.totalInvested)}€</Text>
                      </YStack>
                    </Card.Header>
                  </Card>
                );
              })}
            </YStack>
          </ScrollView>

          <Button size="$5" backgroundColor="$potGold" color="$nightBase" fontWeight="900" onPress={onClose}>
            Fermer la table
          </Button>
        </YStack>
      </Theme>
    );
}