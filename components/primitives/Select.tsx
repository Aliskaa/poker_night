import React, { useState } from 'react';
import { YStack, XStack, Text, View } from 'tamagui';
import { ChevronDown, Check } from '@tamagui/lucide-icons';
import { Modal, Platform } from 'react-native';
import { Card } from './Cards';

// ═══════════════════════════════════════════════════════════════════
// 📋 SELECT - Sélecteur avec dropdown/bottom sheet
// ═══════════════════════════════════════════════════════════════════

export type SelectOption<T = string> = {
  label: string;
  value: T;
  icon?: React.ReactNode;
  disabled?: boolean;
};

type SelectProps<T = string> = {
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
};

export const Select = <T extends string | number = string>({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  label,
  helperText,
  error,
  disabled = false,
  variant = 'default',
  size = 'md',
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const sizeStyles = {
    sm: { height: 36, fontSize: '$3', padding: '$2' },
    md: { height: 44, fontSize: '$4', padding: '$3' },
    lg: { height: 52, fontSize: '$5', padding: '$4' },
  };

  const variantStyles = {
    default: {
      backgroundColor: '$surface2',
      borderWidth: 1,
      borderColor: error ? '$danger' : '$borderColor',
    },
    filled: {
      backgroundColor: '$surface3',
      borderWidth: 0,
      borderColor: 'transparent',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: error ? '$danger' : '$borderColor',
    },
  };

  const styles = {
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const handleSelect = (option: SelectOption<T>) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  return (
    <YStack gap="$2">
      {/* Label */}
      {label && (
        <Text fontSize="$3" fontWeight="600" color="$colorSecondary">
          {label}
        </Text>
      )}

      {/* Select Trigger */}
      <XStack
        height={styles.height}
        paddingHorizontal={styles.padding}
        backgroundColor={styles.backgroundColor}
        borderWidth={styles.borderWidth}
        borderColor={styles.borderColor}
        borderRadius="$4"
        alignItems="center"
        justifyContent="space-between"
        onPress={() => !disabled && setIsOpen(true)}
        cursor={disabled ? 'not-allowed' : 'pointer'}
        opacity={disabled ? 0.5 : 1}
      >
        <XStack gap="$2" alignItems="center" flex={1}>
          {selectedOption?.icon}
          <Text
            fontSize={styles.fontSize}
            color={selectedOption ? '$colorPrimary' : '$colorMuted'}
            numberOfLines={1}
          >
            {selectedOption?.label || placeholder}
          </Text>
        </XStack>

        <ChevronDown
          size={20}
          color="$colorMuted"
          style={{
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
          }}
        />
      </XStack>

      {/* Helper/Error Text */}
      {(helperText || error) && (
        <Text fontSize="$2" color={error ? '$danger' : '$colorMuted'}>
          {error || helperText}
        </Text>
      )}

      {/* Options Modal (Mobile-first with Bottom Sheet) */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View
          flex={1}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          justifyContent="flex-end"
          onPress={() => setIsOpen(false)}
        >
          <YStack
            backgroundColor="$background"
            borderTopLeftRadius="$6"
            borderTopRightRadius="$6"
            padding="$4"
            maxHeight="80%"
          >
            {/* Header */}
            <YStack gap="$3" paddingBottom="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
              <Text fontSize="$5" fontWeight="900" color="$colorPrimary">
                {label || 'Sélectionner'}
              </Text>
            </YStack>

            {/* Options List */}
            <YStack gap="$2" paddingVertical="$3">
              {options.map((option) => {
                const isSelected = option.value === value;
                const isDisabled = option.disabled;

                return (
                  <XStack
                    key={String(option.value)}
                    padding="$3"
                    backgroundColor={isSelected ? '$goldBg' : '$surface2'}
                    borderRadius="$4"
                    borderWidth={isSelected ? 2 : 0}
                    borderColor="$primary"
                    alignItems="center"
                    justifyContent="space-between"
                    onPress={() => handleSelect(option)}
                    cursor={isDisabled ? 'not-allowed' : 'pointer'}
                    opacity={isDisabled ? 0.4 : 1}
                  >
                    <XStack gap="$3" alignItems="center" flex={1}>
                      {option.icon}
                      <Text
                        fontSize="$4"
                        fontWeight={isSelected ? '700' : '500'}
                        color={isSelected ? '$primary' : '$colorPrimary'}
                      >
                        {option.label}
                      </Text>
                    </XStack>

                    {isSelected && <Check size={20} color="$primary" />}
                  </XStack>
                );
              })}
            </YStack>
          </YStack>
        </View>
      </Modal>
    </YStack>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PRESET SELECT COMPONENTS
// ═══════════════════════════════════════════════════════════════════

type PayoutModelSelectProps = {
  value?: string;
  onChange: (value: string) => void;
};

export const PayoutModelSelect: React.FC<PayoutModelSelectProps> = ({
  value,
  onChange,
}) => {
  const options: SelectOption[] = [
    { label: 'Winner Takes All', value: 'winner_takes_all' },
    { label: 'Top 2 payés', value: 'top_2' },
    { label: 'Top 3 payés', value: 'top_3' },
    { label: 'Top 4 payés', value: 'top_4' },
    { label: 'Top 5 payés', value: 'top_5' },
  ];

  return (
    <Select
      label="Structure de payout"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Choisir une structure..."
    />
  );
};

type BuyInSelectProps = {
  value?: number;
  onChange: (value: number) => void;
};

export const BuyInSelect: React.FC<BuyInSelectProps> = ({ value, onChange }) => {
  const options: SelectOption<number>[] = [
    { label: '5€', value: 5 },
    { label: '10€', value: 10 },
    { label: '20€', value: 20 },
    { label: '50€', value: 50 },
    { label: '100€', value: 100 },
  ];

  return (
    <Select
      label="Buy-in"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Choisir un montant..."
    />
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// const [selected, setSelected] = useState('option1');
//
// <Select 
//   options={[
//     { label: 'Option 1', value: 'option1' },
//     { label: 'Option 2', value: 'option2' },
//   ]}
//   value={selected}
//   onChange={setSelected}
//   label="Choisir une option"
// />
//
// <PayoutModelSelect value={payoutModel} onChange={setPayoutModel} />
// <BuyInSelect value={buyIn} onChange={setBuyIn} />
