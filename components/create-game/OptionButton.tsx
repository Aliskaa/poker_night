import React from 'react';
import { Button, Text } from 'tamagui';

export function OptionButton({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) {
  return (
    <Button
      size="$4"
      flex={1}
      minWidth={80}
      height={52}
      backgroundColor={isSelected ? "rgba(251, 191, 36, 0.15)" : "$glass3"}
      borderColor={isSelected ? "$primary" : "$glass5"}
      borderWidth={isSelected ? 2 : 1}
      borderRadius="$5"
      pressStyle={{
        backgroundColor: isSelected ? "rgba(251, 191, 36, 0.2)" : "$glass4",
        scale: 0.96,
        borderColor: isSelected ? "$gold500" : "$glass6",
      }}
      hoverStyle={{
        backgroundColor: isSelected ? "rgba(251, 191, 36, 0.18)" : "$glass4",
        borderColor: isSelected ? "$primary" : "$glass6",
      }}
      animation="quick"
      shadowColor={isSelected ? "$primary" : "$overlay4"}
      shadowOpacity={isSelected ? 0.4 : 0.1}
      shadowRadius={isSelected ? 8 : 4}
      elevation={isSelected ? 3 : 1}
      onPress={onPress}
    >
      <Text
        color={isSelected ? "$primary" : "$text80"}
        fontWeight="700"
        fontSize={isSelected ? "$5" : "$4"}
        letterSpacing={0.3}
      >
        {label}
      </Text>
    </Button>
  );
}