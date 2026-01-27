import React from 'react';
import { YStack, XStack, Text, View, ScrollView } from 'tamagui';
import { Trophy, TrendingUp, Medal, Award } from '@tamagui/lucide-icons';
import { Card } from '@/components/primitives/Cards';
import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';

// ═══════════════════════════════════════════════════════════════════
// 🏆 LEADERBOARD LIST - Liste classement des joueurs
// ═══════════════════════════════════════════════════════════════════

type LeaderboardPlayer = {
  id: string;
  name: string;
  avatar?: string;
  profit: number;
  gamesPlayed: number;
  winRate: number;
  rank: number;
  previousRank?: number;
};

type LeaderboardListProps = {
  players: LeaderboardPlayer[];
  currentUserId?: string;
  variant?: 'full' | 'compact';
  onPlayerPress?: (playerId: string) => void;
};

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  players,
  currentUserId,
  variant = 'full',
  onPlayerPress,
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} color="$primary" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Medal size={24} color="#CD7F32" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: '$goldBg', color: '$primary', text: '🥇' };
    if (rank === 2) return { bg: '#E8E8E8', color: '#666', text: '🥈' };
    if (rank === 3) return { bg: '#F5DEB3', color: '#8B4513', text: '🥉' };
    return { bg: '$surface3', color: '$colorMuted', text: `#${rank}` };
  };

  const getRankChange = (player: LeaderboardPlayer) => {
    if (!player.previousRank) return null;
    const change = player.previousRank - player.rank;
    if (change === 0) return null;

    return {
      direction: change > 0 ? 'up' : 'down',
      value: Math.abs(change),
    };
  };

  if (variant === 'compact') {
    return (
      <Card variant="glass" padding="md">
        <YStack gap="$2">
          {players.slice(0, 5).map((player) => {
            const isCurrentUser = player.id === currentUserId;
            const rankBadge = getRankBadge(player.rank);

            return (
              <XStack
                key={player.id}
                padding="$3"
                backgroundColor={isCurrentUser ? '$goldBg' : '$surface2'}
                borderRadius="$4"
                alignItems="center"
                justifyContent="space-between"
                onPress={() => onPlayerPress?.(player.id)}
                cursor="pointer"
              >
                <XStack gap="$2" alignItems="center" flex={1}>
                  <Text
                    fontSize="$3"
                    fontWeight="900"
                    color={rankBadge.color}
                  >
                    {rankBadge.text}
                  </Text>
                  <Avatar name={player.name} size="sm" imageUrl={player.avatar} />
                  <Text
                    fontSize="$3"
                    fontWeight={isCurrentUser ? '700' : '500'}
                    color="$colorPrimary"
                  >
                    {player.name}
                  </Text>
                </XStack>

                <Text
                  fontSize="$4"
                  fontWeight="900"
                  color={player.profit >= 0 ? '$success' : '$danger'}
                >
                  {player.profit >= 0 ? '+' : ''}{player.profit}€
                </Text>
              </XStack>
            );
          })}
        </YStack>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="lg">
      <YStack gap="$4">
        {/* Header */}
        <XStack alignItems="center" gap="$2">
          <Trophy size={24} color="$primary" />
          <Text fontSize="$5" fontWeight="900" color="$colorPrimary">
            Classement
          </Text>
        </XStack>

        {/* Podium Top 3 */}
        <XStack gap="$3" justifyContent="center" paddingVertical="$3">
          {players.slice(0, 3).map((player, index) => {
            const positions = [1, 0, 2]; // 2nd, 1st, 3rd
            const actualPlayer = players[positions[index]];
            if (!actualPlayer) return null;

            const heights = [80, 100, 60];
            const height = heights[index];

            return (
              <YStack
                key={actualPlayer.id}
                gap="$2"
                alignItems="center"
                flex={1}
              >
                <View position="relative">
                  <Avatar
                    name={actualPlayer.name}
                    size={index === 1 ? 'lg' : 'md'}
                    imageUrl={actualPlayer.avatar}
                  />
                  {index < 3 && (
                    <View
                      position="absolute"
                      bottom={-8}
                      right={-8}
                      padding="$1"
                      backgroundColor="$background"
                      borderRadius="$round"
                    >
                      {getRankIcon(actualPlayer.rank)}
                    </View>
                  )}
                </View>

                <Text
                  fontSize="$3"
                  fontWeight="700"
                  color="$colorPrimary"
                  textAlign="center"
                >
                  {actualPlayer.name}
                </Text>

                <View
                  width="100%"
                  height={height}
                  backgroundColor={
                    index === 1 ? '$goldBg' : index === 0 ? '$surface3' : '$surface2'
                  }
                  borderTopLeftRadius="$4"
                  borderTopRightRadius="$4"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text
                    fontSize="$4"
                    fontWeight="900"
                    color={actualPlayer.profit >= 0 ? '$success' : '$danger'}
                  >
                    {actualPlayer.profit >= 0 ? '+' : ''}{actualPlayer.profit}€
                  </Text>
                </View>
              </YStack>
            );
          })}
        </XStack>

        {/* Rest of List */}
        {players.length > 3 && (
          <ScrollView maxHeight={400}>
            <YStack gap="$2">
              {players.slice(3).map((player) => {
                const isCurrentUser = player.id === currentUserId;
                const rankChange = getRankChange(player);

                return (
                  <XStack
                    key={player.id}
                    padding="$3"
                    backgroundColor={isCurrentUser ? '$goldBg' : '$surface2'}
                    borderRadius="$4"
                    borderWidth={isCurrentUser ? 2 : 0}
                    borderColor="$primary"
                    alignItems="center"
                    justifyContent="space-between"
                    onPress={() => onPlayerPress?.(player.id)}
                    cursor="pointer"
                  >
                    {/* Rank + Avatar + Name */}
                    <XStack gap="$3" alignItems="center" flex={1}>
                      <View
                        width={32}
                        height={32}
                        borderRadius="$4"
                        backgroundColor="$surface3"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="$3" fontWeight="900" color="$colorSecondary">
                          {player.rank}
                        </Text>
                      </View>

                      <Avatar
                        name={player.name}
                        size="sm"
                        imageUrl={player.avatar}
                      />

                      <YStack flex={1}>
                        <XStack gap="$2" alignItems="center">
                          <Text
                            fontSize="$3"
                            fontWeight={isCurrentUser ? '700' : '600'}
                            color="$colorPrimary"
                          >
                            {player.name}
                          </Text>
                          {isCurrentUser && (
                            <Badge variant="chip" size="sm">
                              Vous
                            </Badge>
                          )}
                        </XStack>

                        <XStack gap="$3">
                          <Text fontSize="$2" color="$colorMuted">
                            {player.gamesPlayed} parties
                          </Text>
                          <Text fontSize="$2" color="$colorMuted">
                            •
                          </Text>
                          <Text fontSize="$2" color="$colorMuted">
                            {player.winRate}% victoires
                          </Text>
                        </XStack>
                      </YStack>
                    </XStack>

                    {/* Profit + Rank Change */}
                    <YStack alignItems="flex-end" gap="$1">
                      <Text
                        fontSize="$4"
                        fontWeight="900"
                        color={player.profit >= 0 ? '$success' : '$danger'}
                      >
                        {player.profit >= 0 ? '+' : ''}{player.profit}€
                      </Text>

                      {rankChange && (
                        <XStack gap="$1" alignItems="center">
                          <TrendingUp
                            size={12}
                            color={rankChange.direction === 'up' ? '$success' : '$danger'}
                            style={{
                              transform: [
                                {
                                  rotate:
                                    rankChange.direction === 'down' ? '180deg' : '0deg',
                                },
                              ],
                            }}
                          />
                          <Text
                            fontSize="$2"
                            color={rankChange.direction === 'up' ? '$success' : '$danger'}
                          >
                            {rankChange.value}
                          </Text>
                        </XStack>
                      )}
                    </YStack>
                  </XStack>
                );
              })}
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// const players = [
//   { id: '1', name: 'Alice', profit: 1250, gamesPlayed: 45, winRate: 42, rank: 1 },
//   { id: '2', name: 'Bob', profit: 890, gamesPlayed: 38, winRate: 35, rank: 2 },
//   { id: '3', name: 'Charlie', profit: 650, gamesPlayed: 42, winRate: 28, rank: 3 },
// ];
//
// <LeaderboardList 
//   players={players}
//   currentUserId="1"
//   onPlayerPress={(id) => console.log(id)}
// />
//
// <LeaderboardList players={players} variant="compact" />
