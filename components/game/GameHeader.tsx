import React from 'react'
import { XStack, YStack, Text, H1, Button, Separator } from 'tamagui'
import { Coins, HelpCircle, Share as ShareIcon, ChevronLeft, Lock, Infinity, Timer } from '@tamagui/lucide-icons'

type GameHeaderProps = {
  totalPot: number;
  defaultBuyIn: number;
  lateRegLimit: number;
  lateRegSeconds: number | null;
  onHelpPress: () => void;
  onSharePress: () => void;
  onBackPress: () => void;
};

export function GameHeader({ totalPot, defaultBuyIn, lateRegLimit, lateRegSeconds, onHelpPress, onSharePress, onBackPress }: GameHeaderProps) {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const renderLateRegBadge = () => {
    if (lateRegLimit === 0) {
      return <Badge icon={<Infinity size={14} color="$success" />} text="Ouvert" color="$success" bg="$successBg" />
    }
    if (lateRegSeconds !== null && lateRegSeconds > 0) {
      const isUrgent = lateRegSeconds < 300
      return (
        <Badge 
          icon={<Timer size={14} color={isUrgent ? '$warning' : '$success'} />} 
          text={formatTime(lateRegSeconds)} 
          color={isUrgent ? '$warning' : '$success'} 
          bg={isUrgent ? '$warningBg' : '$successBg'} 
        />
      )
    }
    return <Badge icon={<Lock size={14} color="$danger" />} text="Fermé" color="$danger" bg="$dangerBg" />
  }

  return (
    <YStack alignItems="center" paddingBottom="$4" paddingTop="$2" position="relative">
      <XStack position="absolute" top="$2" left="$4">
        <Button 
          size="$3" 
          circular 
          icon={<ChevronLeft size={20} color="$colorPrimary" />} 
          backgroundColor="$glass2" 
          borderColor="$glass4" 
          borderWidth={1} 
          pressStyle={{ backgroundColor: '$glass3' }}
          onPress={onBackPress} 
        />
      </XStack>
      <XStack position="absolute" top="$2" right="$4" gap="$2">
        <Button 
          size="$3" 
          circular 
          icon={<HelpCircle size={18} color="$colorSecondary" />} 
          backgroundColor="$glass2" 
          borderColor="$glass4" 
          borderWidth={1}
          pressStyle={{ backgroundColor: '$glass3' }}
          onPress={onHelpPress} 
        />
        <Button 
          size="$3" 
          circular 
          icon={<ShareIcon size={18} color="$colorSecondary" />} 
          backgroundColor="$glass2" 
          borderColor="$glass4" 
          borderWidth={1}
          pressStyle={{ backgroundColor: '$glass3' }}
          onPress={onSharePress} 
        />
      </XStack>

      <Text 
        color="$colorTertiary" 
        fontSize="$3" 
        fontWeight="700" 
        textTransform="uppercase" 
        letterSpacing={1.5}
      >
        Pot Total
      </Text>
      <XStack alignItems="center" gap="$2">
        <Coins size={40} color="$primary" />
        <H1 
          fontFamily="$heading"
          fontSize="$9" 
          color="$primary" 
          fontWeight="900" 
          letterSpacing={-2}
        >
          {totalPot} €
        </H1>
      </XStack>

      <XStack alignItems="center" gap="$3" marginTop="$2">
        <XStack alignItems="center" gap="$1.5">
          <Coins size={14} color="$colorTertiary" />
          <Text color="$colorSecondary" fontSize="$2">
            Buy-in: {defaultBuyIn}€
          </Text>
        </XStack>
        <Separator vertical borderColor="$glass4" height={12} />
        <XStack alignItems="center" gap="$1.5">
          <Text color="$colorSecondary" fontSize="$2">Inscriptions :</Text>
          {renderLateRegBadge()}
        </XStack>
      </XStack>
    </YStack>
  )
}

interface BadgeProps {
  icon: ReactElement
  text: string
  color: string
  bg: string
}

const Badge = ({ icon, text, color, bg }: BadgeProps) => (
  <XStack 
    alignItems="center" 
    gap="$1.5" 
    backgroundColor={bg} 
    borderColor={color}
    borderWidth={1}
    paddingHorizontal="$2.5" 
    paddingVertical="$1" 
    borderRadius="$4"
  >
    {icon}
    <Text 
      color={color} 
      fontSize="$2" 
      fontWeight="700"
    >
      {text}
    </Text>
  </XStack>
)

import type { ReactElement } from 'react'