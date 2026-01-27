import React from 'react';
import { Input as TamaguiInput, styled, YStack, Text, XStack } from 'tamagui';
import type { InputProps as TamaguiInputProps } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 📝 INPUT - Système d'inputs avec variants
// ═══════════════════════════════════════════════════════════════════

export const InputBase = styled(TamaguiInput, {
  name: 'Input',
  backgroundColor: '$surface2',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$4',
  color: '$colorPrimary',
  fontSize: '$4',
  paddingHorizontal: '$4',
  height: 48,
  fontFamily: '$body',
  
  focusStyle: {
    borderColor: '$primary',
    backgroundColor: '$surface3',
    outlineStyle: 'none',
  },
  
  variants: {
    variant: {
      default: {
        backgroundColor: '$surface2',
      },
      filled: {
        backgroundColor: '$surface3',
        borderWidth: 0,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
      },
    },
    
    error: {
      true: {
        borderColor: '$danger',
        backgroundColor: '$dangerBg',
        focusStyle: {
          borderColor: '$danger',
        },
      },
    },
    
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    
    size: {
      sm: { 
        height: 40, 
        fontSize: '$3',
        paddingHorizontal: '$3',
      },
      md: { 
        height: 48, 
        fontSize: '$4',
        paddingHorizontal: '$4',
      },
      lg: { 
        height: 56, 
        fontSize: '$5',
        paddingHorizontal: '$5',
      },
    },
  },
  
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// ─────────────────────────────────────────────────────────────────
// INPUT WRAPPER avec label et message d'erreur
// ─────────────────────────────────────────────────────────────────
type InputProps = TamaguiInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  disabled,
  ...props
}) => {
  return (
    <YStack gap="$2" opacity={disabled ? 0.5 : 1}>
      {/* Label */}
      {label && (
        <Text
          fontSize="$3"
          fontWeight="600"
          color={error ? '$danger' : '$colorSecondary'}
        >
          {label}
        </Text>
      )}

      {/* Input avec icônes */}
      <XStack
        position="relative"
        alignItems="center"
      >
        {leftIcon && (
          <XStack
            position="absolute"
            left="$3"
            zIndex={1}
            pointerEvents="none"
          >
            {leftIcon}
          </XStack>
        )}
        
        <InputBase
          variant={variant}
          size={size}
          error={!!error}
          disabled={disabled}
          paddingLeft={leftIcon ? '$10' : undefined}
          paddingRight={rightIcon ? '$10' : undefined}
          flex={1}
          {...props}
        />
        
        {rightIcon && (
          <XStack
            position="absolute"
            right="$3"
            zIndex={1}
            pointerEvents="none"
          >
            {rightIcon}
          </XStack>
        )}
      </XStack>

      {/* Message d'erreur ou helper text */}
      {(error || helperText) && (
        <Text
          fontSize="$2"
          color={error ? '$danger' : '$colorMuted'}
        >
          {error || helperText}
        </Text>
      )}
    </YStack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 🔢 NUMBER INPUT
// ═══════════════════════════════════════════════════════════════════
type NumberInputProps = Omit<InputProps, 'value' | 'onChangeText'> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  ...props
}) => {
  const handleChange = (text: string) => {
    const num = parseFloat(text);
    if (!isNaN(num)) {
      let newValue = num;
      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);
      onChange(newValue);
    } else if (text === '' || text === '-') {
      onChange(0);
    }
  };

  return (
    <Input
      {...props}
      value={value.toString()}
      onChangeText={handleChange}
      keyboardType="numeric"
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
// 🔍 SEARCH INPUT
// ═══════════════════════════════════════════════════════════════════
import { Search } from '@tamagui/lucide-icons';

type SearchInputProps = Omit<InputProps, 'leftIcon'>;

export const SearchInput: React.FC<SearchInputProps> = (props) => {
  return (
    <Input
      {...props}
      leftIcon={<Search size={20} color="$colorMuted" />}
      placeholder={props.placeholder || 'Rechercher...'}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <Input label="Email" placeholder="email@exemple.com" />
// <Input label="Mot de passe" error="Mot de passe requis" secureTextEntry />
// <NumberInput label="Buy-in" value={buyIn} onChange={setBuyIn} min={5} max={100} />
// <SearchInput placeholder="Rechercher un joueur..." />
