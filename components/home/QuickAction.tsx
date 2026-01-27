import React from "react";
import { Button, Text, YStack } from "tamagui";

export function QuickAction({ icon, label, subLabel, onPress }: any) {
    return (
        <Button
            flex={1}
            height={110}
            backgroundColor="$glass2"
            borderColor="$borderColor"
            borderWidth={1}
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="space-between"
            padding="$4"
            onPress={onPress}
            pressStyle={{ backgroundColor: '$glass4' }}
            hoverStyle={{ backgroundColor: '$glass3' }}
            animation="quick"
        >
            <YStack backgroundColor="$overlay3" padding="$2" borderRadius="$3">
                {React.cloneElement(icon, { color: '$primary' })}
            </YStack>
            <YStack>
                <Text color="$colorPrimary" fontWeight="bold" fontSize="$5">{label}</Text>
                <Text color="$colorMuted" fontSize="$2">{subLabel}</Text>
            </YStack>
        </Button>
    );
}