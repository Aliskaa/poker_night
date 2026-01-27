import React from 'react';
import { YStack, XStack, Text, View, useTheme } from 'tamagui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// ═══════════════════════════════════════════════════════════════════
// 🔘 TOGGLE - Switch interrupteur avec animation
// ═══════════════════════════════════════════════════════════════════

type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'primary';
};

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  variant = 'default',
}) => {
  const theme = useTheme();
  
  // Animation de la position du thumb
  const translateX = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    translateX.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value]);

  const sizeConfig = {
    sm: { width: 40, height: 24, thumb: 18, padding: 3 },
    md: { width: 48, height: 28, thumb: 22, padding: 3 },
    lg: { width: 56, height: 32, thumb: 26, padding: 3 },
  };

  const config = sizeConfig[size];

  const variantColors = {
    default: {
      active: theme.primary.val,
      inactive: theme.surface3.val,
    },
    success: {
      active: theme.success.val,
      inactive: theme.surface3.val,
    },
    primary: {
      active: theme.goldBg.val,
      inactive: theme.surface3.val,
    },
  };

  const colors = variantColors[variant];

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value * (config.width - config.thumb - config.padding * 2),
        },
      ],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  const ToggleSwitch = (
    <XStack
      width={config.width}
      height={config.height}
      backgroundColor={value ? colors.active : colors.inactive}
      borderRadius={config.height / 2}
      padding={config.padding}
      onPress={handlePress}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
    >
      <Animated.View
        style={[
          {
            width: config.thumb,
            height: config.thumb,
            borderRadius: config.thumb / 2,
            backgroundColor: 'white',
          },
          thumbStyle,
        ]}
      />
    </XStack>
  );

  if (!label && !description) {
    return ToggleSwitch;
  }

  return (
    <XStack
      gap="$3"
      alignItems="center"
      justifyContent="space-between"
      onPress={handlePress}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <YStack flex={1} gap="$1">
        {label && (
          <Text fontSize="$4" fontWeight="600" color="$colorPrimary">
            {label}
          </Text>
        )}
        {description && (
          <Text fontSize="$3" color="$colorMuted">
            {description}
          </Text>
        )}
      </YStack>

      {ToggleSwitch}
    </XStack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// TOGGLE GROUP - Groupe de toggles radio-style
// ═══════════════════════════════════════════════════════════════════

type ToggleGroupOption = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

type ToggleGroupProps = {
  options: ToggleGroupOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  variant?: 'pills' | 'cards';
};

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  label,
  variant = 'pills',
}) => {
  if (variant === 'cards') {
    return (
      <YStack gap="$2">
        {label && (
          <Text fontSize="$3" fontWeight="600" color="$colorSecondary">
            {label}
          </Text>
        )}
        <YStack gap="$2">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <XStack
                key={option.value}
                padding="$3"
                backgroundColor={isSelected ? '$goldBg' : '$surface2'}
                borderWidth={isSelected ? 2 : 1}
                borderColor={isSelected ? '$primary' : '$borderColor'}
                borderRadius="$4"
                alignItems="center"
                gap="$3"
                onPress={() => onChange(option.value)}
                cursor="pointer"
              >
                {option.icon}
                <Text
                  fontSize="$4"
                  fontWeight={isSelected ? '700' : '500'}
                  color={isSelected ? '$primary' : '$colorPrimary'}
                  flex={1}
                >
                  {option.label}
                </Text>
                <View
                  width={20}
                  height={20}
                  borderRadius="$round"
                  borderWidth={2}
                  borderColor={isSelected ? '$primary' : '$borderColor'}
                  backgroundColor={isSelected ? '$primary' : 'transparent'}
                  alignItems="center"
                  justifyContent="center"
                >
                  {isSelected && (
                    <View
                      width={8}
                      height={8}
                      borderRadius="$round"
                      backgroundColor="$white"
                    />
                  )}
                </View>
              </XStack>
            );
          })}
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack gap="$2">
      {label && (
        <Text fontSize="$3" fontWeight="600" color="$colorSecondary">
          {label}
        </Text>
      )}
      <XStack gap="$2" flexWrap="wrap">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <XStack
              key={option.value}
              paddingHorizontal="$3"
              paddingVertical="$2"
              backgroundColor={isSelected ? '$primary' : '$surface2'}
              borderRadius="$3"
              alignItems="center"
              gap="$2"
              onPress={() => onChange(option.value)}
              cursor="pointer"
            >
              {option.icon}
              <Text
                fontSize="$3"
                fontWeight={isSelected ? '700' : '500'}
                color={isSelected ? '$white' : '$colorPrimary'}
              >
                {option.label}
              </Text>
            </XStack>
          );
        })}
      </XStack>
    </YStack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PRESET TOGGLE GROUPS
// ═══════════════════════════════════════════════════════════════════

type GameTypeToggleProps = {
  value: 'tournament' | 'cash';
  onChange: (value: 'tournament' | 'cash') => void;
};

export const GameTypeToggle: React.FC<GameTypeToggleProps> = ({
  value,
  onChange,
}) => {
  const options: ToggleGroupOption[] = [
    { label: 'Tournoi', value: 'tournament' },
    { label: 'Cash Game', value: 'cash' },
  ];

  return (
    <ToggleGroup
      label="Type de partie"
      options={options}
      value={value}
      onChange={(v) => onChange(v as 'tournament' | 'cash')}
      variant="pills"
    />
  );
};

type RebuyToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export const RebuyToggle: React.FC<RebuyToggleProps> = ({
  value,
  onChange,
}) => {
  return (
    <Toggle
      value={value}
      onChange={onChange}
      label="Autoriser les rebuys"
      description="Les joueurs pourront racheter des jetons"
      variant="success"
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// const [enabled, setEnabled] = useState(false);
//
// <Toggle 
//   value={enabled} 
//   onChange={setEnabled}
//   label="Activer les notifications"
//   description="Recevoir des alertes pour les nouvelles parties"
// />
//
// <ToggleGroup
//   label="Difficultés"
//   options={[
//     { label: 'Facile', value: 'easy' },
//     { label: 'Moyen', value: 'medium' },
//     { label: 'Difficile', value: 'hard' },
//   ]}
//   value={difficulty}
//   onChange={setDifficulty}
// />
//
// <GameTypeToggle value={gameType} onChange={setGameType} />
// <RebuyToggle value={allowRebuys} onChange={setAllowRebuys} />
