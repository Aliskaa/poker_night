import { PokerBackground } from '@/components/ui/PokerBackground';
import { useGameHistory } from '@/hooks/useGameHistory';
import { GameHistorySummary } from '@/types/GameHistory';
import { Clock, Trophy, Users } from '@tamagui/lucide-icons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Card, ScrollView, Separator, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

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
    const topPad = Platform.OS === 'web' ? '$3' : '$4';

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    if (loading && history.length === 0) {
        return (
            <Theme name="dark">
                <PokerBackground>
                    <YStack flex={1} justifyContent="center" alignItems="center" paddingTop={topPad}>
                        <Spinner size="large" color="$primary" />
                        <Text marginTop="$3" color="$text60">
                            Chargement de l&apos;historique...
                        </Text>
                    </YStack>
                </PokerBackground>
            </Theme>
        );
    }

    if (history.length === 0) {
        return (
            <Theme name="dark">
                <PokerBackground>
                    <YStack
                        flex={1}
                        justifyContent="center"
                        alignItems="center"
                        padding="$6"
                        paddingTop={topPad}
                    >
                        <Trophy size={64} color="$gray8" />
                        <Text fontSize="$6" fontWeight="bold" color="$gray11" marginTop="$4">
                            Aucune partie archivée
                        </Text>
                        <Text fontSize="$3" color="$gray10" marginTop="$2" textAlign="center">
                            Les parties terminées apparaissent ici après archivage (environ 1 h).
                        </Text>
                    </YStack>
                </PokerBackground>
            </Theme>
        );
    }

    return (
        <Theme name="dark">
            <PokerBackground>
                <ScrollView
                    flex={1}
                    paddingHorizontal="$4"
                    paddingTop={topPad}
                    paddingBottom="$8"
                    onScroll={(e) => {
                        const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
                        const isCloseToBottom =
                            layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

                        if (isCloseToBottom && hasMore && !loading) {
                            loadMore();
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    <YStack gap="$3" paddingBottom="$6">
                        {history.map((game) => (
                            <GameHistoryCard key={game.id} game={game} />
                        ))}

                        {loading && (
                            <Text textAlign="center" color="$gray10" paddingVertical="$4">
                                Chargement...
                            </Text>
                        )}

                        {!hasMore && history.length > 0 && (
                            <Text textAlign="center" color="$gray10" paddingVertical="$4">
                                Fin de l&apos;historique
                            </Text>
                        )}
                    </YStack>
                </ScrollView>
            </PokerBackground>
        </Theme>
    );
}
