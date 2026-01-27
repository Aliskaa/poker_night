import React from 'react';
import { View, Text, Image, styled, GetProps } from 'tamagui';

// ═══════════════════════════════════════════════════════════════════
// 👤 AVATAR - Composant avatar avec fallback initiales
// ═══════════════════════════════════════════════════════════════════

const AvatarContainer = styled(View, {
  name: 'Avatar',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$round',
  backgroundColor: '$surface4',
  overflow: 'hidden',
  position: 'relative',
  
  variants: {
    size: {
      sm: { width: 32, height: 32 },
      md: { width: 40, height: 40 },
      lg: { width: 56, height: 56 },
      xl: { width: 80, height: 80 },
    },
    
    status: {
      active: {
        borderWidth: 3,
        borderColor: '$success',
      },
      eliminated: {
        borderWidth: 3,
        borderColor: '$danger',
        opacity: 0.6,
      },
      none: {},
    },
  },
  
  defaultVariants: {
    size: 'md',
    status: 'none',
  },
});

const AvatarImage = styled(Image, {
  width: '100%',
  height: '100%',
});

const AvatarFallback = styled(Text, {
  fontWeight: '700',
  color: '$colorPrimary',
  textTransform: 'uppercase',
  
  variants: {
    size: {
      sm: { fontSize: '$2' },
      md: { fontSize: '$3' },
      lg: { fontSize: '$5' },
      xl: { fontSize: '$7' },
    },
  },
  
  defaultVariants: {
    size: 'md',
  },
});

const StatusIndicator = styled(View, {
  position: 'absolute',
  borderRadius: '$round',
  borderWidth: 2,
  borderColor: '$background',
  
  variants: {
    size: {
      sm: { 
        width: 8, 
        height: 8, 
        bottom: 0, 
        right: 0 
      },
      md: { 
        width: 10, 
        height: 10, 
        bottom: 0, 
        right: 0 
      },
      lg: { 
        width: 12, 
        height: 12, 
        bottom: 2, 
        right: 2 
      },
      xl: { 
        width: 16, 
        height: 16, 
        bottom: 4, 
        right: 4 
      },
    },
    
    status: {
      active: { backgroundColor: '$success' },
      eliminated: { backgroundColor: '$danger' },
      none: { display: 'none' },
    },
  },
});

// ─────────────────────────────────────────────────────────────────
// HELPER : Générer initiales depuis nom
// ─────────────────────────────────────────────────────────────────
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// ─────────────────────────────────────────────────────────────────
// HELPER : Générer couleur de fond depuis hash du nom
// ─────────────────────────────────────────────────────────────────
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const getBgColor = (name: string): string => {
  const colors = [
    '$blue500',
    '$emerald500',
    '$purple500',
    '$orange500',
    '$cyan500',
    '$red500',
  ];
  const hash = Math.abs(hashCode(name));
  return colors[hash % colors.length];
};

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────
type AvatarProps = GetProps<typeof AvatarContainer> & {
  name: string;
  imageUrl?: string;
  showStatus?: boolean;
};

export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  imageUrl, 
  size = 'md',
  status = 'none',
  showStatus = false,
  ...props 
}) => {
  const initials = getInitials(name);
  const bgColor = getBgColor(name);
  
  return (
    <AvatarContainer 
      size={size} 
      status={showStatus ? status : 'none'}
      backgroundColor={imageUrl ? 'transparent' : bgColor}
      {...props}
    >
      {imageUrl ? (
        <AvatarImage 
          source={{ uri: imageUrl }} 
          resizeMode="cover"
        />
      ) : (
        <AvatarFallback size={size}>
          {initials}
        </AvatarFallback>
      )}
      
      {showStatus && (
        <StatusIndicator size={size} status={status} />
      )}
    </AvatarContainer>
  );
};

// ═══════════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════
// <Avatar name="Marc Connors" size="lg" />
// <Avatar name="Sarah Johnson" imageUrl="https://..." />
// <Avatar name="Thomas" status="active" showStatus size="xl" />
