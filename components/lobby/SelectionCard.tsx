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
      backgroundColor={isSelected ? "$successBg" : "$glass2"}
      borderColor={isSelected ? "$success" : "$borderColor"} 
      pressStyle={{ scale: 0.98 }} 
      onPress={onToggle}
    >
      <Card.Header padded flexDirection="row" alignItems="center" gap="$3">
        <Checkbox checked={isSelected} backgroundColor={isSelected ? "$success" : "$background"} borderColor={isSelected ? "$success" : "$borderColor"} disabled={isDisabled}>
          <Checkbox.Indicator><Check color="white" /></Checkbox.Indicator>
        </Checkbox>
        
        {isGhost ? (
          <Ghost size={20} color={isSelected ? "$success" : "$colorMuted"} />
        ) : (
          <Avatar circular size="$3"><Avatar.Image src={avatarUrl} /></Avatar>
        )}

        <YStack flex={1}>
          <Text color={isSelected ? "$success" : "$color"} fontWeight="bold">{name}</Text>
          {subtitle && <Text color="$potGold" fontSize="$2">{subtitle}</Text>}
        </YStack>
      </Card.Header>
    </Card>
  );
}