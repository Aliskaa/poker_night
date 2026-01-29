import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import { useGroupLogic } from '@/hooks/useGroupLogic';
import { AlertTriangle, ChevronRight, Crown, Key, Plus, Users } from '@tamagui/lucide-icons';
import { Avatar, Button, Card, H1, H4, Input, Sheet, Spinner, Text, Theme, XStack, YStack } from 'tamagui';
import { PokerBackground } from '@/components/ui/PokerBackground';
import { FAB } from '@/components/ui/FAB';
import { PokerButton } from '@/components/ui';

export default function GroupsScreen() {
    const { user } = useUser();
    const router = useRouter();
    const { userGroups, createGroup, joinGroup, loading } = useGroupLogic();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState('');

    const handleCreateGroup = async () => {
        if (!newGroupName) return;
        await createGroup(newGroupName);
        setNewGroupName('');
        setIsCreateOpen(false);
    }

    const handleJoinGroup = async () => {
        if (!inviteCode) return;
        await joinGroup(inviteCode);
        setInviteCode('');
        setIsJoinOpen(false);
    }

    if (loading) return <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background"><Spinner size="large" color="$primary" /></YStack>;

    return (
        <Theme name="dark">
            <PokerBackground>
                <YStack flex={1} paddingTop="$10">

                    {/* EN-TÊTE */}
                    <YStack alignItems="center" marginBottom="$6">
                        <YStack backgroundColor="$goldBg" padding="$3" borderRadius="$10" marginBottom="$2" borderColor="$primary" borderWidth={1}>
                            <Users size={32} color="$primary" />
                        </YStack>
                        <H1 color="$text95" fontWeight="900" letterSpacing={-1}>Mes Clubs</H1>
                        <Text color="$text60" letterSpacing={1} textTransform="uppercase" fontSize="$2">
                            Gère tes QG de poker
                        </Text>
                    </YStack>

                    {/* ACTIONS */}
                    <XStack paddingHorizontal="$4" gap="$3" marginBottom="$6">
                        <PokerButton
                            flex={1}
                            variant='secondary'
                            fontsizeTitle='$4'
                            title="Rejoindre"
                            icon={<Key size={18} color="$primary" />}
                            onPress={() => setIsJoinOpen(true)}
                            pressStyle={{ backgroundColor: "$glass3" }}
                        />
                        <PokerButton
                            flex={1}
                            variant="primary"
                            title="Créer un Club"
                            icon={<Plus size={18} color="$backgroundStrong" />}
                            onPress={() => setIsCreateOpen(true)}
                            pressStyle={{ opacity: 0.9, scale: 0.98 }}
                        />
                    </XStack>

                    {/* LISTE DES GROUPES (Glass Cards) */}
                    <ScrollView style={{ flex: 1 }}>
                        <YStack padding="$4" gap="$3" paddingBottom="$10">
                            {userGroups.length === 0 ? (
                                <YStack alignItems="center" marginTop="$6" gap="$3" opacity={0.6}>
                                    <AlertTriangle size={32} color="white" />
                                    <Text color="white" fontWeight="bold">Tu n'as pas encore de Club.</Text>
                                </YStack>
                            ) : (
                                userGroups.map((group) => {
                                    const isOwner = group.ownerId === user?.id;
                                    return (
                                        <Card
                                            key={group.id}
                                            bordered
                                            backgroundColor="$glass2"
                                            borderColor={isOwner ? "$primary" : "$glass4"}
                                            borderWidth={1}
                                            pressStyle={{ backgroundColor: '$glass3', scale: 0.99 }}
                                            onPress={() => router.push(`/(main)/groups/${group.id}`)}
                                        >
                                            <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
                                                <Avatar circular size="$5" borderColor={isOwner ? "$primary" : "rgba(255,255,255,0.2)"} borderWidth={2}>
                                                    <Avatar.Fallback backgroundColor="rgba(0,0,0,0.3)" />
                                                    {/* Tu peux remettre Avatar.Image ici */}
                                                </Avatar>
                                                <YStack flex={1}>
                                                    <XStack alignItems="center" gap="$2">
                                                        <H4 color="white" fontWeight="bold">{group.name}</H4>
                                                        {isOwner && <Crown size={14} color="$primary" />}
                                                    </XStack>
                                                    <Text color="rgba(255,255,255,0.5)" fontSize="$2">{group.members.length} membres</Text>
                                                </YStack>
                                                <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
                                            </Card.Header>
                                        </Card>
                                    );
                                })
                            )}
                        </YStack>
                    </ScrollView>

                    {/* MODAL CREATION (Garde le style sheet par défaut ou adapte le background si besoin) */}
                    <Sheet modal open={isCreateOpen} onOpenChange={setIsCreateOpen} snapPoints={[40]} dismissOnSnapToBottom>
                        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
                        <Sheet.Handle />
                        <Sheet.Frame padding="$4" gap="$4" backgroundColor="$backgroundStrong">
                            <H4 color="$color" textAlign="center">Nouveau Club</H4>
                            <Input size="$5" placeholder="Nom du Club" value={newGroupName} onChangeText={setNewGroupName} backgroundColor="$background" borderColor="$borderColor" />
                            <Button size="$5" backgroundColor="$primary" color="$backgroundStrong" fontWeight="900" disabled={!newGroupName || loading} onPress={handleCreateGroup}>
                                {loading ? <Spinner color="$backgroundStrong" /> : 'Valider'}
                            </Button>
                        </Sheet.Frame>
                    </Sheet>

                    {/* MODAL REJOINDRE */}
                    <Sheet modal open={isJoinOpen} onOpenChange={setIsJoinOpen} snapPoints={[40]} dismissOnSnapToBottom>
                        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
                        <Sheet.Handle />
                        <Sheet.Frame padding="$4" gap="$4" backgroundColor="$backgroundStrong">
                            <H4 color="$color" textAlign="center">Rejoindre</H4>
                            <Input size="$5" placeholder="Code d'invitation" value={inviteCode} onChangeText={setInviteCode} backgroundColor="$background" borderColor="$borderColor" autoCapitalize="characters" />
                            <Button size="$5" backgroundColor="$accent" color="white" fontWeight="900" disabled={!inviteCode || loading} onPress={handleJoinGroup}>
                                {loading ? <Spinner color="white" /> : 'Rejoindre'}
                            </Button>
                        </Sheet.Frame>
                    </Sheet>

                </YStack>

                {/* FAB flottant pour créer une partie */}
                <FAB
                    icon={<Plus size={28} color="$night900" />}
                    fabPosition="bottom-right"
                    offset={70}
                    onPress={() => router.push('/(main)/create-game')}
                />
            </PokerBackground>
        </Theme>
    );
}