import React from 'react';
import { Avatar, Card, Checkbox, Text, YStack } from 'tamagui';
import { Check, Ghost } from '@tamagui/lucide-icons';

type SelectionCardProps = {
  isSelected: boolean;
  isDisabled?: boolean;
  name: string;
  avatarUrl?: string;
  isGhost?: boolean;
  subtitle?: string;
  onToggle: () => void;
};

export function SelectionCard({ isSelected, isDisabled, name, avatarUrl, isGhost, subtitle, onToggle }: SelectionCardProps) {
  return (
    <Card 
      bordered 
      backgroundColor={isSelected ? "rgba(16, 185, 129, 0.2)" : "$glass2"}
      borderColor={isSelected ? "$success" : "$glass4"}
      borderWidth={isSelected ? 2 : 1}
      pressStyle={{ scale: 0.98, backgroundColor: isSelected ? "rgba(16, 185, 129, 0.25)" : "$glass3" }} 
      onPress={onToggle}
    >
      <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
        <Checkbox size="$10" checked={isSelected} backgroundColor={isSelected ? "$success" : "$glass4"} borderColor={isSelected ? "$success" : "$glass5"} disabled={isDisabled}>
          <Checkbox.Indicator><Check color="$night900" strokeWidth={3} /></Checkbox.Indicator>
        </Checkbox>
        
        {isGhost ? (
          <Ghost size="$9" color={isSelected ? "$text95" : "$text60"} />
        ) : (
          <Avatar circular size="$9" borderWidth={isSelected ? 2 : 0} borderColor="$success"><Avatar.Image src={avatarUrl} /></Avatar>
        )}

        <YStack flex={1}>
          <Text color="$text95" fontWeight="bold" fontSize="$5">{name}</Text>
          {subtitle && <Text color="$primary" fontSize="$2" fontWeight="600">{subtitle}</Text>}
        </YStack>
      </Card.Header>
    </Card>
  );
}