import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { YStack } from 'tamagui';

export const PokerBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack flex={1} backgroundColor="$background">
      
      <LinearGradient
        colors={['rgba(34, 197, 94, 0.2)', 'transparent']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60%' }}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']} 
        locations={[0.5, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {children}
    </YStack>
  );
};