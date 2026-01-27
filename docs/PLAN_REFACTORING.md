# 🔄 PLAN DE REFACTORING - POKER NIGHT

> **Guide de migration étape par étape**  
> Janvier 2026

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Phase 1 : Nettoyage](#phase-1--nettoyage)
3. [Phase 2 : Restructuration](#phase-2--restructuration)
4. [Phase 3 : Nouveaux Composants](#phase-3--nouveaux-composants)
5. [Phase 4 : Migration Écrans](#phase-4--migration-écrans)
6. [Phase 5 : Navigation](#phase-5--navigation)
6. [Checklist de Migration](#checklist-de-migration)

---

## VUE D'ENSEMBLE

### Objectifs
- ✅ Supprimer code legacy (.old files)
- ✅ Unifier composants UI (glass cards, buttons, etc.)
- ✅ Reorganiser architecture dossiers (feature-based)
- ✅ Implémenter nouveaux composants (Badge, Avatar, ChipStack, etc.)
- ✅ Refactorer navigation (4 tabs + FAB)
- ✅ Optimiser user flows

### Durée Estimée
**5 semaines** (à temps partiel ~15h/semaine)

---

## PHASE 1 : NETTOYAGE

### Étape 1.1 : Supprimer Fichiers Legacy

```bash
# Fichiers à supprimer
rm components/ui/GlassCard.old.tsx
rm components/ui/PokerButton.old.tsx
rm components/ui/DealerButton.old.tsx
rm components/ui/PokerBackground.old.tsx
rm components/game/GameHeader.old.tsx
rm components/game/PlayerCard.old.tsx
rm app/(main)/game/[id].old.tsx
rm tamagui.config.old.ts
rm tamagui.config.ts.old
```

**Vérifications :**
- [ ] Aucune importation ne référence ces fichiers
- [ ] Tester build : `npm run build` (ou `expo build`)
- [ ] Commit : `git commit -m "chore: remove legacy .old files"`

### Étape 1.2 : Audit Imports

```bash
# Chercher imports manquants
grep -r "\.old" app/ components/
```

Si trouvés → Remplacer par versions actuelles

---

## PHASE 2 : RESTRUCTURATION

### Étape 2.1 : Nouvelle Structure Dossiers

**Créer nouveaux dossiers :**

```bash
mkdir -p components/primitives
mkdir -p components/poker
mkdir -p components/features/game
mkdir -p components/features/create
mkdir -p components/features/home
mkdir -p components/features/stats
mkdir -p components/layouts
```

### Étape 2.2 : Migration Composants Existants

#### A. Primitives (UI Pure)

**Fichiers à déplacer/unifier :**

```
components/primitives/
├── Button.tsx              ← Existant (OK)
├── Cards.tsx               ← Fusionner GlassCard + Cards
├── Layout.tsx              ← Existant (OK)
├── Indicators.tsx          ← Existant (OK)
├── Badge.tsx               ← Nouveau (déjà créé)
└── Avatar.tsx              ← Nouveau (déjà créé)
```

**Action :**

```bash
# Unifier GlassCard
# Remplacer tous les imports de GlassCard par Card
# Utiliser variant="glass"
```

**Exemple migration :**

```tsx
// AVANT
import { GlassCard } from '@/components/ui/GlassCard';
<GlassCard>...</GlassCard>

// APRÈS
import { Card } from '@/components/primitives/Cards';
<Card variant="glass">...</Card>
```

**Fichier Cards.tsx unifié :**

```tsx
// components/primitives/Cards.tsx
import { styled, View } from 'tamagui';

export const Card = styled(View, {
  name: 'Card',
  borderRadius: '$5',
  padding: '$4',
  
  variants: {
    variant: {
      glass: {
        backgroundColor: '$glass3',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
      solid: {
        backgroundColor: '$surface2',
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '$borderColor',
      },
    },
    elevation: {
      none: {},
      sm: { 
        shadowColor: '$shadowColor',
        shadowOpacity: 0.1, 
        shadowRadius: 4, 
        elevation: 2 
      },
      md: { 
        shadowColor: '$shadowColor',
        shadowOpacity: 0.15, 
        shadowRadius: 8, 
        elevation: 4 
      },
      lg: { 
        shadowColor: '$shadowColor',
        shadowOpacity: 0.2, 
        shadowRadius: 16, 
        elevation: 8 
      },
    },
  },
  
  defaultVariants: {
    variant: 'glass',
    elevation: 'sm',
  },
});

// Alias pour rétro-compatibilité
export const GlassCard = Card;
```

#### B. Composants Poker (Métier)

**Déplacer vers `components/poker/` :**

```bash
# Déjà créés (nouveaux)
# - ChipStack.tsx ✅
# - BlindLevel.tsx ✅
# - Timer.tsx ✅
# - PotDisplay.tsx ✅

# À créer/migrer
mv components/poker/HandRow.tsx components/poker/HandRow.tsx  # OK
mv components/poker/MiniCard.tsx components/poker/MiniCard.tsx  # OK

# À créer (nouveaux)
# - PlayerCard.tsx (refactorisé)
# - PayoutTable.tsx
# - QRCodeShare.tsx
```

#### C. Composants Features (Par Écran)

**Réorganiser par feature :**

```bash
# Feature: Game
mv components/game/GameHeader.tsx components/features/game/
mv components/game/GamePodium.tsx components/features/game/
mv components/game/PlayerCard.tsx components/features/game/  # Après refactor
# Créer : PlayerGrid.tsx, QuickActionsBar.tsx

# Feature: Create
mv components/create-game/ConfigSection.tsx components/features/create/
mv components/create-game/OptionButton.tsx components/features/create/
mv components/create-game/PayoutCard.tsx components/features/create/
# Créer : TemplateSelector.tsx, ConfigForm.tsx, GamePreview.tsx

# Feature: Home
mv components/home/ActiveGamesSlider.tsx components/features/home/LiveGameCarousel.tsx
mv components/home/HeroPlayCard.tsx components/features/home/
# Créer : InvitationCard.tsx, QuickActionGrid.tsx

# Feature: Stats (nouveau)
# Créer : OverviewCard.tsx, ProfitChart.tsx, LeaderboardList.tsx
```

### Étape 2.3 : Mettre à Jour Imports

**Script de recherche/remplacement :**

```bash
# Exemple pour GlassCard
find app components -type f -name "*.tsx" -exec sed -i '' 's|@/components/ui/GlassCard|@/components/primitives/Cards|g' {} \;

# Pour chaque composant déplacé, adapter les imports
```

**Ou manuellement :**

```tsx
// Chercher tous les imports
grep -r "from '@/components/game/GameHeader'" app/ components/

// Remplacer par
from '@/components/features/game/GameHeader'
```

---

## PHASE 3 : NOUVEAUX COMPOSANTS

### Étape 3.1 : Composants Primitives

**Déjà créés :**
- ✅ Badge
- ✅ Avatar

**À créer :**

#### Input.tsx

```tsx
// components/primitives/Input.tsx
import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  name: 'Input',
  backgroundColor: '$surface2',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$4',
  color: '$colorPrimary',
  fontSize: '$4',
  paddingHorizontal: '$4',
  height: 48,
  
  focusStyle: {
    borderColor: '$primary',
    backgroundColor: '$surface3',
  },
  
  variants: {
    error: {
      true: {
        borderColor: '$danger',
        backgroundColor: '$dangerBg',
      },
    },
    
    size: {
      sm: { height: 40, fontSize: '$3' },
      md: { height: 48, fontSize: '$4' },
      lg: { height: 56, fontSize: '$5' },
    },
  },
  
  defaultVariants: {
    size: 'md',
  },
});
```

#### Modal.tsx (BottomSheet)

```tsx
// components/primitives/Modal.tsx
import { Sheet } from 'tamagui';
import React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[];
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  snapPoints = [85, 50],
}) => {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      snapPoints={snapPoints}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Frame padding="$4" paddingTop="$6">
        <Sheet.Handle />
        {children}
      </Sheet.Frame>
    </Sheet>
  );
};
```

### Étape 3.2 : Composants Poker

**Déjà créés :**
- ✅ ChipStack
- ✅ BlindLevel
- ✅ Timer
- ✅ PotDisplay

**À créer :**

#### PlayerCard.tsx (Refactorisé)

```tsx
// components/poker/PlayerCard.tsx
import React from 'react';
import { XStack, YStack, Text, View } from 'tamagui';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';
import { ChipStack } from './ChipStack';
import type { Player } from '@/types/Player';

type PlayerCardProps = {
  player: Player;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  compact?: boolean;
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  compact = false,
}) => {
  const translateX = useSharedValue(0);
  
  // Gestes
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -100 && onSwipeLeft) {
        onSwipeLeft();
      } else if (e.translationX > 100 && onSwipeRight) {
        onSwipeRight();
      }
      translateX.value = withTiming(0);
    });
  
  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      onLongPress?.();
    });
  
  const composed = Gesture.Race(panGesture, longPressGesture);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        <View
          backgroundColor="$glass3"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$5"
          padding="$3"
          opacity={player.status === 'ELIMINATED' ? 0.6 : 1}
        >
          <XStack gap="$3" alignItems="center">
            {/* Avatar */}
            <Avatar
              name={player.name}
              size={compact ? 'sm' : 'md'}
              status={player.status === 'ACTIVE' ? 'active' : 'eliminated'}
              showStatus
            />

            {/* Infos joueur */}
            <YStack flex={1} gap="$1">
              <Text fontSize="$4" fontWeight="700" color="$colorPrimary">
                {player.name}
              </Text>
              <XStack gap="$2" alignItems="center">
                {player.buyInCount > 1 && (
                  <Badge variant="count" size="sm">
                    {player.buyInCount}x
                  </Badge>
                )}
                {player.status === 'ACTIVE' && (
                  <Badge variant="status" status="active" size="sm">
                    En jeu
                  </Badge>
                )}
                {player.status === 'ELIMINATED' && player.finalRank && (
                  <Badge variant="label" size="sm">
                    Rank: {player.finalRank}
                  </Badge>
                )}
              </XStack>
            </YStack>

            {/* Stack */}
            {!compact && (
              <ChipStack
                amount={player.totalInvested}
                size="sm"
                showLabel={false}
              />
            )}
            
            <Text fontSize="$5" fontWeight="900" color="$primary">
              {player.totalInvested}€
            </Text>
          </XStack>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};
```

**Note :** Ce composant nécessite `react-native-gesture-handler` et `react-native-reanimated`.

```bash
npx expo install react-native-gesture-handler react-native-reanimated
```

---

## PHASE 4 : MIGRATION ÉCRANS

### Étape 4.1 : Home Screen (Dashboard)

**Fichier :** `app/(main)/(tabs)/home.tsx`

**Changements :**

1. Importer nouveaux composants features
2. Ajouter section Invitations
3. Restructurer avec nouveaux composants

**Diff :**

```tsx
// AVANT
import { ActiveGamesSlider } from '@/components/home/ActiveGamesSlider';
import { HeroPlayCard } from '@/components/home/HeroPlayCard';
import { QuickAction } from '@/components/home/QuickAction';

// APRÈS
import { LiveGameCarousel } from '@/components/features/home/LiveGameCarousel';
import { InvitationCard } from '@/components/features/home/InvitationCard';
import { QuickActionGrid } from '@/components/features/home/QuickActionGrid';
import { FAB } from '@/components/primitives/Button';
```

### Étape 4.2 : Create Game (Modal)

**Transformer en Modal Bottom Sheet :**

```tsx
// app/(main)/create-game.tsx
import { Modal } from '@/components/primitives/Modal';
import { TemplateSelector } from '@/components/features/create/TemplateSelector';

export default function CreateGameModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <Modal 
      open={isOpen} 
      onClose={() => {
        setIsOpen(false);
        router.back();
      }}
    >
      <TemplateSelector />
      {/* ... */}
    </Modal>
  );
}
```

### Étape 4.3 : Game Screen

**Utiliser nouveaux composants :**

```tsx
// app/(main)/game/[id].tsx
import { PotDisplay } from '@/components/poker/PotDisplay';
import { BlindLevel } from '@/components/poker/BlindLevel';
import { Timer } from '@/components/poker/Timer';
import { PlayerCard } from '@/components/poker/PlayerCard';

// Dans le render
<PotDisplay amount={game.totalPot} size="xl" />

<BlindLevel
  small={50}
  big={100}
  ante={10}
  level={3}
  nextLevel={{ small: 100, big: 200 }}
/>

<Timer
  seconds={timerSeconds}
  isRunning={isTimerRunning}
  variant="linear"
/>
```

---

## PHASE 5 : NAVIGATION

### Étape 5.1 : Refactorer Tab Layout

**Fichier :** `app/(main)/(tabs)/_layout.tsx`

**Changements :**

1. Supprimer tab "play" (redondant)
2. Renommer "groups" → "tables"
3. Renommer "leaderboard" → "stats"
4. Ajouter FAB externe (dans layout parent)

**Nouveau code :**

```tsx
// app/(main)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Layers, TrendingUp, User } from '@tamagui/lucide-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '$night900',
          borderTopColor: '$borderColor',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '$primary',
        tabBarInactiveTintColor: '$colorMuted',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="tables"
        options={{
          title: 'Tables',
          tabBarIcon: ({ color, size }) => <Layers color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

### Étape 5.2 : Créer Nouveaux Écrans

**Tables :**

```bash
mv app/(main)/(tabs)/groups.tsx app/(main)/(tabs)/tables.tsx
```

**Stats :**

```bash
# Fusionner leaderboard dans stats
# Créer onglets internes [Mes Stats] [Leaderboard]
```

### Étape 5.3 : Ajouter FAB

**Dans layout parent :** `app/(main)/_layout.tsx`

```tsx
// app/(main)/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { FAB } from '@/components/primitives/Button';
import { Plus } from '@tamagui/lucide-icons';

export default function MainLayout() {
  const router = useRouter();
  
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="game/[id]" />
        <Stack.Screen 
          name="create-game" 
          options={{ presentation: 'modal' }}
        />
      </Stack>
      
      {/* FAB Global */}
      <FAB
        icon={<Plus size={24} color="$night900" />}
        onPress={() => router.push('/(main)/create-game')}
      />
    </>
  );
}
```

**Créer variant FAB dans Button :**

```tsx
// components/primitives/Button.tsx
// Ajouter variant
fab: {
  width: 64,
  height: 64,
  borderRadius: '$round',
  backgroundColor: '$primary',
  position: 'absolute',
  bottom: 90,
  right: 20,
  shadowColor: '$primary',
  shadowOpacity: 0.4,
  shadowRadius: 16,
  elevation: 10,
  zIndex: '$modal',
},
```

---

## CHECKLIST DE MIGRATION

### Phase 1 : Nettoyage ✓
- [ ] Supprimer tous fichiers .old
- [ ] Vérifier aucune référence restante
- [ ] Commit changements

### Phase 2 : Restructuration ✓
- [ ] Créer nouvelle structure dossiers
- [ ] Unifier GlassCard → Card
- [ ] Migrer composants vers features/
- [ ] Mettre à jour tous imports
- [ ] Tester build

### Phase 3 : Nouveaux Composants ✓
- [ ] Badge ✅
- [ ] Avatar ✅
- [ ] ChipStack ✅
- [ ] BlindLevel ✅
- [ ] Timer ✅
- [ ] PotDisplay ✅
- [ ] Input
- [ ] Modal
- [ ] PlayerCard refactorisé
- [ ] PayoutTable
- [ ] QRCodeShare

### Phase 4 : Migration Écrans ✓
- [ ] Home (dashboard)
- [ ] Create Game (modal)
- [ ] Game Screen
- [ ] Tables (ex-Groups)
- [ ] Stats (nouveau)
- [ ] Profile

### Phase 5 : Navigation ✓
- [ ] Refactor tab layout (4 tabs)
- [ ] Ajouter FAB global
- [ ] Tester navigation complète
- [ ] Optimiser transitions

### Tests Finaux ✓
- [ ] Tests unitaires composants
- [ ] Tests E2E flows principaux
- [ ] Tests performance (60fps)
- [ ] Tests accessibilité
- [ ] Review UX avec users

---

## COMMANDES UTILES

```bash
# Chercher imports d'un composant
grep -r "from '@/components/ui/GlassCard'" app/ components/

# Remplacer en masse (macOS/Linux)
find . -type f -name "*.tsx" -exec sed -i '' 's/GlassCard/Card/g' {} \;

# Build & test
npx expo start --clear
npm run build
npm test

# Lint
npm run lint -- --fix
```

---

## NOTES IMPORTANTES

1. **Tester à chaque étape** : Ne pas accumuler changements sans tester
2. **Commits atomiques** : 1 changement = 1 commit
3. **Branches feature** : Travailler sur branches séparées
4. **Backup** : Garder copies avant gros refactors
5. **Documentation** : Commenter changements complexes

---

## SUPPORT

En cas de problème :
- Consulter `REFONTE_UX_UI_COMPLETE.md` pour contexte
- Vérifier Tamagui docs : https://tamagui.dev
- Tester composants isolés avec Storybook (optionnel)
