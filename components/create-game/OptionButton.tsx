import React from 'react';
import { Button, Text } from 'tamagui';

export function OptionButton({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) {
  return (
    <Button
      size="$4"
      flex={1}
      minWidth={80}
      height={56}
      backgroundColor={isSelected ? "$goldBg" : "$glass2"}
      borderColor={isSelected ? "$primary" : "$glass4"}
      borderWidth={isSelected ? 2 : 1}
      borderRadius="$6"
      pressStyle={{
        backgroundColor: isSelected ? "$goldBg" : "$glass4",
        scale: 0.97,
        borderColor: isSelected ? "$primary" : "$glass5",
      }}
      hoverStyle={{
        backgroundColor: isSelected ? "$goldBg" : "$glass3",
        borderColor: isSelected ? "$primary" : "$glass5",
      }}
      animation="quick"
      shadowColor={isSelected ? "$primary" : "transparent"}
      shadowOpacity={isSelected ? 0.3 : 0}
      shadowRadius={isSelected ? 10 : 0}
      // elevation={isSelected ? 4 : 0}
      onPress={onPress}
    >
      <Text
        color={isSelected ? "$primary" : "$text80"}
        fontWeight={"700"}
        fontSize={isSelected ? "$5" : "$4"}
      // letterSpacing={isSelected ? 0.5 : 0}
      >
        {label}
      </Text>
    </Button>
  );
}