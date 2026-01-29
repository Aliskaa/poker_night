import { ChipStack } from '@/components/ui/ChipStack';
import { GlassCard } from '@/components/ui/GlassCard';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { PokerButton } from '@/components/ui/PokerButton';
import { useUserLogic } from '@/hooks/useUserLogic';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { BookOpen, Calendar, LogOut, Medal, Settings, ShieldCheck, Target, TrendingUp, Trophy } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Avatar, H3, ScrollView, Separator, Text, Theme, XStack, YStack } from 'tamagui';

export default function ProfileScreen() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const { currentUserStats } = useUserLogic();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Récent';

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
                                    <Avatar.Image src={user?.imageUrl} />
                                    <Avatar.Fallback backgroundColor="$glass4" />
                                </Avatar>
                                <YStack flex={1}>
                                    <H3 color="$text95" fontWeight="900">{user?.fullName || user?.username}</H3>
                                    <Text color="$text60" fontSize="$3">{user?.primaryEmailAddress?.emailAddress}</Text>

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
                                        <Text color="$text60" fontSize="$2">Membre depuis {memberSince}</Text>
                                    </XStack>
                                </YStack>
                            </XStack>

                            {/* STATS *PERFORMANCE */}
                            <YStack gap="$3">
                                <Text color="$text60" fontWeight="bold" fontSize="$2" textTransform="uppercase" letterSpacing={1}>
                                    Performance
                                </Text>

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
                                        <Text
                                            color={currentUserStats.netProfit >= 0 ? "$success" : "$danger"}
                                            fontWeight="bold"
                                            fontSize="$3"
                                        >
                                            Profit Net
                                        </Text>
                                    </XStack>
                                    <ChipStack
                                        amount={currentUserStats.netProfit}
                                        variant={currentUserStats.netProfit >= 0 ? 'pot' : 'default'}
                                        size="lg"
                                    />
                                </YStack>

                                {/* Stats secondaires */}
                                <XStack gap="$3">
                                    <YStack
                                        flex={1}
                                        padding="$4"
                                        backgroundColor="$glass2"
                                        borderColor="$glass4"
                                        borderWidth={1}
                                        borderRadius="$5"
                                        gap="$2"
                                    >
                                        <XStack alignItems="center" gap="$2">
                                            <TrendingUp size={16} color="$text60" />
                                            <Text color="$text60" fontSize="$2">Investi</Text>
                                        </XStack>
                                        <ChipStack amount={currentUserStats.totalInvested} size="md" />
                                    </YStack>

                                    <YStack
                                        flex={1}
                                        padding="$4"
                                        backgroundColor="$glass2"
                                        borderColor="$glass4"
                                        borderWidth={1}
                                        borderRadius="$5"
                                        gap="$2"
                                    >
                                        <XStack alignItems="center" gap="$2">
                                            <Trophy size={16} color="$primary" />
                                            <Text color="$text60" fontSize="$2">Gagné</Text>
                                        </XStack>
                                        <ChipStack amount={currentUserStats.totalWinnings} size="md" variant="pot" />
                                    </YStack>
                                </XStack>

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