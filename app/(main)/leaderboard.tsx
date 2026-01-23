import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, H1, H4, Card, Avatar, Spinner, Theme, Separator } from 'tamagui';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus } from '@tamagui/lucide-icons';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { db } from '@/services/firebase';

type LeaderboardUser = {
  id: string;
  name: string;
  avatarUrl?: string;
  netProfit: number;
  gamesPlayed: number;
  rank: number;
};

export default function LeaderboardScreen() {
  const { user: currentUser } = useUser();
  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.statistics) {
            usersData.push({
              id: doc.id,
              name: data.firstName || data.username || "Joueur Inconnu",
              avatarUrl: data.imageUrl || data.avatarUrl,
              netProfit: data.statistics.netProfit || 0,
              gamesPlayed: data.statistics.gamesPlayed || 0,
            });
          }
        });

        const sortedUsers = usersData.sort((a, b) => b.netProfit - a.netProfit);
        const rankedUsers = sortedUsers.map((u, index) => ({ ...u, rank: index + 1 }));
        setPlayers(rankedUsers);
      } catch (error) {
        console.error("Erreur de récupération du classement", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$potGold" />
      </YStack>
    );
  }

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$10">
        
        {/* EN-TÊTE VIP */}
        <YStack alignItems="center" marginBottom="$4">
          <Trophy size={56} color="$potGold" />
          <H1 color="$color" marginTop="$2" fontWeight="900" letterSpacing={-1}>Hall of Fame</H1>
          <Text color="$colorMuted" letterSpacing={1} textTransform="uppercase" fontSize="$3">
            Classement Général
          </Text>
        </YStack>

        <ScrollView style={{ flex: 1 }}>
          <YStack padding="$4" gap="$3">
            {players.map((player) => {
              const isFirst = player.rank === 1;
              const isSecond = player.rank === 2;
              const isThird = player.rank === 3;
              const isMe = player.id === currentUser?.id;

              // Définition des couleurs métalliques
              const rankColor = isFirst ? "$potGold" : isSecond ? "#9ca3b8" : isThird ? "#b45309" : "$colorMuted";
              const profitColor = player.netProfit > 0 ? "$success" : player.netProfit < 0 ? "$danger" : "$colorMuted";

              return (
                <Card 
                  key={player.id} 
                  bordered 
                  backgroundColor={isFirst ? "rgba(251, 191, 36, 0.05)" : "$backgroundStrong"}
                  borderColor={isMe ? "$accent" : isFirst ? "$potGold" : isSecond ? "#9ca3b8" : isThird ? "#b45309" : "$borderColor"}
                  borderWidth={isMe ? 2 : 1} 
                >
                  <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                    
                    <XStack gap="$3" alignItems="center" flex={1}>
                      {/* Icône de Rang */}
                      {isFirst ? <Trophy size={24} color={rankColor} /> : 
                       isSecond ? <Medal size={24} color={rankColor} /> : 
                       isThird ? <Medal size={24} color={rankColor} /> : 
                       <Text color="$colorMuted" fontSize="$5" fontWeight="900" width={24} textAlign="center">#{player.rank}</Text>}

                      <Avatar circular size="$4" borderColor={rankColor} borderWidth={isFirst ? 2 : 1}>
                        <Avatar.Image src={player.avatarUrl} />
                        <Avatar.Fallback backgroundColor="$background" />
                      </Avatar>

                      <YStack flex={1}>
                        <H4 color="$color" fontWeight={isMe ? "900" : "700"} numberOfLines={1}>
                          {player.name} {isMe && "(Moi)"}
                        </H4>
                        <Text color="$colorMuted" fontSize="$2">{player.gamesPlayed} partie{player.gamesPlayed > 1 ? "s" : ""} jouée{player.gamesPlayed > 1 ? "s" : ""}</Text>
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
    </Theme>
  );
}