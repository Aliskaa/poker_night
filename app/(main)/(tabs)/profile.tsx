import React from 'react';
import { ScrollView } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Avatar, Button, Card, H3, Separator, Text, Theme, XStack, YStack } from 'tamagui';
import { LogOut, Settings, BookOpen, ShieldCheck, Calendar, Wallet, Trophy, TrendingUp } from '@tamagui/lucide-icons';
import { useUserLogic } from '@/hooks/useUserLogic';
import { PokerBackground } from '@/components/ui/PokerBackground';

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
                <YStack flex={1}>
                    {/* 1. HEADER PASSEPORT TRANSPARENT */}
                    <YStack
                        backgroundColor="rgba(0,0,0,0.6)" // Fond sombre semi-transparent
                        paddingHorizontal="$4" paddingTop="$10" paddingBottom="$6"
                        borderBottomLeftRadius={30} borderBottomRightRadius={30}
                        borderBottomWidth={1} borderColor="rgba(255,255,255,0.1)"
                    >
                        <XStack alignItems="center" gap="$4">
                            <Avatar circular size="$10" borderWidth={4} borderColor="$primary">
                                <Avatar.Image src={user?.imageUrl} />
                                <Avatar.Fallback backgroundColor="$accent" />
                            </Avatar>
                            <YStack flex={1}>
                                <H3 color="white" fontWeight="900">{user?.fullName || user?.username}</H3>
                                <Text color="rgba(255,255,255,0.7)" fontSize="$3">{user?.primaryEmailAddress?.emailAddress}</Text>

                                <XStack alignItems="center" gap="$1.5" marginTop="$2" backgroundColor="rgba(255,255,255,0.1)" alignSelf="flex-start" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                                    <Calendar size={12} color="rgba(255,255,255,0.7)" />
                                    <Text color="rgba(255,255,255,0.7)" fontSize="$2">Membre depuis {memberSince}</Text>
                                </XStack>
                            </YStack>
                        </XStack>

                        {/* STATS */}
                        <XStack marginTop="$6" justifyContent="space-around" backgroundColor="rgba(255,255,255,0.05)" padding="$3" borderRadius="$6" borderColor="rgba(255,255,255,0.1)" borderWidth={1}>
                            <StatItem label="Parties" value={String(currentUserStats.gamesPlayed)} />
                            <Separator vertical borderColor="rgba(255,255,255,0.1)" height={30} />
                            <StatItem label="Victoires" value={String(currentUserStats.wins || 0)} color="$primary" />
                            <Separator vertical borderColor="rgba(255,255,255,0.1)" height={30} />
                            <StatItem label="ROI" value="N/A" />
                        </XStack>
                    </YStack>

                    <ScrollView>
                        <YStack padding="$4" gap="$5" paddingBottom="$10">

                            {/* 2. FINANCE */}
                            <YStack gap="$3">
                                <Text color="rgba(255,255,255,0.5)" fontWeight="bold" fontSize="$2" textTransform="uppercase" letterSpacing={1}>Performance</Text>
                                <Card flex={2} bordered backgroundColor="rgba(0,0,0,0.3)" borderColor={currentUserStats.netProfit >= 0 ? "$success" : "$danger"} padding="$3">
                                    <YStack>
                                        <XStack alignItems="center" gap="$2" marginBottom="$1">
                                            <Wallet size={16} color={currentUserStats.netProfit >= 0 ? "$success" : "$danger"} />
                                            <Text color={currentUserStats.netProfit >= 0 ? "$success" : "$danger"} fontWeight="bold">Profit Net</Text>
                                        </XStack>
                                        <Text color="white" fontSize="$8" fontWeight="900">{currentUserStats.netProfit > 0 ? "+" : ""}{currentUserStats.netProfit}€</Text>
                                    </YStack>
                                </Card>
                                <XStack gap="$3">
                                    <DetailCard label="Investi" value={`${currentUserStats.totalInvested}€`} icon={<TrendingUp size={14} />} />
                                    <DetailCard label="Gagné" value={`${currentUserStats.totalWinnings}€`} icon={<Trophy size={14} />} />
                                </XStack>
                            </YStack>

                            <Separator borderColor="rgba(255,255,255,0.1)" />

                            {/* 3. MENU */}
                            <YStack gap="$1">
                                <ListItem icon={<BookOpen />} title="Règles & Combinaisons" subtitle="Mémo" onPress={() => router.push('/(main)/hand-ranking')} />
                                <ListItem icon={<Settings />} title="Paramètres" onPress={() => { }} />
                                <ListItem icon={<ShieldCheck />} title="Confidentialité" onPress={() => { }} isLast />
                            </YStack>

                            <Button marginTop="$4" backgroundColor="transparent" onPress={handleSignOut} icon={<LogOut size={18} color="$danger" />}>
                                <Text color="$danger">Se déconnecter</Text>
                            </Button>

                        </YStack>
                    </ScrollView>
                </YStack>
            </PokerBackground>
        </Theme>
    );
}

const StatItem = ({ label, value, color = "white" }: any) => (
    <YStack alignItems="center">
        <Text color="rgba(255,255,255,0.5)" fontSize="$2" fontWeight="600">{label}</Text>
        <Text color={color} fontSize="$5" fontWeight="900">{value}</Text>
    </YStack>
);

const DetailCard = ({ label, value, icon }: any) => (
    <Card flex={1} bordered backgroundColor="rgba(255,255,255,0.05)" borderColor="rgba(255,255,255,0.1)" padding="$3">
        <XStack alignItems="center" gap="$2" marginBottom="$1">
            {React.cloneElement(icon, { color: '#9ca3af' })}
            <Text color="rgba(255,255,255,0.5)" fontSize="$2">{label}</Text>
        </XStack>
        <Text color="white" fontSize="$5" fontWeight="bold">{value}</Text>
    </Card>
);

const ListItem = ({ icon, title, onPress, isLast }: any) => (
    <YStack>
        <XStack paddingVertical="$4" paddingHorizontal="$2" alignItems="center" justifyContent="space-between" onPress={onPress} pressStyle={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <XStack alignItems="center" gap="$3">
                {React.cloneElement(icon, { size: 20, color: '#fbbf24' })}
                <Text color="white" fontSize="$4" fontWeight="600">{title}</Text>
            </XStack>
            <Text color="rgba(255,255,255,0.3)">›</Text>
        </XStack>
        {!isLast && <Separator borderColor="rgba(255,255,255,0.1)" />}
    </YStack>
);