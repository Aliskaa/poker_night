import React from 'react';
import { ScrollView } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Avatar, Button, Card, H3, Separator, Text, Theme, XStack, YStack } from 'tamagui';
import { LogOut, Settings, BookOpen, ShieldCheck, Calendar, Wallet, Trophy, TrendingUp } from '@tamagui/lucide-icons';
import { useUserLogic } from '@/hooks/useUserLogic';

export default function ProfileScreen() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const { currentUserStats } = useUserLogic();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    // Date de membre formatée
    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Récent';

    return (
        <Theme name="dark">
            <YStack flex={1} backgroundColor="$background">

                {/* 1. HEADER TYPE "PASSEPORT" (Fond différent) */}
                <YStack backgroundColor="$backgroundStrong" paddingHorizontal="$4" paddingTop="$10" paddingBottom="$6" borderBottomLeftRadius={30} borderBottomRightRadius={30} borderBottomWidth={1} borderColor="$borderColor">
                    <XStack alignItems="center" gap="$4">
                        <Avatar circular size="$10" borderWidth={4} borderColor="$potGold">
                            <Avatar.Image src={user?.imageUrl} />
                            <Avatar.Fallback backgroundColor="$accent" />
                        </Avatar>
                        <YStack flex={1}>
                            <H3 color="$color" fontWeight="900">{user?.fullName || user?.username}</H3>
                            <Text color="$colorMuted" fontSize="$3">{user?.primaryEmailAddress?.emailAddress}</Text>

                            <XStack alignItems="center" gap="$1.5" marginTop="$2" backgroundColor="rgba(255,255,255,0.05)" alignSelf="flex-start" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                                <Calendar size={12} color="$colorMuted" />
                                <Text color="$colorMuted" fontSize="$2">Membre depuis {memberSince}</Text>
                            </XStack>
                        </YStack>
                    </XStack>

                    {/* STATS PRINCIPALES EN BANDEAU */}
                    <XStack marginTop="$6" justifyContent="space-around" backgroundColor="$background" padding="$3" borderRadius="$6" borderColor="$borderColor" borderWidth={1}>
                        <StatItem label="Parties" value={String(currentUserStats.gamesPlayed)} />
                        <Separator vertical borderColor="$borderColor" height={30} />
                        <StatItem label="Victoires" value={String(currentUserStats.wins || 0)} color="$potGold" />
                        <Separator vertical borderColor="$borderColor" height={30} />
                        <StatItem label="ROI" value="N/A" />
                    </XStack>
                </YStack>

                <ScrollView>
                    <YStack padding="$4" gap="$5">

                        {/* 2. SECTION FINANCE (Bankroll détaillée) */}
                        <YStack gap="$3">
                            <Text color="$colorMuted" fontWeight="bold" fontSize="$2" textTransform="uppercase" letterSpacing={1}>Performance Financière</Text>

                            <XStack gap="$3">
                                {/* Profit Net (Gros bloc) */}
                                <Card flex={2} bordered backgroundColor={currentUserStats.netProfit >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"} borderColor={currentUserStats.netProfit >= 0 ? "$success" : "$danger"} padding="$3">
                                    <YStack>
                                        <XStack alignItems="center" gap="$2" marginBottom="$1">
                                            <Wallet size={16} color={currentUserStats.netProfit >= 0 ? "$success" : "$danger"} />
                                            <Text color={currentUserStats.netProfit >= 0 ? "$success" : "$danger"} fontWeight="bold">Profit Net</Text>
                                        </XStack>
                                        <Text color="$color" fontSize="$8" fontWeight="900">{currentUserStats.netProfit > 0 ? "+" : ""}{currentUserStats.netProfit}€</Text>
                                    </YStack>
                                </Card>
                            </XStack>

                            <XStack gap="$3">
                                <DetailCard label="Investi" value={`${currentUserStats.totalInvested}€`} icon={<TrendingUp size={14} />} />
                                <DetailCard label="Gagné" value={`${currentUserStats.totalWinnings}€`} icon={<Trophy size={14} />} />
                            </XStack>
                        </YStack>

                        <Separator borderColor="$borderColor" />

                        {/* 3. MENU LISTE */}
                        <YStack gap="$1">
                            <ListItem
                                icon={<BookOpen />}
                                title="Règles & Combinaisons"
                                subtitle="Mémo des mains de poker"
                                onPress={() => router.push('/(main)/hand-ranking')} // <-- AJOUT DU LIEN
                            />
                            <ListItem icon={<Settings />} title="Paramètres" onPress={() => { }} />
                            <ListItem icon={<ShieldCheck />} title="Confidentialité" onPress={() => { }} isLast />
                        </YStack>

                        {/* 4. LOGOUT */}
                        <Button
                            marginTop="$4"
                            backgroundColor="transparent"
                            onPress={handleSignOut}
                            icon={<LogOut size={18} color="$danger" />}
                        >
                            <Text color="$danger">Se déconnecter</Text>
                        </Button>

                    </YStack>
                </ScrollView>
            </YStack>
        </Theme>
    );
}

// --- SOUS-COMPOSANTS DE STYLE ---

const StatItem = ({ label, value, color = "$color" }: any) => (
    <YStack alignItems="center">
        <Text color="$colorMuted" fontSize="$2" fontWeight="600">{label}</Text>
        <Text color={color} fontSize="$5" fontWeight="900">{value}</Text>
    </YStack>
);

const DetailCard = ({ label, value, icon }: any) => (
    <Card flex={1} bordered backgroundColor="$backgroundStrong" borderColor="$borderColor" padding="$3">
        <XStack alignItems="center" gap="$2" marginBottom="$1">
            {React.cloneElement(icon, { color: '#9ca3af' })}
            <Text color="$colorMuted" fontSize="$2">{label}</Text>
        </XStack>
        <Text color="$color" fontSize="$5" fontWeight="bold">{value}</Text>
    </Card>
);

const ListItem = ({ icon, title, onPress, isLast }: any) => (
    <YStack>
        <XStack
            paddingVertical="$4"
            paddingHorizontal="$2"
            alignItems="center"
            justifyContent="space-between"
            onPress={onPress}
            pressStyle={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
            <XStack alignItems="center" gap="$3">
                {React.cloneElement(icon, { size: 20, color: '#fbbf24' })} {/* Icone Jaune */}
                <Text color="$color" fontSize="$4" fontWeight="600">{title}</Text>
            </XStack>
            {/* Petite flèche discrète */}
            <Text color="$colorMuted">›</Text>
        </XStack>
        {!isLast && <Separator borderColor="$borderColor" />}
    </YStack>
);