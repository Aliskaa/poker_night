import { View } from 'react-native';
import { Text, Card, YStack, XStack, ScrollView, Separator } from 'tamagui';
import { useUserStats } from '@/hooks/useUserStats';
import { useUser } from '@/providers/AuthProvider';
import { Trophy, TrendingUp, TrendingDown, Target, Flame } from '@tamagui/lucide-icons';

function StatCard({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = '$blue10' 
}: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
    icon: any;
    color?: string;
}) {
    return (
        <Card elevate size="$4" bordered bg="$background" f={1}>
            <Card.Header padded>
                <XStack ai="center" jc="space-between">
                    <YStack f={1}>
                        <Text fontSize="$2" color="$gray10" mb="$1">
                            {title}
                        </Text>
                        <Text fontSize="$7" fontWeight="bold" color="$color">
                            {value}
                        </Text>
                        {subtitle && (
                            <Text fontSize="$2" color="$gray11" mt="$1">
                                {subtitle}
                            </Text>
                        )}
                    </YStack>
                    <Icon size={32} color={color} />
                </XStack>
            </Card.Header>
        </Card>
    );
}

export default function StatsScreen() {
    const { user } = useUser();
    const { stats, loading } = useUserStats(user?.id);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Chargement des statistiques...</Text>
            </View>
        );
    }

    if (!stats) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Target size={64} color="$gray8" />
                <Text fontSize="$6" fontWeight="bold" color="$gray11" mt="$4">
                    Pas encore de stats
                </Text>
                <Text fontSize="$3" color="$gray10" mt="$2" textAlign="center">
                    Jouez votre première partie pour voir vos statistiques
                </Text>
            </View>
        );
    }

    const winRate = stats.totalGames > 0 
        ? ((stats.totalWins / stats.totalGames) * 100).toFixed(1)
        : '0.0';

    const avgProfit = stats.totalGames > 0
        ? (stats.totalNetProfit / stats.totalGames).toFixed(0)
        : '0';

    return (
        <ScrollView flex={1} p="$4">
            <YStack gap="$4" pb="$6">
                <Text fontSize="$8" fontWeight="bold" color="$color" mb="$2">
                    Mes Statistiques
                </Text>

                {/* Vue d'ensemble */}
                <YStack gap="$3">
                    <Text fontSize="$5" fontWeight="600" color="$gray12">
                        Vue d'ensemble
                    </Text>
                    
                    <XStack gap="$3">
                        <StatCard
                            title="Parties jouées"
                            value={stats.totalGames}
                            icon={Trophy}
                            color="$purple10"
                        />
                        <StatCard
                            title="Victoires"
                            value={stats.totalWins}
                            subtitle={`${winRate}% win rate`}
                            icon={Trophy}
                            color="$yellow10"
                        />
                    </XStack>

                    <Card elevate size="$4" bordered bg="$background">
                        <Card.Header padded>
                            <XStack ai="center" jc="space-between">
                                <YStack f={1}>
                                    <Text fontSize="$2" color="$gray10" mb="$1">
                                        Profit net total
                                    </Text>
                                    <Text 
                                        fontSize="$9" 
                                        fontWeight="bold" 
                                        color={stats.totalNetProfit >= 0 ? '$green10' : '$red10'}
                                    >
                                        {stats.totalNetProfit >= 0 ? '+' : ''}{stats.totalNetProfit} €
                                    </Text>
                                    <Text fontSize="$3" color="$gray11" mt="$1">
                                        Moyenne: {avgProfit} €/partie
                                    </Text>
                                </YStack>
                                {stats.totalNetProfit >= 0 ? (
                                    <TrendingUp size={48} color="$green10" />
                                ) : (
                                    <TrendingDown size={48} color="$red10" />
                                )}
                            </XStack>
                        </Card.Header>
                    </Card>
                </YStack>

                <Separator />

                {/* Records */}
                <YStack gap="$3">
                    <Text fontSize="$5" fontWeight="600" color="$gray12">
                        Records
                    </Text>

                    <XStack gap="$3">
                        <StatCard
                            title="Plus gros gain"
                            value={`+${stats.biggestWin} €`}
                            icon={TrendingUp}
                            color="$green10"
                        />
                        <StatCard
                            title="Plus grosse perte"
                            value={`${stats.biggestLoss} €`}
                            icon={TrendingDown}
                            color="$red10"
                        />
                    </XStack>

                    <XStack gap="$3">
                        <StatCard
                            title="Série actuelle"
                            value={stats.currentWinStreak}
                            subtitle="victoires"
                            icon={Flame}
                            color="$orange10"
                        />
                        <StatCard
                            title="Meilleure série"
                            value={stats.longestWinStreak}
                            subtitle="victoires"
                            icon={Flame}
                            color="$yellow10"
                        />
                    </XStack>
                </YStack>

                <Separator />

                {/* 30 derniers jours */}
                <YStack gap="$3">
                    <Text fontSize="$5" fontWeight="600" color="$gray12">
                        30 derniers jours
                    </Text>

                    <XStack gap="$3">
                        <StatCard
                            title="Parties"
                            value={stats.last30Days.games}
                            icon={Trophy}
                            color="$blue10"
                        />
                        <StatCard
                            title="Victoires"
                            value={stats.last30Days.wins}
                            icon={Trophy}
                            color="$green10"
                        />
                    </XStack>

                    <Card elevate size="$4" bordered bg="$background">
                        <Card.Header padded>
                            <XStack ai="center" jc="space-between">
                                <YStack>
                                    <Text fontSize="$2" color="$gray10" mb="$1">
                                        Profit net (30j)
                                    </Text>
                                    <Text 
                                        fontSize="$7" 
                                        fontWeight="bold" 
                                        color={stats.last30Days.netProfit >= 0 ? '$green10' : '$red10'}
                                    >
                                        {stats.last30Days.netProfit >= 0 ? '+' : ''}{stats.last30Days.netProfit} €
                                    </Text>
                                </YStack>
                                {stats.last30Days.netProfit >= 0 ? (
                                    <TrendingUp size={32} color="$green10" />
                                ) : (
                                    <TrendingDown size={32} color="$red10" />
                                )}
                            </XStack>
                        </Card.Header>
                    </Card>
                </YStack>
            </YStack>
        </ScrollView>
    );
}
