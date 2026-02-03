import { Body, Caption, Heading, Label } from '@/components/ui';
import { BankrollChart } from '@/components/ui/BankrollChart';
import { ChipStack } from '@/components/ui/ChipStack';
import { GlassCard } from '@/components/ui/GlassCard';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { PokerButton } from '@/components/ui/PokerButton';
import { StatCard } from '@/components/ui/StatCard';
import { useUserLogic } from '@/hooks/useUserLogic';
import { useAuthContext } from '@/providers/AuthProvider';
import { db } from '@/services/firebase';
import type { Game } from '@/types/Game';
import { calculatePlayerStats, formatPercentage, generateBankrollHistory, getROIEmoji } from '@/utils/statsHelpers';
import { BookOpen, Calendar, DollarSign, LogOut, Medal, Settings, ShieldCheck, Target, TrendingUp, Trophy } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Avatar, H3, ScrollView, Separator, Text, Theme, XStack, YStack } from 'tamagui';

export default function ProfileScreen() {
    const { signOut } = useAuthContext();
    const router = useRouter();
    const { currentUserStats, user } = useUserLogic();

    const [userGames, setUserGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    // Charger l'historique des parties
    useEffect(() => {
        const loadGames = async () => {
            if (!user?.id) return;

            try {
                const gamesRef = collection(db, 'games');
                const q = query(
                    gamesRef,
                    where('status', '==', 'FINISHED'),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);
                const games = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Game))
                    .filter(game => game.players.some(p => p.id === user.id));

                setUserGames(games);
            } catch (error) {
                console.error('Error loading games:', error);
            } finally {
                setLoading(false);
            }
        };

        loadGames();
    }, [user?.id]);

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    const stats = user ? calculatePlayerStats(currentUserStats as any) : null;
    const bankrollData = user ? generateBankrollHistory(userGames, user.id) : [];
    const memberSince = user?.createdAt && user.createdAt instanceof Timestamp ? user.createdAt.toDate().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Récent';

    return (
        <Theme name="dark">
            <PokerBackground>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
                    <YStack paddingTop="$8">

                        {/* 1. HEADER PASSEPORT */}
                        <YStack
                            paddingHorizontal="$4"
                            paddingTop="$10"
                            paddingBottom="$6"
                            borderBottomLeftRadius={30}
                            borderBottomRightRadius={30}
                            borderBottomWidth={1}
                            borderColor="$overlay3"
                            gap="$4"
                        >
                            <XStack alignItems="center" gap="$4">
                                <Avatar circular size="$10" borderWidth={4} borderColor="$primary">
                                    <Avatar.Image src={user?.avatarUrl || undefined} />
                                    <Avatar.Fallback backgroundColor="$glass4" />
                                </Avatar>
                                <YStack flex={1}>
                                    <H3 color="$text95" fontWeight="900">{user?.displayName || user?.email?.split('@')[0] || 'Joueur'}</H3>
                                    <Body color="$text60" fontSize="$3">{user?.email}</Body>

                                    <XStack
                                        alignItems="center"
                                        gap="$1.5"
                                        marginTop="$2"
                                        backgroundColor="$glass2"
                                        alignSelf="flex-start"
                                        paddingHorizontal="$2"
                                        paddingVertical="$1"
                                        borderRadius="$4"
                                    >
                                        <Calendar size={12} color="$text60" />
                                        <Caption color="$text60" fontSize="$2">Membre depuis {memberSince}</Caption>
                                    </XStack>
                                </YStack>
                            </XStack>

                            {/* STATS PERFORMANCE */}
                            <YStack gap="$3">
                                <Heading>Performance {getROIEmoji(stats?.roi || 0)}</Heading>

                                {/* Profit Net - Hero Card */}
                                <YStack
                                    padding="$5"
                                    backgroundColor={currentUserStats.netProfit >= 0 ? "$successBg" : "$dangerBg"}
                                    borderColor={currentUserStats.netProfit >= 0 ? "$success" : "$danger"}
                                    borderWidth={2}
                                    borderRadius="$6"
                                    gap="$2"
                                >
                                    <XStack alignItems="center" gap="$2">
                                        <Target size={20} color={currentUserStats.netProfit >= 0 ? "$success" : "$danger"} />
                                        <Label color={currentUserStats.netProfit >= 0 ? "$success" : "$danger"}>
                                            Profit Net
                                        </Label>
                                    </XStack>
                                    <ChipStack
                                        amount={currentUserStats.netProfit}
                                        variant={currentUserStats.netProfit >= 0 ? 'pot' : 'default'}
                                        size="lg"
                                    />
                                </YStack>

                                {/* KPIs Grid */}
                                <XStack gap="$3" flexWrap="wrap">
                                    <StatCard
                                        label="ROI"
                                        value={formatPercentage(stats?.roi || 0)}
                                        icon={<TrendingUp size={16} color="$primary" />}
                                        color={stats && stats.roi >= 0 ? '$success' : '$danger'}
                                        trend={stats && stats.roi > 0 ? 'up' : stats && stats.roi < 0 ? 'down' : 'stable'}
                                    />
                                    <StatCard
                                        label="Winrate"
                                        value={`${(stats?.winrate || 0).toFixed(1)}%`}
                                        icon={<Trophy size={16} color="$primary" />}
                                        color="$primary"
                                        subtitle={`${stats?.wins || 0}/${stats?.gamesPlayed || 0}`}
                                    />
                                </XStack>

                                <XStack gap="$3" flexWrap="wrap">
                                    <StatCard
                                        label="Investi"
                                        value={`${currentUserStats.totalInvested}€`}
                                        icon={<DollarSign size={16} color="$colorTertiary" />}
                                        color="$secondary"
                                    />
                                    <StatCard
                                        label="Gagné"
                                        value={`${currentUserStats.totalWinnings}€`}
                                        icon={<Trophy size={16} color="$primary" />}
                                        color="$primary"
                                    />
                                </XStack>

                                {/* Graphique bankroll */}
                                {!loading && bankrollData.length > 0 && (
                                    <BankrollChart data={bankrollData} height={180} />
                                )}

                                {/* Meilleur classement */}
                                {currentUserStats.bestRank < 9999 && (
                                    <YStack
                                        padding="$4"
                                        backgroundColor="$goldBg"
                                        borderColor="$primary"
                                        borderWidth={1}
                                        borderRadius="$5"
                                    >
                                        <XStack alignItems="center" gap="$2" justifyContent="space-between">
                                            <XStack alignItems="center" gap="$2">
                                                <Medal size={18} color="$primary" />
                                                <Text color="$text95" fontSize="$3" fontWeight="600">
                                                    Meilleur classement
                                                </Text>
                                            </XStack>
                                            <Text color="$primary" fontSize="$6" fontWeight="900">
                                                #{currentUserStats.bestRank}
                                            </Text>
                                        </XStack>
                                    </YStack>
                                )}
                            </YStack>

                            <Separator borderColor="$overlay3" />

                            {/* 3. MENU */}
                            <YStack gap="$3">
                                <Text color="$text60" fontWeight="bold" fontSize="$2" textTransform="uppercase" letterSpacing={1}>
                                    Paramètres
                                </Text>

                                <GlassCard
                                    icon={<BookOpen size={20} />}
                                    title="Règles & Combinaisons"
                                    subtitle="Mémo poker"
                                    onPress={() => router.push('/(main)/hand-ranking')}
                                />
                                <GlassCard
                                    icon={<Settings size={20} />}
                                    title="Paramètres"
                                    subtitle="Préférences"
                                    onPress={() => { }}
                                />
                                <GlassCard
                                    icon={<ShieldCheck size={20} />}
                                    title="Confidentialité"
                                    subtitle="Données & sécurité"
                                    onPress={() => { }}
                                />
                            </YStack>

                            <Separator borderColor="$overlay3" marginVertical="$2" />

                            <PokerButton
                                variant="danger"
                                icon={<LogOut size={20} />}
                                title="Se déconnecter"
                                onPress={handleSignOut}
                            />

                        </YStack>
                    </YStack>
                </ScrollView>
            </PokerBackground>
        </Theme>
    );
}