# 🎮 Guide d'utilisation - useGameTimers

Hook personnalisé pour gérer les timers dans l'écran de jeu.

---

## 📚 Vue d'ensemble

Le hook `useGameTimers` gère **2 timers indépendants** :

1. **Timer des Blindes** (manuel) - Affiché dans le HelpBottomSheet
2. **Timer de Late Registration** (automatique) - Affiché dans le GameHeader

---

## 🔧 Utilisation

### Import

```tsx
import { useGameTimers } from '@/hooks/useGameTimers';
```

### Appel dans le composant

```tsx
export default function GameScreen() {
  const { game, loading } = useGameLogic(id);
  
  // 🎮 Hook des timers
  const { 
    // Timer des blindes
    timerSeconds,
    isTimerRunning,
    toggleTimer,
    resetTimer,
    
    // Timer late reg
    lateRegSeconds 
  } = useGameTimers(game);
  
  // ... reste du code
}
```

---

## 📋 API du Hook

### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `game` | `Game \| null` | L'objet game actuel (peut être null pendant le chargement) |

### Retour

#### Timer des Blindes (Manuel)

| Propriété | Type | Description |
|-----------|------|-------------|
| `timerSeconds` | `number` | Nombre de secondes restantes |
| `isTimerRunning` | `boolean` | Si le timer est en cours d'exécution |
| `toggleTimer` | `() => void` | Démarre/met en pause le timer |
| `resetTimer` | `() => void` | Réinitialise le timer à la valeur par défaut |
| `setTimerSeconds` | `(n: number) => void` | Change manuellement le temps (rarement utilisé) |
| `setIsTimerRunning` | `(b: boolean) => void` | Change l'état running (rarement utilisé) |

#### Timer Late Registration (Automatique)

| Propriété | Type | Description |
|-----------|------|-------------|
| `lateRegSeconds` | `number \| null` | Secondes restantes avant fermeture late reg, ou `null` si illimité/fermé |

---

## 🎯 Exemples d'utilisation

### Exemple 1 : Afficher le timer des blindes

```tsx
<HelpBottomSheet
  isOpen={isHelpOpen}
  onOpenChange={setIsHelpOpen}
  timerSeconds={timerSeconds}
  isTimerRunning={isTimerRunning}
  onToggleTimer={toggleTimer}
  onResetTimer={resetTimer}
/>
```

### Exemple 2 : Afficher le late reg timer

```tsx
<GameHeader
  totalPot={game.totalPot}
  lateRegSeconds={lateRegSeconds}
  // ... autres props
/>
```

### Exemple 3 : Formatter le temps

```tsx
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Utilisation
<Text>{formatTime(timerSeconds)}</Text>  // "15:30"
<Text>{formatTime(lateRegSeconds ?? 0)}</Text>  // "45:00"
```

---

## ⚙️ Configuration

### Durée par défaut du timer des blindes

Définie dans le hook :
```typescript
const DEFAULT_BLIND_TIMER = 1200; // 20 minutes (1200 secondes)
```

**Mais** le timer utilise en priorité la valeur de la config du jeu :
```typescript
game?.config?.defaultTimeBlindDuration ?? DEFAULT_BLIND_TIMER
```

### Late Registration

Le timer se base sur :
- `game.createdAt` : Date de création de la partie
- `game.config.lateRegLimit` : Limite en **minutes** (0 = illimité)

**Exemple :**
```typescript
// Partie créée à 20h00
// Late reg limit = 60 minutes
// → Late reg se ferme à 21h00

// Partie créée à 20h00
// Late reg limit = 0
// → lateRegSeconds sera null (pas de limite)
```

---

## 🔍 Comment ça marche ?

### Timer des Blindes (Manuel)

1. **Initialisation** : Prend la valeur de `game.config.defaultTimeBlindDuration`
2. **Démarrage** : Appel à `toggleTimer()` ou `setIsTimerRunning(true)`
3. **Décompte** : Diminue de 1 seconde toutes les 1000ms
4. **Arrêt** : 
   - Automatique quand arrive à 0
   - Manuel via `toggleTimer()` ou `setIsTimerRunning(false)`
5. **Reset** : `resetTimer()` remet à la valeur de départ

### Timer Late Registration (Automatique)

1. **Initialisation** : Calcule automatiquement au montage
2. **Détection** : Supporte plusieurs formats de Timestamp Firestore
3. **Calcul** : `endTime = createdAt + (lateRegLimit × 60 × 1000)`
4. **Mise à jour** : Toutes les secondes jusqu'à 0
5. **Arrêt** : Automatique quand atteint 0

**Formats de date supportés :**
```typescript
// Firestore Timestamp avec toDate()
{ toDate: () => Date }

// Firestore Timestamp avec seconds
{ seconds: 1706380800 }

// Date JavaScript standard
new Date()
```

---

## 🐛 Débogage

### Le timer des blindes ne démarre pas ?

**Vérifications :**
1. `isTimerRunning` est-il `true` ?
2. `timerSeconds` est-il > 0 ?
3. Avez-vous appelé `toggleTimer()` ?

**Debug :**
```tsx
console.log('Timer seconds:', timerSeconds);
console.log('Is running:', isTimerRunning);
```

### Le late reg timer affiche null ?

**Raisons possibles :**
1. `game.config.lateRegLimit === 0` (late reg illimité)
2. Le jeu n'est pas encore chargé (`game === null`)
3. Le temps est écoulé

**Debug :**
```tsx
console.log('Game:', game);
console.log('Late reg limit:', game?.config.lateRegLimit);
console.log('Late reg seconds:', lateRegSeconds);
```

### Le late reg timer ne se met pas à jour ?

**Solution :**
- Vérifiez que `game.createdAt` existe et est bien un Timestamp
- Vérifiez les dépendances du useEffect : `[game?.createdAt, game?.config.lateRegLimit, game?.id]`

---

## ✅ Bonnes Pratiques

### ✅ À FAIRE

```tsx
// Utiliser les fonctions helper
<Button onPress={toggleTimer}>Play/Pause</Button>
<Button onPress={resetTimer}>Reset</Button>

// Vérifier null pour late reg
{lateRegSeconds !== null && (
  <Text>{formatTime(lateRegSeconds)}</Text>
)}

// Passer game au hook (même si null au début)
const timers = useGameTimers(game);
```

### ❌ À ÉVITER

```tsx
// ❌ Ne pas modifier directement les states
setTimerSeconds(0); // Utilisez resetTimer() à la place
setIsTimerRunning(!isTimerRunning); // Utilisez toggleTimer()

// ❌ Ne pas oublier le check null
<Text>{formatTime(lateRegSeconds)}</Text> // Erreur si null !

// ❌ Ne pas recréer les intervalles
useEffect(() => {
  const interval = setInterval(...); // Le hook le fait déjà !
}, [timerSeconds]);
```

---

## 🎨 Améliorations Futures

### Fonctionnalités potentielles

1. **Pause du late reg timer** (si besoin)
2. **Notification sonore** quand un timer se termine
3. **Vibration** à la fin du timer
4. **Persistance** du timer des blindes (localStorage)
5. **Historique** des niveaux de blindes passés

### Exemple : Notification sonore

```tsx
// Dans le hook
useEffect(() => {
  if (timerSeconds === 0 && isTimerRunning) {
    // Jouer un son
    playSound('timer-end.mp3');
    // Vibrer
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}, [timerSeconds, isTimerRunning]);
```

---

## 📚 Références

**Fichiers liés :**
- Hook : `hooks/useGameTimers.ts`
- Utilisation : `app/(main)/game/[id].tsx`
- Components : `GameHeader.tsx`, `HelpBottomSheet.tsx`
- Types : `types/Game.ts`

**Documentation :**
- [React useEffect](https://react.dev/reference/react/useEffect)
- [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
- [Firestore Timestamps](https://firebase.google.com/docs/reference/js/firestore_.timestamp)

---

**Dernière mise à jour :** 27 janvier 2026
