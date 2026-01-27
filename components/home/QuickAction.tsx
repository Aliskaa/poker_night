import React from "react";
import { Button, Text, YStack } from "tamagui";

export function QuickAction({ icon, label, subLabel, onPress }: any) {
    return (
        <Button
            flex={1}
            height={110}
            // Fond semi-transparent pour laisser voir le tapis
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderColor="rgba(255, 255, 255, 0.1)"
            borderWidth={1}
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="space-between"
            padding="$4"
            onPress={onPress}
            pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
            <YStack backgroundColor="rgba(0,0,0,0.3)" padding="$2" borderRadius="$3">
                {React.cloneElement(icon, { color: '#fbbf24' })}
            </YStack>
            <YStack>
                <Text color="white" fontWeight="bold" fontSize="$5">{label}</Text>
                <Text color="rgba(255,255,255,0.5)" fontSize="$2">{subLabel}</Text>
            </YStack>
        </Button>
    );
}