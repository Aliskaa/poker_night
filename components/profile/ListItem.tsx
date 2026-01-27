import React from 'react';
import { Separator, Text, XStack, YStack } from 'tamagui';

interface ListItemProps {
  icon: React.ReactElement;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isLast?: boolean;
}

export function ListItem({ icon, title, subtitle, onPress, isLast }: ListItemProps) {
  return (
    <YStack>
      <XStack
        paddingVertical="$4"
        paddingHorizontal="$2"
        alignItems="center"
        justifyContent="space-between"
        onPress={onPress}
        pressStyle={{ backgroundColor: '$glassHover' }}
      >
        <XStack alignItems="center" gap="$3">
          {React.cloneElement(icon, { size: '$lg', color: '$primary' })}
          <YStack>
            <Text color="$color" fontSize="$4" fontWeight="600">
              {title}
            </Text>
            {subtitle && (
              <Text color="$colorDim" fontSize="$2">
                {subtitle}
              </Text>
            )}
          </YStack>
        </XStack>
        <Text color="$textFaint">›</Text>
      </XStack>
      {!isLast && <Separator borderColor="$borderColor" />}
    </YStack>
  );
}
