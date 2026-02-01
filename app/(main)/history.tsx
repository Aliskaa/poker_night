import { View } from 'react-native';
import { Text, Card, YStack, XStack, Separator, ScrollView } from 'tamagui';
import { useGameHistory } from '@/hooks/useGameHistory';
import { useEffect } from 'react';
import { Clock, Trophy, Users, TrendingUp, TrendingDown } from '@tamagui/lucide-icons';
import { GameHistorySummary } from '@/types/GameHistory';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GameHistoryCardProps {
    game: GameHistorySummary;
    onPress?: () => void;
}

function GameHistoryCard({ game, onPress }: GameHistoryCardProps) {
    const duration = game.duration 
        ? `${Math.floor(game.duration / 3600)}h ${Math.floor((game.duration % 3600) / 60)}min`
        : 'N/A';

    const timeAgo = game.finishedAt 
        ? formatDistanceToNow(game.finishedAt.toDate(), { addSuffix: true, locale: fr })
        : '';

    return (
        <Card
            elevate
            size="$4"
            bordered
            animation="bouncy"
            pressStyle={{ scale: 0.98 }}
            onPress={onPress}
            mb="$3"
            bg="$background"
        >
            <Card.Header padded>
                <XStack ai="center" jc="space-between">
                    <YStack f={1}>
                        <Text fontSize="$5" fontWeight="bold" color="$color">
                            {game.winnerName}
                        </Text>
                        <XStack ai="center" gap="$2" mt="$1">
                            <Clock size={14} color="$gray10" />
                            <Text fontSize="$2" color="$gray10">
                                {timeAgo}
                            </Text>
                        </XStack>
                    </YStack>
                    <Trophy size={24} color="$yellow10" />
                </XStack>
            </Card.Header>

            <Separator />

            <Card.Footer padded>
                <YStack gap="$2" w="100%">
                    <XStack jc="space-between">
                        <XStack ai="center" gap="$2">
                            <Users size={16} color="$gray11" />
                            <Text fontSize="$3" color="$gray11">
                                {game.playerCount} joueurs
                            </Text>
                        </XStack>
                        <XStack ai="center" gap="$2">
                            <Clock size={16} color="$gray11" />
                            <Text fontSize="$3" color="$gray11">
                                {duration}
                            </Text>
                        </XStack>
                    </XStack>

                    <XStack jc="space-between" mt="$2">
                        <Text fontSize="$3" color="$gray10">
                            Pot total
                        </Text>
                        <Text fontSize="$4" fontWeight="bold" color="$green10">
                            {game.totalPot} €
                        </Text>
                    </XStack>
                </YStack>
            </Card.Footer>
        </Card>
    );
}

export default function GameHistoryScreen() {
    const { history, loading, loadHistory, loadMore, hasMore } = useGameHistory();

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    if (loading && history.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Chargement de l'historique...</Text>
            </View>
        );
    }

    if (history.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Trophy size={64} color="$gray8" />
                <Text fontSize="$6" fontWeight="bold" color="$gray11" mt="$4">
                    Aucune partie terminée
                </Text>
                <Text fontSize="$3" color="$gray10" mt="$2" textAlign="center">
                    L'historique de vos parties apparaîtra ici
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            flex={1}
            p="$4"
            onScroll={(e) => {
                const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
                const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
                
                if (isCloseToBottom && hasMore && !loading) {
                    loadMore();
                }
            }}
            scrollEventThrottle={400}
        >
            <YStack gap="$3" pb="$6">
                <Text fontSize="$7" fontWeight="bold" color="$color" mb="$2">
                    Historique des parties
                </Text>

                {history.map((game) => (
                    <GameHistoryCard key={game.id} game={game} />
                ))}

                {loading && (
                    <Text textAlign="center" color="$gray10" py="$4">
                        Chargement...
                    </Text>
                )}

                {!hasMore && history.length > 0 && (
                    <Text textAlign="center" color="$gray10" py="$4">
                        Fin de l'historique
                    </Text>
                )}
            </YStack>
        </ScrollView>
    );
}
