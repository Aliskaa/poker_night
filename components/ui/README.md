# 🎨 UI Primitives - Poker Night

Bibliothèque de composants UI de base du design system.

## 📦 Installation

```tsx
import { StatusBadge, ChipStack, CountdownBadge, FAB, Stepper } from '@/components/ui'
```

---

## 🏷️ StatusBadge

Badge de statut pour les joueurs (Actif, Éliminé, Rebuy).

### Usage

```tsx
<StatusBadge status="ACTIVE" />
<StatusBadge status="ELIMINATED" />
<StatusBadge status="REBUY" />
<StatusBadge status="ACTIVE" showIcon={false} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'ACTIVE' \| 'ELIMINATED' \| 'REBUY'` | - | **Required** - Statut du joueur |
| `showIcon` | `boolean` | `true` | Afficher l'icône |

---

## 💰 ChipStack

Affichage formaté de montants (jetons, pot, stack).

### Usage

```tsx
<ChipStack amount={250} variant="pot" />
<ChipStack amount={1500} variant="stack" size="lg" />
<ChipStack amount={100} currency="$" showIcon={false} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amount` | `number` | - | **Required** - Montant à afficher |
| `variant` | `'default' \| 'pot' \| 'stack' \| 'rebuy'` | `'default'` | Style visuel |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du composant |
| `showIcon` | `boolean` | `true` | Afficher l'icône de jetons |
| `currency` | `string` | `'€'` | Symbole de devise |

### Variants

- **default** : Gris transparent (montants neutres)
- **pot** : Or (pot principal)
- **stack** : Vert (stack d'un joueur actif)
- **rebuy** : Orange (recave)

---

## ⏱️ CountdownBadge

Compte à rebours avec détection automatique d'urgence.

### Usage

```tsx
<CountdownBadge seconds={300} />
<CountdownBadge seconds={45} label="Late Reg" />
<CountdownBadge seconds={600} variant="warning" />
<CountdownOrClosed seconds={0} closedLabel="Fermé" />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seconds` | `number` | - | **Required** - Secondes restantes |
| `variant` | `'default' \| 'warning' \| 'urgent'` | auto | Style (auto-détecté si non fourni) |
| `label` | `string` | - | Label optionnel avant le timer |
| `showIcon` | `boolean` | `true` | Afficher l'icône |
| `autoDetectUrgent` | `boolean` | `true` | Détection auto du variant |
| `urgentThreshold` | `number` | `60` | Seuil urgent (secondes) |
| `warningThreshold` | `number` | `300` | Seuil warning (secondes) |

### Comportement

- **< 60s** : Variant `urgent` (rouge, pulse)
- **< 300s** : Variant `warning` (orange)
- **≥ 300s** : Variant `default` (bleu)

---

## 🎯 FAB (Floating Action Button)

Bouton flottant pour action principale.

### Usage

```tsx
import { Play } from '@tamagui/lucide-icons'

<FAB onPress={() => router.push('/create-game')} />
<FAB icon={<Play size={28} />} position="bottom-center" />
<FABWithLabel label="Créer" onPress={onCreate} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `function` | - | **Required** - Action au clic |
| `icon` | `ReactElement` | `<Plus />` | Icône personnalisée |
| `position` | `'bottom-right' \| 'bottom-center' \| 'bottom-left'` | `'bottom-right'` | Position à l'écran |
| `offset` | `number` | `0` | Offset en pixels depuis le bord |
| `label` | `string` | - | Texte (FABWithLabel uniquement) |

---

## 📊 Stepper

Indicateur de progression multi-étapes.

### Usage

```tsx
import { useStepper, Stepper, StepContainer, Step } from '@/components/ui'

function CreateGameWizard() {
  const { currentStep, nextStep, prevStep, isLastStep } = useStepper(4)
  
  return (
    <>
      <Stepper 
        currentStep={currentStep} 
        totalSteps={4}
        labels={['Type', 'Config', 'Joueurs', 'Lancement']}
      />
      
      <StepContainer currentStep={currentStep}>
        <Step title="Type de partie">
          {/* Contenu step 1 */}
        </Step>
        <Step title="Configuration">
          {/* Contenu step 2 */}
        </Step>
        {/* ... */}
      </StepContainer>
      
      <Button onPress={nextStep} disabled={isLastStep}>
        Suivant
      </Button>
    </>
  )
}
```

### Stepper Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentStep` | `number` | - | **Required** - Étape actuelle (1-indexed) |
| `totalSteps` | `number` | - | **Required** - Nombre total d'étapes |
| `labels` | `string[]` | `[]` | Labels optionnels pour chaque étape |
| `onStepPress` | `(step: number) => void` | - | Callback au clic sur une étape |
| `allowStepNavigation` | `boolean` | `false` | Permettre de cliquer sur les étapes |

### useStepper Hook

```tsx
const {
  currentStep,    // Étape actuelle
  nextStep,       // Passer à l'étape suivante
  prevStep,       // Revenir à l'étape précédente
  goToStep,       // Aller à une étape spécifique
  isFirstStep,    // Booléen : est-ce la première étape ?
  isLastStep,     // Booléen : est-ce la dernière étape ?
} = useStepper(4, 1)  // (totalSteps, initialStep)
```

---

## 🎨 Showcase

Pour voir tous les composants en action :

```tsx
import { UIShowcase } from '@/components/ui/UIShowcase'

<UIShowcase />
```

---

## 💡 Exemples de combinaisons

### Carte joueur avec status et chips

```tsx
<YStack 
  backgroundColor="$glass2" 
  borderColor="$glass4"
  borderWidth={1}
  padding="$4"
  gap="$3"
>
  <XStack justifyContent="space-between">
    <Text>John Doe</Text>
    <StatusBadge status="ACTIVE" />
  </XStack>
  
  <XStack gap="$3">
    <ChipStack amount={1500} variant="stack" size="sm" />
    <ChipStack amount={200} variant="rebuy" size="sm" />
  </XStack>
</YStack>
```

### En-tête de partie avec pot et countdown

```tsx
<YStack alignItems="center" gap="$3">
  <ChipStack amount={5250} variant="pot" size="lg" />
  <CountdownBadge seconds={180} label="Late Reg" />
</YStack>
```

---

## 📝 Notes

- Tous les composants utilisent le design system Tamagui
- Animations natives via `animation="quick"` ou `animation="bouncy"`
- Support complet du thème dark/light
- TypeScript avec types exportés
