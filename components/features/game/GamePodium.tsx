import { Game } from "@/types/Game";
import { Trophy } from "@tamagui/lucide-icons";
import { Button, Card, H1, H3, H4, ScrollView, Text, Theme, XStack, YStack } from "tamagui";
import { PokerBackground } from "@/components/layouts/PokerBackground";

export function GamePodium({ game, onClose }: { game: Game, onClose: () => void }) {
    const finalRankings = [...game.players].sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

    return (
      <Theme name="dark">
        <PokerBackground>
          <YStack flex={1} padding="$4" paddingTop="$10" gap="$4">
            
            <YStack alignItems="center" marginVertical="$6">
              <Trophy size={64} color="$potGold" style={{ shadowColor: '#fbbf24', shadowRadius: 10, shadowOpacity: 0.5 }} />
              <H1 color="$potGold" marginTop="$2" fontWeight="900" textShadowColor="rgba(0,0,0,0.5)" textShadowRadius={5}>Résultats</H1>
              <Text color="rgba(255,255,255,0.7)" fontSize="$4">Pot final: {String(game.totalPot)}€</Text>
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
                      // Le vainqueur en Gold transparent, les autres en Verre
                      backgroundColor={isWinner ? "rgba(251, 191, 36, 0.15)" : "rgba(255, 255, 255, 0.05)"}
                      borderColor={isWinner ? "$potGold" : "rgba(255, 255, 255, 0.1)"}
                      borderWidth={isWinner ? 2 : 1}
                    >
                      <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                        <XStack gap="$3" alignItems="center">
                          <H3 fontWeight="900" color={isWinner ? "$potGold" : "rgba(255,255,255,0.5)"}>
                            #{String(player.finalRank)}
                          </H3>
                          <YStack>
                            <H4 color="white">{player.name}</H4>
                            <Text color={profitColor} fontWeight="bold">
                              {profit >= 0 ? "+" : ""}{String(profit)}€ profit
                            </Text>
                          </YStack>
                        </XStack>
                        <YStack alignItems="flex-end">
                          <Text color="white" fontWeight="900" fontSize="$6">{String(player.payout)}€</Text>
                          <Text color="rgba(255,255,255,0.5)" fontSize="$2">Misé: {String(player.totalInvested)}€</Text>
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
        </PokerBackground>
      </Theme>
    );
}