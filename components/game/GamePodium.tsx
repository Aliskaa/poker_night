import { PokerBackground } from "@/components/ui/PokerBackground";
import { Game } from "@/types/Game";
import { DoorOpen, Trophy } from "@tamagui/lucide-icons";
import { Card, H1, H3, H4, ScrollView, Text, Theme, XStack, YStack } from "tamagui";
import { PokerButton } from "../ui";

export function GamePodium({ game, onClose }: { game: Game, onClose: () => void }) {
    const finalRankings = [...game.players].sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

    return (
      <Theme name="dark">
        <PokerBackground>
          <YStack flex={1} padding="$4" paddingTop="$10" gap="$4">
            
            <YStack alignItems="center" marginVertical="$6">
              <Trophy size={64} color="$primary" style={{ shadowColor: '#fbbf24', shadowRadius: 10, shadowOpacity: 0.5 }} />
              <H1 color="$primary" marginTop="$2" fontWeight="900">Résultats</H1>
              <Text color="$text70" fontSize="$4">Pot final: {String(game.totalPot)}€</Text>
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
                      backgroundColor={isWinner ? "$goldBg" : "$glass2"}
                      borderColor={isWinner ? "$primary" : "$glass4"}
                      borderWidth={isWinner ? 2 : 1}
                    >
                      <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                        <XStack gap="$3" alignItems="center">
                          <H3 fontWeight="900" color={isWinner ? "$primary" : "$text60"}>
                            #{String(player.finalRank)}
                          </H3>
                          <YStack>
                            <H4 color="$text95">{player.name}</H4>
                            <Text color={profitColor} fontWeight="bold">
                              {profit >= 0 ? "+" : ""}{String(profit)}€ profit
                            </Text>
                          </YStack>
                        </XStack>
                        <YStack alignItems="flex-end">
                          <Text color="$text95" fontWeight="900" fontSize="$6">{String(player.payout)}€</Text>
                          <Text color="$text60" fontSize="$2">Misé: {String(player.totalInvested)}€</Text>
                        </YStack>
                      </Card.Header>
                    </Card>
                  );
                })}
              </YStack>
            </ScrollView>

            <PokerButton title="Ferme la table" variant="primary" icon={<DoorOpen size={20} />} fontWeight="900" onPress={onClose}/>
          </YStack>
        </PokerBackground>
      </Theme>
    );
}