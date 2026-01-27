import { PerformanceCard } from '@/components/profile/PerformanceCard';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileMenu } from '@/components/profile/ProfileMenu';
import { PokerBackground } from '@/components/layouts/PokerBackground';
import { useUserLogic } from '@/hooks/useUserLogic';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { Separator, Theme, YStack } from 'tamagui';

export default function ProfileScreen() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();
    const { currentUserStats } = useUserLogic();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/login');
    };

    return (
        <Theme name="dark">
            <PokerBackground>
                <YStack flex={1}>
                    <ProfileHeader user={user} stats={currentUserStats} />

                    <ScrollView>
                        <YStack padding="$4" gap="$5" paddingBottom="$10">
                            <PerformanceCard stats={currentUserStats} />
                            <Separator borderColor="$borderColor" />
                            <ProfileMenu onSignOut={handleSignOut} router={router} />

                        </YStack>
                    </ScrollView>
                </YStack>
            </PokerBackground>
        </Theme>
    );
}