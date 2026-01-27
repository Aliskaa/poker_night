import React from 'react';
import { styled, View, Text, GetProps } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 🏷️ BADGE - Système de badges pour statuts, compteurs, labels
// ═══════════════════════════════════════════════════════════════════

export const BadgeContainer = styled(View, {
  name: 'Badge',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$1.5',
  paddingVertical: '$1',
  paddingHorizontal: '$2.5',
  borderRadius: '$3',
  
  variants: {
    variant: {
      status: {
        paddingVertical: '$1.5',
        borderWidth: 1,
      },
      count: {
        minWidth: 24,
        height: 24,
        borderRadius: '$round',
        justifyContent: 'center',
        paddingHorizontal: '$2',
        backgroundColor: '$primary',
      },
      chip: {
        borderWidth: 2,
        borderColor: '$white',
        paddingVertical: '$1.5',
      },
      label: {
        backgroundColor: '$surface3',
      },
    },
    
    status: {
      active: {
        backgroundColor: '$successBg',
        borderColor: '$success',
      },
      waiting: {
        backgroundColor: '$warningBg',
        borderColor: '$warning',
      },
      eliminated: {
        backgroundColor: '$dangerBg',
        borderColor: '$danger',
      },
      paid: {
        backgroundColor: '$purpleBg',
        borderColor: '$purple500',
      },
    },
    
    size: {
      sm: { 
        height: 20, 
        paddingHorizontal: '$2',
      },
      md: { 
        height: 24, 
        paddingHorizontal: '$2.5',
      },
      lg: { 
        height: 28, 
        paddingHorizontal: '$3',
      },
    },
  },
  
  defaultVariants: {
    variant: 'status',
    size: 'md',
  },
});

export const BadgeText = styled(Text, {
  fontWeight: '600',
  fontSize: '$2',
  
  variants: {
    variant: {
      status: { color: '$colorPrimary' },
      count: { color: '$night900' },
      chip: { color: '$colorPrimary' },
      label: { color: '$colorSecondary' },
    },
    
    status: {
      active: { color: '$success' },
      waiting: { color: '$warning' },
      eliminated: { color: '$danger' },
      paid: { color: '$purple500' },
    },
    
    size: {
      sm: { fontSize: '$1' },
      md: { fontSize: '$2' },
      lg: { fontSize: '$3' },
    },
  },
  
  defaultVariants: {
    variant: 'status',
    size: 'md',
  },
});

type BadgeProps = GetProps<typeof BadgeContainer> & {
  children: React.ReactNode;
};

export const Badge: React.FC<BadgeProps> = ({ children, ...props }) => {
  return (
    <BadgeContainer {...props}>
      <BadgeText 
        variant={props.variant} 
        status={props.status}
        size={props.size}
      >
        {children}
      </BadgeText>
    </BadgeContainer>
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <Badge variant="status" status="active">En jeu</Badge>
// <Badge variant="count">5</Badge>
// <Badge variant="chip">10€</Badge>
// <Badge variant="label">Dealer</Badge>
