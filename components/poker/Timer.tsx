import React, { useEffect, useState } from 'react';
import { XStack, YStack, Text, View } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// ⏱️ TIMER - Compte à rebours pour niveaux de blinds
// ═══════════════════════════════════════════════════════════════════

type TimerProps = {
  seconds: number;
  isRunning: boolean;
  onComplete?: () => void;
  variant?: 'circular' | 'linear' | 'numeric';
  warningAt?: number;
  dangerAt?: number;
  size?: 'sm' | 'md' | 'lg';
};

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const getTimerColor = (seconds: number, warningAt: number, dangerAt: number): string => {
  if (seconds <= dangerAt) return '$danger';
  if (seconds <= warningAt) return '$warning';
  return '$success';
};

// ─────────────────────────────────────────────────────────────────
// VARIANT: NUMERIC (Simple)
// ─────────────────────────────────────────────────────────────────
const NumericTimer: React.FC<TimerProps> = ({
  seconds,
  warningAt = 60,
  dangerAt = 30,
  size = 'md',
}) => {
  const color = getTimerColor(seconds, warningAt, dangerAt);
  const fontSize = size === 'sm' ? '$5' : size === 'md' ? '$7' : '$9';
  
  return (
    <Text
      fontSize={fontSize}
      fontWeight="900"
      color={color}
      fontVariant={['tabular-nums']}
      letterSpacing={2}
    >
      {formatTime(seconds)}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────
// VARIANT: LINEAR (Barre de progression)
// ─────────────────────────────────────────────────────────────────
const LinearTimer: React.FC<TimerProps & { totalSeconds: number }> = ({
  seconds,
  totalSeconds,
  warningAt = 60,
  dangerAt = 30,
  size = 'md',
}) => {
  const progress = (seconds / totalSeconds) * 100;
  const color = getTimerColor(seconds, warningAt, dangerAt);
  const height = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  
  return (
    <YStack gap="$2" width="100%">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$3" color="$colorMuted" fontWeight="600">
          Temps restant
        </Text>
        <Text 
          fontSize={size === 'sm' ? '$4' : '$5'} 
          fontWeight="900" 
          color={color}
          fontVariant={['tabular-nums']}
        >
          {formatTime(seconds)}
        </Text>
      </XStack>
      
      {/* Barre de fond */}
      <View
        width="100%"
        height={height}
        borderRadius="$2"
        backgroundColor="$surface3"
        overflow="hidden"
      >
        {/* Barre de progression */}
        <View
          width={`${progress}%`}
          height="100%"
          backgroundColor={color}
          animation="smooth"
        />
      </View>
    </YStack>
  );
};

// ─────────────────────────────────────────────────────────────────
// VARIANT: CIRCULAR (Anneau de progression)
// ─────────────────────────────────────────────────────────────────
const CircularTimer: React.FC<TimerProps & { totalSeconds: number }> = ({
  seconds,
  totalSeconds,
  warningAt = 60,
  dangerAt = 30,
  size = 'md',
}) => {
  const progress = (seconds / totalSeconds);
  const color = getTimerColor(seconds, warningAt, dangerAt);
  const containerSize = size === 'sm' ? 80 : size === 'md' ? 120 : 160;
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const radius = (containerSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress * circumference);
  
  return (
    <YStack alignItems="center" justifyContent="center" gap="$2">
      <View
        width={containerSize}
        height={containerSize}
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {/* SVG Circle (simplified - use react-native-svg in real app) */}
        <View
          position="absolute"
          width={containerSize}
          height={containerSize}
          borderRadius="$round"
          borderWidth={strokeWidth}
          borderColor="$surface3"
        />
        
        <View
          position="absolute"
          width={containerSize}
          height={containerSize}
          borderRadius="$round"
          borderWidth={strokeWidth}
          borderColor={color}
          animation="smooth"
          style={{
            // Note: This is a simplified version
            // Use react-native-svg with Circle + strokeDasharray for real implementation
            transform: [{ rotate: '-90deg' }],
          }}
        />
        
        {/* Temps au centre */}
        <Text
          fontSize={size === 'sm' ? '$5' : size === 'md' ? '$7' : '$9'}
          fontWeight="900"
          color={color}
          fontVariant={['tabular-nums']}
        >
          {formatTime(seconds)}
        </Text>
      </View>
    </YStack>
  );
};

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export const Timer: React.FC<TimerProps> = ({
  seconds,
  isRunning,
  onComplete,
  variant = 'numeric',
  warningAt = 60,
  dangerAt = 30,
  size = 'md',
}) => {
  const [currentSeconds, setCurrentSeconds] = useState(seconds);

  // Sync avec prop externe
  useEffect(() => {
    setCurrentSeconds(seconds);
  }, [seconds]);

  // Countdown
  useEffect(() => {
    if (!isRunning || currentSeconds <= 0) return;

    const interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentSeconds, onComplete]);

  const props = {
    seconds: currentSeconds,
    warningAt,
    dangerAt,
    size,
  };

  switch (variant) {
    case 'linear':
      return <LinearTimer {...props} totalSeconds={seconds} />;
    case 'circular':
      return <CircularTimer {...props} totalSeconds={seconds} />;
    case 'numeric':
    default:
      return <NumericTimer {...props} />;
  }
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <Timer seconds={300} isRunning variant="numeric" />
// <Timer seconds={180} isRunning variant="linear" warningAt={60} dangerAt={30} />
// <Timer seconds={600} isRunning variant="circular" size="lg" onComplete={() => alert('Fini!')} />
