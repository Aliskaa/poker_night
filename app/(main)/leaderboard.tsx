import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, H2, H4, Card, Avatar, Spinner, Theme } from 'tamagui';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus } from '@tamagui/lucide-icons';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import { db } from '@/services/firebase';

// Type pour typer nos données
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
              avatarUrl: data.avatarUrl,
              netProfit: data.statistics.netProfit || 0,
              gamesPlayed: data.statistics.gamesPlayed || 0,
            });
          }
        });

        // Tri par Profit Net (Décroissant : le plus riche en premier)
        const sortedUsers = usersData.sort((a, b) => b.netProfit - a.netProfit);

        // Attribution du rang (1, 2, 3...)
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
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  return (
    <Theme name="dark">
      <YStack flex={1} backgroundColor="$background" paddingTop="$4">
        
        {/* EN-TÊTE DU CLASSEMENT */}
        <YStack alignItems="center" marginBottom="$4">
          <Trophy size={48} color="#fbbf24" />
          <H2 color="$color" marginTop="$2">Hall of Fame</H2>
          <Text color="$gray11">Classement par Profit Net</Text>
        </YStack>

        <ScrollView style={{ flex: 1 }}>
          <YStack padding="$4" space="$3">
            {players.map((player) => {
              // Définition du style selon le rang (Podium)
              const isFirst = player.rank === 1;
              const isSecond = player.rank === 2;
              const isThird = player.rank === 3;
              const isMe = player.id === currentUser?.id;

              // Couleur du texte pour l'argent (Vert si > 0, Rouge si < 0)
              const profitColor = player.netProfit > 0 ? "$green10" : player.netProfit < 0 ? "$red10" : "$gray11";

              return (
                <Card 
                  key={player.id} 
                  bordered 
                  backgroundColor={isFirst ? "$yellow3" : isSecond ? "$gray4" : isThird ? "$orange3" : "$backgroundStrong"}
                  borderColor={isMe ? "$blue10" : (isFirst ? "$yellow8" : isSecond ? "$gray8" : isThird ? "$orange8" : "$borderColor")}
                  borderWidth={isMe ? 2 : 1} // Mise en évidence de mon propre profil
                >
                  <Card.Header padded flexDirection="row" justifyContent="space-between" alignItems="center">
                    
                    {/* Partie Gauche : Rang + Avatar + Nom */}
                    <XStack space="$3" alignItems="center" flex={1}>
                      {/* Icône de Rang */}
                      {isFirst ? <Trophy size={24} color="#fbbf24" /> : 
                       isSecond ? <Medal size={24} color="#9ca3af" /> : 
                       isThird ? <Medal size={24} color="#d97706" /> : 
                       <Text color="$gray11" fontSize="$5" fontWeight="bold" width={24} textAlign="center">#{player.rank}</Text>}

                      <Avatar circular size="$4">
                        <Avatar.Image src={player.avatarUrl} />
                        <Avatar.Fallback backgroundColor="$gray8" />
                      </Avatar>

                      <YStack flex={1}>
                        <H4 color="$color" numberOfLines={1}>{player.name} {isMe && "(Moi)"}</H4>
                        <Text color="$gray11" fontSize="$2">{player.gamesPlayed} parties</Text>
                      </YStack>
                    </XStack>

                    {/* Partie Droite : Les Sous */}
                    <YStack alignItems="flex-end">
                      <XStack alignItems="center" space="$1">
                        {player.netProfit > 0 ? <TrendingUp size={16} color="#4ade80" /> : 
                         player.netProfit < 0 ? <TrendingDown size={16} color="#ef4444" /> : 
                         <Minus size={16} color="gray" />}
                        <Text color={profitColor} fontWeight="900" fontSize="$6">
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