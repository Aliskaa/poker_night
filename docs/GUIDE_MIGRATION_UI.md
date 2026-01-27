# 🎨 GUIDE DE MIGRATION UI - POKER NIGHT

## 📋 Vue d'ensemble

Cette refonte complète de l'UI centralise **TOUTE** la configuration dans `tamagui.config.ts` et introduit un système de **composants primitifs réutilisables**.

---

## 🗂️ Structure du nouveau système

```
poker_night/
├── tamagui.config.new.ts          ← Configuration complète (à renommer)
│
├── components/
│   ├── primitives/                 ← Composants de base (NOUVEAUX)
│   │   ├── index.ts
│   │   ├── GlassCard.tsx           ← Cartes effet verre
│   │   ├── Button.tsx              ← Boutons avec variants
│   │   ├── Layout.tsx              ← Container, Row, Section, Typography
│   │   ├── Indicators.tsx          ← Badge, Dot, Avatar
│   │   └── Cards.tsx               ← Card, List, Divider
│   │
│   ├── ui/                         ← Composants UI refactorisés
│   │   ├── GlassCard.new.tsx
│   │   ├── PokerButton.new.tsx
│   │   ├── PokerBackground.new.tsx
│   │   └── DealerButton.new.tsx
│   │
│   └── game/                       ← Composants game refactorisés
│       ├── PlayerCard.new.tsx
│       └── GameHeader.new.tsx
│
└── app/(main)/game/
    └── [id].new.tsx                ← Écran exemple refactorisé
```

---

## 🚀 Installation (Étape par étape)

### 1️⃣ Installer la nouvelle configuration Tamagui

```bash
# Sauvegarder l'ancienne config
mv tamagui.config.ts tamagui.config.old.ts

# Activer la nouvelle config
mv tamagui.config.new.ts tamagui.config.ts

# Redémarrer le serveur
npm start
```

### 2️⃣ Tester les primitives

Les primitives sont déjà créées dans `components/primitives/`. Vous pouvez les utiliser immédiatement :

```tsx
import { 
    Button, 
    GlassCard, 
    Heading, 
    Body, 
    Badge 
} from '@/components/primitives';

// Exemple d'utilisation
<Button variant="primary" size="lg" onPress={handlePress}>
    Rejoindre la partie
</Button>

<GlassCard glassLevel={3} bordered hoverable>
    <Heading size="md">Mon titre</Heading>
    <Body variant="secondary">Description...</Body>
</GlassCard>
```

### 3️⃣ Migrer un composant (exemple)

**AVANT** (`components/ui/GlassCard.tsx`):
```tsx
<Card
    backgroundColor="rgba(255, 255, 255, 0.05)"
    borderColor="rgba(255, 255, 255, 0.1)"
    pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
>
    <Text color="white" fontWeight="bold">Titre</Text>
    <Text color="rgba(255,255,255,0.5)">Sous-titre</Text>
</Card>
```

**APRÈS** (avec primitives):
```tsx
import { GlassCard } from '@/components/primitives/GlassCard';
import { Heading, Caption } from '@/components/primitives/Layout';

<GlassCard glassLevel={2} bordered hoverable pressable>
    <Heading size="sm">Titre</Heading>
    <Caption>Sous-titre</Caption>
</GlassCard>
```

### 4️⃣ Migrer un écran complet

Exemple avec l'écran de jeu `[id].tsx` → `[id].new.tsx`:

**Changements clés:**
- ✅ Toutes les couleurs RGBA → tokens (`$glass2`, `$primary`, etc.)
- ✅ `<Text>` générique → `<Heading>`, `<Body>`, `<Caption>`
- ✅ `<Card>` brut → `<GlassCard>` ou `<Card variant="glass">`
- ✅ `<Button>` Tamagui → `<Button variant="primary">`

---

## 🎨 Système de tokens disponibles

### Couleurs

#### Poker spécifiques
```tsx
$pokerGreen          // Fond vert principal
$pokerGreenDark      // Vert foncé
$primary             // Or (pot, jetons) - $gold400
$pot, $potBright     // Variantes or
```

#### Palettes complètes
```tsx
// Gold (50-900)
$gold50, $gold100, ..., $gold900

// Slate (50-950) - Gris
$slate50, $slate100, ..., $slate950

// Night (50-900) - Fonds très sombres
$night50, $night100, ..., $night900

// Status
$emerald400-700      // Success
$red400-700          // Danger
$orange400-600       // Warning
$blue400-700         // Info
```

#### Glass & Overlays
```tsx
$glass1 à $glass6    // rgba(255,255,255, 0.03 → 0.15)
$overlay1 à $overlay9 // rgba(0,0,0, 0.1 → 0.9)
```

#### Texte avec opacité
```tsx
$textWhite           // #ffffff
$text95              // rgba(255,255,255, 0.95)
$text90, $text80, ..., $text10
```

#### Couleurs sémantiques (dans le thème)
```tsx
$background          // Fond principal
$backgroundCard      // Fond carte
$colorPrimary        // Texte principal
$colorSecondary      // Texte secondaire
$borderColor         // Bordure
$success, $danger, $warning, $info
```

### Espacements
```tsx
$0, $0.5, $1, $1.5, $2, ..., $96
// Exemples: $2 = 8px, $4 = 16px, $6 = 24px
```

### Rayons (border-radius)
```tsx
$0, $1, $2, ..., $12, $round
// Exemples: $5 = 12px, $7 = 16px, $round = 9999px
```

---

## 📦 Composants primitifs - API

### Button

```tsx
<Button 
    variant="primary | secondary | success | danger | warning | ghost | glass"
    size="sm | md | lg | xl"
    circular={boolean}
    icon={<Icon />}
    disabled={boolean}
    onPress={() => {}}
>
    Texte
</Button>
```

**Variants:**
- `primary`: Or avec texte sombre (actions principales)
- `secondary`: Fond gris avec bordure
- `success`: Vert (validations)
- `danger`: Rouge (suppressions)
- `warning`: Orange
- `ghost`: Transparent (actions discrètes)
- `glass`: Fond verre avec bordure

### GlassCard

```tsx
<GlassCard
    glassLevel={1-6}        // Niveau de transparence
    bordered={boolean}
    hoverable={boolean}
    pressable={boolean}
>
    {children}
</GlassCard>
```

### Typography

```tsx
<Title size="sm | md | lg | xl">Titre principal</Title>
<Heading size="sm | md | lg">Sous-titre</Heading>
<Label>LABEL EN MAJUSCULES</Label>
<Body size="sm | md | lg" variant="primary | secondary | muted | dim">
    Texte corps
</Body>
<Caption>Texte discret</Caption>
<Mono>Code monospace</Mono>
```

### Layout

```tsx
<Container>              {/* Conteneur principal avec padding */}
<Section>                {/* Section avec gap vertical */}
<Row>                    {/* Ligne horizontale alignée */}
<Grid>                   {/* Grille flexible */}
```

### Indicators

```tsx
<Badge variant="success | danger | warning | info | gold | neutral" size="sm | md | lg">
    <Icon />
    <Text>Label</Text>
</Badge>

<Dot variant="success | danger | ..." size="sm | md | lg" />

<Avatar size="xs | sm | md | lg | xl | 2xl">
    Initiales ou Image
</Avatar>
```

### Cards

```tsx
<Card variant="default | glass | elevated | outlined" padding="none | sm | md | lg">
    <CardHeader>...</CardHeader>
    <CardBody>...</CardBody>
    <CardFooter>...</CardFooter>
</Card>

<List>
    <ListItem hoverable>...</ListItem>
    <ListItem hoverable>...</ListItem>
</List>

<Divider orientation="horizontal | vertical" spacing="sm | md | lg" />
```

---

## 🔄 Plan de migration progressif

### Phase 1: Tester (1 jour)
1. Installer `tamagui.config.new.ts`
2. Redémarrer l'app
3. Vérifier que tout fonctionne encore
4. Tester quelques primitives dans un écran de test

### Phase 2: Composants UI de base (2-3 jours)
1. Remplacer `GlassCard.tsx` → `.new.tsx`
2. Remplacer `PokerButton.tsx` → `.new.tsx`
3. Remplacer `PokerBackground.tsx` → `.new.tsx`
4. Remplacer `DealerButton.tsx` → `.new.tsx`

### Phase 3: Composants de jeu (2 jours)
1. Remplacer `PlayerCard.tsx` → `.new.tsx`
2. Remplacer `GameHeader.tsx` → `.new.tsx`
3. Adapter `AddGuestFooter`, `HelpBottomSheet`, etc.

### Phase 4: Écrans principaux (3-4 jours)
1. Migrer `game/[id].tsx`
2. Migrer `create-game.tsx`
3. Migrer `lobby.tsx`
4. Migrer les onglets: `home.tsx`, `groups.tsx`, etc.

### Phase 5: Nettoyage (1 jour)
1. Supprimer les anciens fichiers `.old.tsx`
2. Renommer tous les `.new.tsx` en `.tsx`
3. Audit final des valeurs en dur restantes

**Durée totale estimée: 9-11 jours**

---

## ✅ Checklist de migration d'un composant

Pour chaque fichier à migrer:

- [ ] Lire le fichier actuel
- [ ] Identifier toutes les couleurs RGBA/hex hardcodées
- [ ] Remplacer par des tokens (`$glass2`, `$primary`, etc.)
- [ ] Remplacer `<Text>` générique par `<Heading>`, `<Body>`, `<Caption>`
- [ ] Utiliser les primitives (`<Button>`, `<GlassCard>`, etc.)
- [ ] Remplacer les espacements numériques par tokens (`$4`, `$6`)
- [ ] Tester visuellement
- [ ] Vérifier les states hover/press
- [ ] Sauvegarder en `.new.tsx`

---

## 🎯 Avantages de ce système

### 1. Centralisation totale
- ✅ **0 couleur en dur** dans les composants
- ✅ Toute la config dans `tamagui.config.ts`
- ✅ Changement de thème = 1 seul fichier

### 2. Réutilisabilité
- ✅ Composants primitifs utilisables partout
- ✅ Cohérence visuelle garantie
- ✅ Moins de code dupliqué

### 3. Maintenabilité
- ✅ Refactoring ultra-rapide
- ✅ Ajout de variants simple
- ✅ TypeScript pour l'autocomplétion

### 4. Performance
- ✅ Optimisations Tamagui automatiques
- ✅ Pas de styles inline dupliqués
- ✅ Compilation CSS au build

---

## 🆘 Dépannage

### Erreur: "Cannot find module '@/components/primitives'"

Vérifiez que `tsconfig.json` a bien:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Erreur: "Property '$glass2' does not exist"

La nouvelle config n'est pas chargée. Vérifiez:
1. `tamagui.config.ts` est bien le nouveau fichier
2. Serveur redémarré (`npm start`)
3. Cache vidé (`npx expo start -c`)

### Les couleurs semblent incorrectes

Le thème n'est peut-être pas "dark". Wrappez vos écrans:
```tsx
<Theme name="dark">
    {/* Contenu */}
</Theme>
```

---

## 📚 Ressources

- **Tamagui Docs**: https://tamagui.dev
- **Design tokens**: `tamagui.config.ts` (lignes 1-500)
- **Primitives**: `components/primitives/`
- **Exemples**: 
  - `components/game/PlayerCard.new.tsx`
  - `components/game/GameHeader.new.tsx`
  - `app/(main)/game/[id].new.tsx`

---

## 🎉 Prochaines étapes

1. **Installer** la nouvelle config
2. **Tester** l'écran de jeu refactorisé (`[id].new.tsx`)
3. **Migrer** progressivement les autres composants
4. **Profiter** d'une UI cohérente et maintenable ! 🚀
