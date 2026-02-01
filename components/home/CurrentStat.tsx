import { UserStatistics } from "@/types/User";
import { Target, Trophy } from "@tamagui/lucide-icons";
import { Text, XStack, YStack } from "tamagui";
import { ChipStack, Heading } from "../ui";

export function CurrentStat({ currentUserStats }: { currentUserStats: UserStatistics }) {
    return (
        <YStack gap="$3">
            <Heading size="md">Tes Stats</Heading>
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
                        <Trophy size={16} color="$success" />
                        <Text color="$text60" fontSize="$2">Parties</Text>
                    </XStack>
                    <Text color="$text95" fontSize="$7" fontWeight="900">
                        {currentUserStats.gamesPlayed || 0}
                    </Text>
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
                        <Target size={16} color="$primary" />
                        <Text color="$text60" fontSize="$2">Profit</Text>
                    </XStack>
                    <ChipStack
                        amount={currentUserStats.netProfit || 0}
                        variant={currentUserStats.netProfit >= 0 ? 'pot' : 'default'}
                        size="md"
                    />
                </YStack>
            </XStack>
        </YStack>
    )
}