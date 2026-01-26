import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import { useGroupLogic } from '@/hooks/useGroupLogic';
import { AlertTriangle, ChevronRight, Crown, Key, Plus, Users } from '@tamagui/lucide-icons';
import { Avatar, Button, Card, H1, H4, Input, Separator, Sheet, Spinner, Text, Theme, XStack, YStack } from 'tamagui';

export default function GroupsScreen() {
    const { user } = useUser();
    const router = useRouter();

    const { userGroups, createGroup, joinGroup, loading } = useGroupLogic();

    // États pour les Modals (Sheets)
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
                <YStack alignItems="center" marginBottom="$6">
                    <YStack backgroundColor="rgba(59, 130, 246, 0.1)" padding="$3" borderRadius="$5" marginBottom="$2">
                        <Users size={40} color="$accent" />
                    </YStack>
                    <H1 color="$color" fontWeight="900" letterSpacing={-1}>Mes Clubs</H1>
                    <Text color="$colorMuted" letterSpacing={1} textTransform="uppercase" fontSize="$2">
                        Gère tes QG de poker
                    </Text>
                </YStack>

                {/* BOUTONS D'ACTION (CRÉER / REJOINDRE) */}
                <XStack paddingHorizontal="$4" gap="$3" marginBottom="$4">
                    <Button
                        flex={1}
                        size="$4"
                        backgroundColor="$backgroundStrong"
                        borderColor="$borderColor"
                        borderWidth={1}
                        icon={<Key size={18} color="$potGold" />}
                        onPress={() => setIsJoinOpen(true)}
                    >
                        <Text color="$color" fontWeight="bold">Rejoindre</Text>
                    </Button>
                    <Button
                        flex={1}
                        size="$4"
                        backgroundColor="$potGold"
                        icon={<Plus size={18} color="$nightBase" />}
                        onPress={() => setIsCreateOpen(true)}
                    >
                        <Text color="$nightBase" fontWeight="900">Créer un Club</Text>
                    </Button>
                </XStack>

                <Separator borderColor="$borderColor" marginVertical="$2" />

                {/* LISTE DES GROUPES */}
                <ScrollView style={{ flex: 1 }}>
                    <YStack padding="$4" gap="$3">
                        {userGroups.length === 0 ? (
                            <YStack alignItems="center" marginTop="$6" gap="$3">
                                <AlertTriangle size={32} color="$colorMuted" />
                                <Text color="$colorMuted" fontWeight="bold">Tu n'as pas encore de Club.</Text>
                                <Text color="$colorMuted" fontSize="$2">Crée le tien ou rejoins celui de tes potes !</Text>
                            </YStack>
                        ) : (
                            userGroups.map((group) => {
                                const isOwner = group.ownerId === user?.id;

                                return (
                                    <Card
                                        key={group.id}
                                        bordered
                                        backgroundColor="$backgroundStrong"
                                        borderColor={isOwner ? "$potGold" : "$borderColor"}
                                        pressStyle={{ backgroundColor: '$backgroundHover', scale: 0.98 }}
                                        // Clic temporaire vers console.log avant de créer la page détail
                                        onPress={() => router.push(`/(main)/groups/${group.id}`)}
                                    >
                                        <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
                                            <Avatar circular size="$5" borderColor={isOwner ? "$potGold" : "$borderColor"} borderWidth={2}>
                                                <Avatar.Fallback backgroundColor="$background" />
                                            </Avatar>
                                            <YStack flex={1}>
                                                <XStack alignItems="center" gap="$2">
                                                    <H4 color="$color" fontWeight="bold">{group.name}</H4>
                                                    {isOwner && <Crown size={14} color="$potGold" />}
                                                </XStack>
                                                <XStack alignItems="center" gap="$1" marginTop="$1">
                                                    <Users size={12} color="$colorMuted" />
                                                    <Text color="$colorMuted" fontSize="$2">{group.members.length} membres inscrits</Text>
                                                </XStack>
                                            </YStack>
                                            <ChevronRight size={20} color="$colorMuted" />
                                        </Card.Header>
                                    </Card>
                                );
                            })
                        )}
                    </YStack>
                </ScrollView>

                {/* MODAL : CRÉER UN GROUPE */}
                <Sheet modal open={isCreateOpen} onOpenChange={setIsCreateOpen} snapPoints={[40]} dismissOnSnapToBottom>
                    <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
                    <Sheet.Handle />
                    <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
                        <H4 color="$color" textAlign="center">Nouveau Club</H4>
                        <Input
                            size="$5"
                            placeholder="Nom du Club (ex: Poker Vendredi)"
                            value={newGroupName}
                            onChangeText={setNewGroupName}
                            backgroundColor="$backgroundStrong"
                            borderColor="$borderColor"
                            color="$color"
                        />
                        <Button size="$5" backgroundColor="$potGold" color="$nightBase" fontWeight="900" disabled={!newGroupName || loading} onPress={handleCreateGroup}>
                            {loading ? <Spinner color="$nightBase" /> : 'Valider'}
                        </Button>
                    </Sheet.Frame>
                </Sheet>

                {/* MODAL : REJOINDRE UN GROUPE */}
                <Sheet modal open={isJoinOpen} onOpenChange={setIsJoinOpen} snapPoints={[40]} dismissOnSnapToBottom>
                    <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
                    <Sheet.Handle />
                    <Sheet.Frame padding="$4" gap="$4" backgroundColor="$background">
                        <H4 color="$color" textAlign="center">Rejoindre un Club</H4>
                        <Input
                            size="$5"
                            placeholder="Code d'invitation (ex: POK-A8F2)"
                            value={inviteCode}
                            onChangeText={setInviteCode}
                            backgroundColor="$backgroundStrong"
                            borderColor="$borderColor"
                            color="$color"
                            autoCapitalize="characters"
                        />
                        <Button size="$5" backgroundColor="$accent" color="white" fontWeight="900" disabled={!inviteCode || loading} onPress={handleJoinGroup}>
                            {loading ? <Spinner color="white" /> : 'Rejoindre'}
                        </Button>
                    </Sheet.Frame>
                </Sheet>

            </YStack>
        </Theme>
    );
}