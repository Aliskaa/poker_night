import { useUserLogic } from '@/hooks/useUserLogic';
import { useUser } from '@clerk/clerk-expo';
import { Medal, Minus, TrendingDown, TrendingUp, Trophy, Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Card, H1, H4, Spinner, Text, Theme, XStack, YStack } from 'tamagui';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { FAB } from '@/components/ui/FAB';
import { useRouter } from 'expo-router';

export default function LeaderboardScreen() {
  const { user: currentUser } = useUser();
  const { leaderboard: players, loading } = useUserLogic();
  const router = useRouter();

  if (loading) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$primary" /></YStack>;

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1} paddingTop="$10">

          <YStack alignItems="center" marginBottom="$4">
            <Trophy size={56} color="$primary" style={{ shadowColor: 'black', shadowRadius: 10 }} />
            <H1 color="$primary" marginTop="$2" fontWeight="900" letterSpacing={-1}>Hall of Fame</H1>
            <Text color="$text60" letterSpacing={1} textTransform="uppercase" fontSize="$3">
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

                const rankColor = isFirst ? "$primary" : isSecond ? "#e2e8f0" : isThird ? "#b45309" : "$text60";
                const profitColor = player.netProfit > 0 ? "$success" : player.netProfit < 0 ? "$danger" : "$text60";

                return (
                  <Card
                    key={player.id}
                    bordered
                    backgroundColor={isFirst ? "$goldBg" : "$glass2"}
                    borderColor={isMe ? "$accent" : isFirst ? "$primary" : "$glass4"}
                    borderWidth={isFirst || isMe ? 2 : 1}
                  >
                    <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">

                      <XStack gap="$3" alignItems="center" flex={1}>
                        <YStack width={24} alignItems="center">
                          {isFirst ? <Trophy size={24} color={rankColor} /> :
                            isSecond || isThird ? <Medal size={24} color={rankColor} /> :
                              <Text color="$text60" fontSize="$5" fontWeight="900">#{player.rank}</Text>}
                        </YStack>

                        <Avatar circular size="$4" borderColor={rankColor} borderWidth={2}>
                          <Avatar.Image src={player.avatarUrl} />
                          <Avatar.Fallback backgroundColor="$glass4" />
                        </Avatar>

                        <YStack flex={1}>
                          <H4 color="$text95" fontWeight={isMe ? "900" : "700"} numberOfLines={1}>
                            {isMe ? "Moi" : player.name}
                          </H4>
                          <Text color="$text60" fontSize="$2">{player.gamesPlayed} parties</Text>
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
        
        {/* FAB flottant pour créer une partie */}
        <FAB 
          icon={<Plus size={28} color="$night900" />}
          fabPosition="bottom-right"
          offset={70}
          onPress={() => router.push('/(main)/create-game')}
        />
      </PokerBackground>
    </Theme>
  );
}