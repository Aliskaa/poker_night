import { useUserLogic } from '@/hooks/useUserLogic';
import { useUser } from '@clerk/clerk-expo';
import { Medal, Minus, TrendingDown, TrendingUp, Trophy } from '@tamagui/lucide-icons';
import React from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Card, H1, H4, Spinner, Text, Theme, XStack, YStack } from 'tamagui';
import { PokerBackground } from '@/components/ui/PokerBackground';

export default function LeaderboardScreen() {
  const { user: currentUser } = useUser();
  const { leaderboard: players, loading } = useUserLogic();

  if (loading) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#064e3b"><Spinner size="large" color="$potGold" /></YStack>;

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">

          <YStack alignItems="center" marginBottom="$4">
            <Trophy size={56} color="$potGold" style={{ shadowColor: 'black', shadowRadius: 10 }} />
            <H1 color="$potGold" marginTop="$2" fontWeight="900" letterSpacing={-1} textShadowColor="rgba(0,0,0,0.5)" textShadowRadius={5}>Hall of Fame</H1>
            <Text color="rgba(255,255,255,0.6)" letterSpacing={1} textTransform="uppercase" fontSize="$3">
              Classement Général
            </Text>
          </YStack>

          <ScrollView style={{ flex: 1 }}>
            <YStack padding="$4" gap="$3" paddingBottom="$10">
              {players.map((player) => {
                const isFirst = player.rank === 1;
                const isSecond = player.rank === 2;
                const isThird = player.rank === 3;
                const isMe = player.id === currentUser?.id;

                const rankColor = isFirst ? "$potGold" : isSecond ? "#e2e8f0" : isThird ? "#b45309" : "rgba(255,255,255,0.5)";
                const profitColor = player.netProfit > 0 ? "$success" : player.netProfit < 0 ? "$danger" : "$colorMuted";

                return (
                  <Card
                    key={player.id}
                    bordered
                    // LE PREMIER A UN FOND GOLD LÉGER, LES AUTRES SONT GLASS
                    backgroundColor={isFirst ? "rgba(251, 191, 36, 0.15)" : "rgba(255, 255, 255, 0.05)"}
                    borderColor={isMe ? "$accent" : isFirst ? "$potGold" : "rgba(255,255,255,0.1)"}
                    borderWidth={isFirst || isMe ? 2 : 1}
                  >
                    <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">

                      <XStack gap="$3" alignItems="center" flex={1}>
                        <YStack width={24} alignItems="center">
                          {isFirst ? <Trophy size={24} color={rankColor} /> :
                            isSecond || isThird ? <Medal size={24} color={rankColor} /> :
                              <Text color="rgba(255,255,255,0.5)" fontSize="$5" fontWeight="900">#{player.rank}</Text>}
                        </YStack>

                        <Avatar circular size="$4" borderColor={rankColor} borderWidth={2}>
                          <Avatar.Image src={player.avatarUrl} />
                          <Avatar.Fallback backgroundColor="rgba(0,0,0,0.5)" />
                        </Avatar>

                        <YStack flex={1}>
                          <H4 color="white" fontWeight={isMe ? "900" : "700"} numberOfLines={1}>
                            {isMe ? "Moi" : player.name}
                          </H4>
                          <Text color="rgba(255,255,255,0.5)" fontSize="$2">{player.gamesPlayed} parties</Text>
                        </YStack>
                      </XStack>

                      <YStack alignItems="flex-end">
                        <XStack alignItems="center" gap="$1">
                          {player.netProfit > 0 ? <TrendingUp size={16} color="$success" /> :
                            player.netProfit < 0 ? <TrendingDown size={16} color="$danger" /> :
                              <Minus size={16} color="$colorMuted" />}
                          <Text color={profitColor} fontWeight="900" fontSize="$6" letterSpacing={-0.5}>
                            {player.netProfit > 0 ? "+" : ""}{player.netProfit}€
                          </Text>
                        </XStack>
                      </YStack>

                    </Card.Header>
                  </Card>
                );
              })}
            </YStack>
          </ScrollView>
        </YStack>
      </PokerBackground>
    </Theme>
  );
}