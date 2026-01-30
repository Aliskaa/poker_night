import React from 'react';
import { Avatar, Text, XStack, YStack } from 'tamagui';
import { Crown } from '@tamagui/lucide-icons';
import { User } from '@/types/User';

export function MemberList({ members, ownerId, currentUserId }: { members: User[], ownerId: string, currentUserId?: string }) {
  return (
    <YStack gap="$3">
      <Text color="$colorMuted" fontWeight="bold" fontSize="$3" letterSpacing={1} textTransform="uppercase">
        Membres Officiels ({members.length})
      </Text>
      {members.map((member) => {
        const isGroupOwner = member.id === ownerId;
        const isMe = member.id === currentUserId;

        return (
          <XStack key={member.id} alignItems="center" gap="$3" backgroundColor="$backgroundStrong" padding="$3" borderRadius="$4" borderWidth={1} borderColor={isGroupOwner ? "$primary" : "$borderColor"}>
            <Avatar circular size="$6" borderColor="$primary" borderWidth={1}>
              <Avatar.Image src={member.avatarUrl} />
              <Avatar.Fallback backgroundColor="$accent" />
            </Avatar>
            <YStack flex={1}>
              <Text color="$color" fontWeight="bold" fontSize="$4">
                {member.displayName || "Joueur"} {isMe && "(Moi)"}
              </Text>
              {isGroupOwner ? (
                <XStack alignItems="center" gap="$1"><Crown size={12} color="$primary" /><Text color="$primary" fontSize="$2" fontWeight="bold">Créateur</Text></XStack>
              ) : (
                <Text color="$colorMuted" fontSize="$2">Membre</Text>
              )}
            </YStack>
          </XStack>
        );
      })}
    </YStack>
  );
}