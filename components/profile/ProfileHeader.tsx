import React from 'react';
import { Avatar, H3, Separator, Text, XStack, YStack } from 'tamagui';
import { Calendar } from '@tamagui/lucide-icons';
import { StatItem } from './StatItem';

interface ProfileHeaderProps {
  user: any;
  stats: {
    gamesPlayed: number;
    wins: number;
  };
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) 
    : 'Récent';

  return (
    <YStack
      backgroundColor="$overlayDark"
      paddingHorizontal="$4"
      paddingTop="$10"
      paddingBottom="$6"
      borderBottomLeftRadius={30}
      borderBottomRightRadius={30}
      borderBottomWidth={1}
      borderColor="$borderColor"
    >
      <XStack alignItems="center" gap="$4">
        <Avatar circular size="$10" borderWidth={4} borderColor="$primary">
          <Avatar.Image src={user?.imageUrl} />
          <Avatar.Fallback backgroundColor="$accent" />
        </Avatar>

        <YStack flex={1}>
          <H3 color="$color" fontWeight="900">
            {user?.fullName || user?.username}
          </H3>
          <Text color="$textSecondary" fontSize="$3">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>

          <XStack
            alignItems="center"
            gap="$1.5"
            marginTop="$2"
            backgroundColor="$glassMedium"
            alignSelf="flex-start"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$4"
          >
            <Calendar size="$xs" color="$textSecondary" />
            <Text color="$textSecondary" fontSize="$2">
              Membre depuis {memberSince}
            </Text>
          </XStack>
        </YStack>
      </XStack>

      {/* STATS */}
      <XStack
        marginTop="$6"
        justifyContent="space-around"
        backgroundColor="$glass"
        padding="$3"
        borderRadius="$6"
        borderColor="$borderColor"
        borderWidth={1}
      >
        <StatItem label="Parties" value={String(stats.gamesPlayed)} />
        <Separator vertical borderColor="$borderColor" height={30} />
        <StatItem label="Victoires" value={String(stats.wins || 0)} color="$primary" />
        <Separator vertical borderColor="$borderColor" height={30} />
        <StatItem label="ROI" value="N/A" />
      </XStack>
    </YStack>
  );
}
