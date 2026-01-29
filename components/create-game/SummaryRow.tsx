import { Text, XStack, YStack } from "tamagui";

export function SummaryRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      padding="$3"
      backgroundColor="$glass2"
      borderRadius="$4"
    >
      <XStack gap="$2" alignItems="center">
        <YStack
          backgroundColor="$overlay3"
          padding="$2"
          borderRadius="$3"
        >
          {icon}
        </YStack>
        <Text color="$text60" fontSize="$3">{label}</Text>
      </XStack>
      <Text color="$text95" fontSize="$4" fontWeight="700">{value}</Text>
    </XStack>
  );
}