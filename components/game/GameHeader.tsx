import React from 'react';
import { XStack, YStack, Text, H1, Button, Separator } from 'tamagui';
import { Coins, HelpCircle, Share as ShareIcon, ChevronLeft, Lock, Infinity, Timer } from '@tamagui/lucide-icons';

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
    if (lateRegLimit === 0) return <Badge icon={<Infinity size={14} color="$success" />} text="Ouvert" color="$success" bg="rgba(16, 185, 129, 0.15)" />;
    if (lateRegSeconds !== null && lateRegSeconds > 0) {
      const isUrgent = lateRegSeconds < 300;
      return <Badge icon={<Timer size={14} color={isUrgent ? "$warning" : "$success"} />} text={formatTime(lateRegSeconds)} color={isUrgent ? "$warning" : "$success"} bg={isUrgent ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)"} />;
    }
    return <Badge icon={<Lock size={14} color="$danger" />} text="Fermé" color="$danger" bg="rgba(239, 68, 68, 0.15)" />;
  };

  return (
    <YStack alignItems="center" paddingBottom="$4" paddingTop="$2" position="relative">
      <XStack position="absolute" top="$2" left="$4">
        <Button size="$3" circular icon={<ChevronLeft size={20} color="$color" />} backgroundColor="rgba(255, 255, 255, 0.05)" borderColor="$borderColor" borderWidth={1} onPress={onBackPress} />
      </XStack>
      <XStack position="absolute" top="$2" right="$4" gap="$2">
        <Button size="$3" circular icon={<HelpCircle size={18} color="$colorMuted" />} backgroundColor="rgba(255, 255, 255, 0.05)" borderColor="$borderColor" borderWidth={1} onPress={onHelpPress} />
        <Button size="$3" circular icon={<ShareIcon size={18} color="$colorMuted" />} backgroundColor="rgba(255, 255, 255, 0.05)" borderColor="$borderColor" borderWidth={1} onPress={onSharePress} />
      </XStack>

      <Text color="$colorMuted" fontSize="$3" fontWeight="bold" textTransform="uppercase" letterSpacing={2}>Pot Total</Text>
      <XStack alignItems="center" gap="$2">
        <Coins size={40} color="$primary" />
        <H1 fontSize="$9" color="$primary" fontWeight="900" letterSpacing={-2}>{String(totalPot)} €</H1>
      </XStack>

      <XStack alignItems="center" gap="$3" marginTop="$2">
        <XStack alignItems="center" gap="$1.5"><Coins size={14} color="$colorMuted" /><Text color="$colorMuted" fontSize="$2">Buy-in: {String(defaultBuyIn)}€</Text></XStack>
        <Separator vertical borderColor="$borderColor" height={12} />
        <XStack alignItems="center" gap="$1.5"><Text color="$colorMuted" fontSize="$2">Inscriptions :</Text>{renderLateRegBadge()}</XStack>
      </XStack>
    </YStack>
  );
}

const Badge = ({ icon, text, color, bg }: any) => (
  <XStack alignItems="center" gap="$1.5" backgroundColor={bg} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$3">
    {icon}<Text color={color} fontSize="$2" fontWeight="bold">{text}</Text>
  </XStack>
);