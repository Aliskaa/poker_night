# 🔧 Guide de Refactoring - Poker Night

## 📋 Table des matières
1. [Nettoyage des composants inutilisés](#1-nettoyage)
2. [Découpage des pages en sous-composants](#2-découpage)
3. [Migration vers le nouveau tamagui.config.ts](#3-migration-tamagui)
4. [Exemples de refactoring](#4-exemples)

---

## 1. 🧹 Nettoyage des composants inutilisés

### Fichiers à supprimer :
```bash
# Composants non utilisés
rm components/home/CreateGameCard.tsx
rm components/home/BankrollStats.tsx
rm components/home/MenuItem.tsx
rm app/(main)/(tabs)/play.tsx
```

---

## 2. ✂️ Découpage des pages en sous-composants

### 2.1 Profile Screen - AVANT/APRÈS

#### AVANT (profile.tsx - 130 lignes)
```tsx
export default function ProfileScreen() {
  // 130 lignes avec tout mélangé
  // Header + Stats + Performance + Menu + 3 composants internes
}
```

#### APRÈS - Structure recommandée :
```
components/profile/
  ├── ProfileHeader.tsx      (Avatar + Nom + Email + Badge membre)
  ├── ProfileStats.tsx       (Parties, Victoires, ROI)
  ├── PerformanceCard.tsx    (Profit Net + Investi + Gagné)
  ├── ProfileMenu.tsx        (Liste des liens)
  ├── StatItem.tsx           (Composant réutilisable)
  ├── DetailCard.tsx         (Composant réutilisable)
  └── ListItem.tsx           (Composant réutilisable)
```

#### Nouveau profile.tsx (20 lignes !) :
```tsx
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { PerformanceCard } from '@/components/profile/PerformanceCard';
import { ProfileMenu } from '@/components/profile/ProfileMenu';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { currentUserStats } = useUserLogic();

  return (
    <Theme name="dark">
      <PokerBackground>
        <YStack flex={1}>
          <ProfileHeader user={user} stats={currentUserStats} />
          
          <ScrollView>
            <YStack padding="$4" gap="$5" paddingBottom="$10">
              <PerformanceCard stats={currentUserStats} />
              <Separator borderColor="$borderColor" />
              <ProfileMenu onSignOut={() => signOut()} router={router} />
            </YStack>
          </ScrollView>
        </YStack>
      </PokerBackground>
    </Theme>
  );
}
```

### 2.2 Groups Screen - Découpage recommandé

```
components/group/
  ├── CreateGroupSheet.tsx   (Le Sheet de création)
  ├── JoinGroupSheet.tsx     (Le Sheet pour rejoindre)
  └── GroupCard.tsx          (Card d'un groupe)
```

### 2.3 Game Screen - Hook personnalisé

Créer `hooks/useGameTimers.ts` :
```tsx
export function useGameTimers(game: Game) {
  const [timerSeconds, setTimerSeconds] = useState(1200);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lateRegSeconds, setLateRegSeconds] = useState<number | null>(null);

  // Toute la logique des timers ici
  
  return {
    timerSeconds,
    isTimerRunning,
    lateRegSeconds,
    toggleTimer: () => setIsTimerRunning(!isTimerRunning),
    resetTimer: () => { /* ... */ }
  };
}
```

---

## 3. 🎨 Migration vers le nouveau tamagui.config.ts

### 3.1 Remplacement des valeurs RGBA

#### ❌ AVANT :
```tsx
<YStack backgroundColor="rgba(255,255,255,0.05)" borderColor="rgba(255,255,255,0.1)">
  <Text color="rgba(255,255,255,0.6)">Titre</Text>
</YStack>
```

#### ✅ APRÈS :
```tsx
<YStack backgroundColor="$glass" borderColor="$borderColor">
  <Text color="$colorMuted">Titre</Text>
</YStack>
```

### 3.2 Remplacement des couleurs hexadécimales

#### ❌ AVANT :
```tsx
<YStack backgroundColor="#064e3b">
  <Icon color="#fbbf24" />
  <Text color="#9ca3af">Label</Text>
</YStack>
```

#### ✅ APRÈS :
```tsx
<YStack backgroundColor="$background">
  <Icon color="$primary" />
  <Text color="$colorMuted">Label</Text>
</YStack>
```

### 3.3 Utilisation des tailles d'icônes

#### ❌ AVANT :
```tsx
<Users size={40} color="$potGold" />
<Settings size={20} color="white" />
<Trophy size={18} color="$success" />
```

#### ✅ APRÈS :
```tsx
<Users size="$4xl" color="$primary" />
<Settings size="$lg" color="$color" />
<Trophy size="$base" color="$success" />
```

### 3.4 Overlays et fonds

#### ❌ AVANT :
```tsx
<YStack backgroundColor="rgba(0,0,0,0.8)" borderColor="rgba(255,255,255,0.1)">
  <YStack backgroundColor="rgba(0,0,0,0.3)" padding="$3">
    <Text color="rgba(255,255,255,0.5)">Label</Text>
  </YStack>
</YStack>
```

#### ✅ APRÈS :
```tsx
<YStack backgroundColor="$overlayBlack" borderColor="$borderColor">
  <YStack backgroundColor="$overlayMedium" padding="$3">
    <Text color="$colorDim">Label</Text>
  </YStack>
</YStack>
```

---

## 4. 📝 Exemples de refactoring complets

### Exemple 1 : QuickAction.tsx

#### ❌ AVANT :
```tsx
export function QuickAction({ icon, label, subLabel, onPress }: any) {
    return (
        <Card
            flex={1}
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderColor="rgba(255, 255, 255, 0.1)"
            // ...
            pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
            <YStack backgroundColor="rgba(0,0,0,0.3)" padding="$2" borderRadius="$3">
                {React.cloneElement(icon, { color: '#fbbf24' })}
            </YStack>
            <YStack>
                <Text color="white" fontWeight="bold" fontSize="$5">{label}</Text>
                <Text color="rgba(255,255,255,0.5)" fontSize="$2">{subLabel}</Text>
            </YStack>
        </Card>
    );
}
```

#### ✅ APRÈS :
```tsx
export function QuickAction({ icon, label, subLabel, onPress }: any) {
    return (
        <Card
            flex={1}
            backgroundColor="$glass"
            borderColor="$borderColor"
            borderWidth={1}
            pressStyle={{ backgroundColor: '$glassHover' }}
            onPress={onPress}
        >
            <YStack backgroundColor="$overlayMedium" padding="$2" borderRadius="$3">
                {React.cloneElement(icon, { color: '$primary' })}
            </YStack>
            <YStack>
                <Text color="$color" fontWeight="bold" fontSize="$5">{label}</Text>
                <Text color="$colorDim" fontSize="$2">{subLabel}</Text>
            </YStack>
        </Card>
    );
}
```

### Exemple 2 : PlayerCard.tsx

#### ❌ AVANT :
```tsx
<Card
    backgroundColor={isEliminated ? "rgba(0,0,0,0.2)" : "rgba(255, 255, 255, 0.05)"}
    borderColor={isEliminated ? "transparent" : "rgba(255, 255, 255, 0.1)"}
>
    <H4 color={isEliminated ? "rgba(255,255,255,0.4)" : "white"}>
        {player.name}
    </H4>
    <Text color="rgba(255,255,255,0.5)" fontSize="$2">
        Misé : {player.totalInvested}€
    </Text>
</Card>
```

#### ✅ APRÈS :
```tsx
<Card
    backgroundColor={isEliminated ? "$overlayLight" : "$glass"}
    borderColor={isEliminated ? "transparent" : "$borderColor"}
    opacity={isEliminated ? 0.5 : 1}
>
    <H4 color={isEliminated ? "$colorFaint" : "$color"}>
        {player.name}
    </H4>
    <Text color="$colorDim" fontSize="$2">
        Misé : {player.totalInvested}€
    </Text>
</Card>
```

### Exemple 3 : GameHeader.tsx (Badges)

#### ❌ AVANT :
```tsx
const Badge = ({ icon, text, color, bg }: any) => (
  <XStack 
    alignItems="center" 
    gap="$1.5" 
    backgroundColor={bg}  // "rgba(16, 185, 129, 0.15)"
    paddingHorizontal="$2" 
    paddingVertical="$1" 
    borderRadius="$3"
  >
    {icon}
    <Text color={color} fontSize="$2" fontWeight="bold">{text}</Text>
  </XStack>
);

// Usage:
<Badge 
  icon={<Timer size={14} color="$success" />} 
  text="05:00" 
  color="$success" 
  bg="rgba(16, 185, 129, 0.15)" 
/>
```

#### ✅ APRÈS :
```tsx
const Badge = ({ icon, text, variant = 'success' }: any) => {
  const styles = {
    success: { bg: '$successBg', color: '$success' },
    danger: { bg: '$dangerBg', color: '$danger' },
    warning: { bg: '$warningBg', color: '$warning' },
  }[variant];

  return (
    <XStack 
      alignItems="center" 
      gap="$1.5" 
      backgroundColor={styles.bg}
      paddingHorizontal="$2" 
      paddingVertical="$1" 
      borderRadius="$3"
    >
      {React.cloneElement(icon, { size: '$sm', color: styles.color })}
      <Text color={styles.color} fontSize="$2" fontWeight="bold">{text}</Text>
    </XStack>
  );
};

// Usage simplifié:
<Badge icon={<Timer />} text="05:00" variant="success" />
<Badge icon={<Lock />} text="Fermé" variant="danger" />
```

---

## 5. 🚀 Plan de migration étape par étape

### Étape 1 : Préparation (5 min)
1. ✅ Renommer `tamagui.config.ts` en `tamagui.config.old.ts`
2. ✅ Renommer `tamagui.config.improved.ts` en `tamagui.config.ts`
3. ✅ Redémarrer le serveur de dev

### Étape 2 : Nettoyage (10 min)
1. ✅ Supprimer les composants non utilisés
2. ✅ Vérifier qu'aucune erreur n'apparaît

### Étape 3 : Migration progressive (2-3 heures)
**Ordre recommandé :**

1. **Composants UI génériques** (30 min)
   - `components/ui/GlassCard.tsx`
   - `components/ui/PokerButton.tsx`
   - `components/ui/PokerBackground.tsx`

2. **Composants Home** (30 min)
   - `components/home/QuickAction.tsx`
   - `components/home/HomeHeader.tsx`
   - `components/home/HeroPlayCard.tsx`

3. **Composants Game** (45 min)
   - `components/game/GameHeader.tsx`
   - `components/game/PlayerCard.tsx`
   - `components/poker/HandRow.tsx`

4. **Pages principales** (45 min)
   - `app/(main)/(tabs)/profile.tsx`
   - `app/(main)/(tabs)/home.tsx`
   - `app/(main)/(tabs)/groups.tsx`
   - `app/(main)/game/[id].tsx`

### Étape 4 : Tests (30 min)
- ✅ Tester chaque page
- ✅ Vérifier les couleurs/thèmes
- ✅ Tester les interactions

---

## 6. 🎯 Bénéfices attendus

### Maintenabilité
- ✅ Couleurs centralisées : modifier 1 ligne au lieu de 50+
- ✅ Composants réutilisables : moins de duplication
- ✅ Code plus lisible : `$glass` au lieu de `rgba(255,255,255,0.05)`

### Performance
- ✅ Moins de recalculs de couleurs
- ✅ Meilleure optimisation Tamagui

### Évolutivité
- ✅ Facile d'ajouter un mode clair/sombre
- ✅ Facile de changer la palette de couleurs
- ✅ Facile d'ajouter des variantes de composants

### Exemple concret :
**Besoin : Changer toutes les bordures verres de 0.1 à 0.15 d'opacité**

❌ AVANT : Chercher et remplacer dans 60+ fichiers
✅ APRÈS : Changer 1 ligne dans tamagui.config.ts :
```ts
glassBorder: 'rgba(255,255,255,0.15)', // au lieu de 0.1
```

---

## 7. 📦 Checklist de migration

### Configuration
- [ ] Nouveau tamagui.config.ts en place
- [ ] Serveur redémarré
- [ ] Pas d'erreurs de build

### Nettoyage
- [ ] CreateGameCard.tsx supprimé
- [ ] BankrollStats.tsx supprimé
- [ ] MenuItem.tsx supprimé
- [ ] play.tsx supprimé

### Migration des composants
- [ ] GlassCard.tsx migré
- [ ] PokerButton.tsx migré
- [ ] QuickAction.tsx migré
- [ ] GameHeader.tsx migré
- [ ] PlayerCard.tsx migré
- [ ] HandRow.tsx migré
- [ ] HomeHeader.tsx migré

### Migration des pages
- [ ] profile.tsx refactorisé
- [ ] home.tsx migré
- [ ] groups.tsx migré
- [ ] game/[id].tsx migré
- [ ] create-game.tsx migré

### Tests
- [ ] Navigation fonctionne
- [ ] Couleurs correctes
- [ ] Pas de régression visuelle
- [ ] Performance OK

---

## 8. 💡 Bonnes pratiques à adopter

### ✅ À FAIRE :
```tsx
// Utiliser les tokens de couleur
<Text color="$colorMuted">Label</Text>

// Utiliser les tokens de thème
<YStack backgroundColor="$glass" borderColor="$borderColor" />

// Utiliser les tailles d'icônes standardisées
<Icon size="$lg" color="$primary" />

// Extraire les composants réutilisables
<StatCard label="Parties" value="12" />
```

### ❌ À ÉVITER :
```tsx
// Valeurs RGBA en dur
<Text color="rgba(255,255,255,0.6)">Label</Text>

// Couleurs hex en dur
<YStack backgroundColor="#064e3b" />

// Tailles d'icônes en dur
<Icon size={20} color="#fbbf24" />

// Code dupliqué
// Copier-coller le même composant partout
```

---

## 9. 🆘 Aide et ressources

### En cas de problème :

1. **Erreur TypeScript** : Vérifier que les nouveaux tokens sont bien typés
2. **Couleur incorrecte** : Vérifier le mapping dans le thème
3. **Token non reconnu** : Redémarrer le serveur de dev

### Documentation utile :
- [Tamagui Themes](https://tamagui.dev/docs/intro/themes)
- [Tamagui Tokens](https://tamagui.dev/docs/core/configuration)
- [Tamagui Best Practices](https://tamagui.dev/docs/guides/design-systems)

---

**Prêt à commencer ? 🚀**

Je recommande de migrer **un composant à la fois** et de tester immédiatement pour valider.
Commencez par les composants UI génériques, puis remontez vers les pages.
