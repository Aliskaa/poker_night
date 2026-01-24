import React from 'react';
import { Button, Text } from 'tamagui';

export function OptionButton({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) {
  return (
    <Button size="$3" flex={1} minWidth={70} backgroundColor={isSelected ? "$potGold" : "$backgroundStrong"} borderColor={isSelected ? "$potGold" : "$borderColor"} borderWidth={1} onPress={onPress}>
      <Text color={isSelected ? "$nightBase" : "$color"} fontWeight={isSelected ? "900" : "600"}>{label}</Text>
    </Button>
  );
}