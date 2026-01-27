# 🎯 REFONTE UX/UI COMPLÈTE - POKER NIGHT

> **Lead Product Designer - Analyse & Recommandations**  
> Date : Janvier 2026

---

## 📋 SOMMAIRE

1. [État des lieux & Diagnostic](#1-état-des-lieux--diagnostic)
2. [Architecture UX Globale](#2-architecture-ux-globale)
3. [Design System Structuré](#3-design-system-structuré)
4. [Écrans Clés Spécifiés](#4-écrans-clés-spécifiés)
5. [Recommandations de Refactoring](#5-recommandations-de-refactoring)
6. [Exemples d'Implémentation](#6-exemples-dimplémentation)

---

## 1. ÉTAT DES LIEUX & DIAGNOSTIC

### ✅ Points Forts Actuels

- **Design system Tamagui excellent** : `tamagui.config.ts` très complet avec tokens cohérents
- **Palette poker premium** : vert profond, gold, glass effects bien pensés
- **Composants primitifs** : Button, Cards avec variants appropriés
- **Architecture de navigation** : Tab navigation bien structurée

### ⚠️ Problèmes UX/UI Identifiés

#### Navigation & Architecture
- **Bottom tab surchargé** : 5 tabs (Home, Groups, Play, Leaderboard, Profile) trop chargé
- **Action "Play" centrale** : Bon concept mais mal intégré (bouton rond au centre)
- **Redondance** : "Home" et "Play" se chevauchent conceptuellement

#### Écrans & Flows
- **CreateGame trop technique** : Configuration exposée trop tôt, manque de progressive disclosure
- **GameScreen complexe** : Trop d'informations simultanées, hiérarchie visuelle faible
- **Lobby manquant de contexte** : Pas assez de feedback visuel sur l'état de la partie

#### Composants
- **Inconsistance glass/card** : Mélange de styles (old/new) à unifier
- **PlayerCard surchargée** : Trop d'actions simultanées visible
- **Manque de feedback** : États de chargement, erreurs, succès peu visibles

---

## 2. ARCHITECTURE UX GLOBALE

### 2.1. Personas

#### 🎯 Persona 1 : **Marc, Organisateur Régulier**
- **Âge** : 32 ans, amateur de poker entre amis
- **Fréquence** : 2-3 parties/mois avec 6-8 amis
- **Objectifs** : 
  - Créer une partie rapidement (< 1 minute)
  - Gérer les buy-ins et rebuy facilement
  - Partager un lien pour inviter
- **Pain points** : Configurations trop techniques, pas de templates

#### 🃏 Persona 2 : **Sarah, Joueuse Passionnée**
- **Âge** : 28 ans, joue régulièrement en club
- **Fréquence** : 4-6 parties/mois
- **Objectifs** :
  - Suivre ses statistiques (ROI, ITM%)
  - Rejoindre des parties facilement
  - Comparer avec d'autres joueurs
- **Pain points** : Stats peu visibles, historique difficile d'accès

#### 🏆 Persona 3 : **Thomas, Organisateur de Tournois**
- **Âge** : 40 ans, anime un club local
- **Fréquence** : 1-2 tournois/semaine
- **Objectifs** :
  - Structures de blinds personnalisées
  - Gestion multi-tables (futur)
  - Payouts complexes
- **Pain points** : Manque de flexibilité, pas d'export

### 2.2. Navigation Redessinée

#### Structure Recommandée : **4 Tabs + 1 FAB**

```
┌─────────────────────────────────────┐
│         POKER NIGHT                 │
├─────────────────────────────────────┤
│                                     │
│         [CONTENU]                   │
│                                     │
│                 [FAB] ←─── Create   │
├─────────────────────────────────────┤
│  🏠     👥      🏆      👤          │
│ Home  Tables  Stats  Profile        │
└─────────────────────────────────────┘
```

**Justification :**
- **Home** : Dashboard centralisé (parties actives, invitations, quick actions)
- **Tables** : Remplace "Groups" → Focus sur les parties (en cours, à venir, terminées)
- **Stats** : Remplace "Leaderboard" → Vos stats + classement global
- **Profile** : Paramètres, préférences, historique
- **FAB (Floating Action Button)** : Action principale "Créer une partie" toujours accessible

### 2.3. User Flows Principaux

#### Flow 1 : **Créer une Partie (Mode Rapide)**

```
Home
  ↓ [FAB Create]
Quick Setup Modal
  ├── Template : "Entre amis" | "Club" | "Personnalisé"
  ├── Buy-in : 5€ | 10€ | 20€ | [Custom]
  └── [Créer] → Lobby (invitation joueurs)
Lobby
  ├── Partager lien / QR Code
  ├── Liste joueurs (avec live updates)
  └── [Démarrer] → Game Screen
```

**Améliorations :**
- **1 tap de moins** : Templates pré-configurés
- **Progressive disclosure** : Config avancée masquée par défaut
- **Feedback visuel** : Joueurs rejoignent en temps réel

#### Flow 2 : **Rejoindre une Partie**

```
Home
  ↓ [Carte "Invitations"]
Game Invitation Card
  ├── Nom hôte, buy-in, joueurs inscrits
  └── [Rejoindre] → Lobby (mode joueur)
  
OU

Tables Tab
  ↓ [Scan QR Code]
QR Scanner → Auto-join → Lobby
```

#### Flow 3 : **Gérer une Partie en Cours**

```
Game Screen
├── Header : Pot, Niveau, Timer, Actions (Pause/Play/Settings)
├── Players Grid : Stacks visuels, statuts
├── Quick Actions Bar : Rebuy, Eliminate, Add-on
└── Footer : [Next Level] | [End Game]

Actions rapides :
- Long press joueur → Rebuy / Eliminate
- Swipe left → Eliminate
- Double tap → Rebuy
```

**Optimisations :**
- **Gestes tactiles** : Swipe, long press pour actions fréquentes
- **Confirmations intelligentes** : Seulement pour actions critiques (End game)
- **Feedback visuel** : Animations chips, confettis pour victoires

#### Flow 4 : **Consulter Stats**

```
Stats Tab
├── Overview Card : Parties jouées, Gains nets, ITM%
├── Graphiques : Évolution profit, Buy-ins distribution
├── Filters : Période (7j, 30j, All time)
└── Leaderboard : Top players (switchable)

Tap joueur → Profile détaillé
  ├── Head-to-head stats
  ├── Historique parties communes
  └── Tendances (hot streak, cold streak)
```

---

## 3. DESIGN SYSTEM STRUCTURÉ

### 3.1. Tokens Améliorés (Extensions Tamagui)

#### Nouveaux Tokens à Ajouter

```typescript
// DANS tamagui.config.ts

tokens: {
  // ... existant ...
  
  // ── POKER CHIPS COLORS (pour stacks visuels) ──
  chip: {
    white: '#ffffff',      // 1€
    red: '#ef4444',        // 5€
    blue: '#3b82f6',       // 10€
    green: '#10b981',      // 25€
    black: '#0f172a',      // 100€
    purple: '#a855f7',     // 500€
    orange: '#f97316',     // 1000€
    pink: '#ec4899',       // 5000€
  },
  
  // ── STATUS BADGES ──
  statusColor: {
    active: '#10b981',     // En jeu
    waiting: '#f59e0b',    // En attente
    eliminated: '#ef4444', // Éliminé
    paid: '#a855f7',       // Payé (ITM)
  },
  
  // ── GAME STATES ──
  gameState: {
    waiting: '#f59e0b',
    playing: '#10b981',
    paused: '#f97316',
    finished: '#64748b',
  },
}
```

### 3.2. Composants UI Génériques

#### Hiérarchie de Composants

```
primitives/
├── Button.tsx          ✅ (existant, à enrichir)
├── Input.tsx           🆕 (TextInput, NumberInput, Search)
├── Select.tsx          🆕 (Dropdown, BottomSheet picker)
├── Toggle.tsx          🆕 (Switch, Checkbox, Radio)
├── Badge.tsx           🆕 (Status, Count, Label)
├── Avatar.tsx          🆕 (Player avatar avec fallback)
├── Card.tsx            ✅ (unifier old/new)
├── Modal.tsx           🆕 (BottomSheet, FullScreen)
├── Feedback.tsx        🆕 (Toast, Snackbar, Skeleton)
└── Layout.tsx          ✅ (Container, Section, etc.)
```

#### Spécifications Clés

##### 🔘 Button (Extensions)

```tsx
// Variants additionnels
variant: {
  // ... existants (primary, secondary, etc.) ...
  
  // Nouveau : bouton chip-like
  chip: {
    backgroundColor: '$chip',
    color: '$white',
    borderRadius: '$round',
    paddingHorizontal: '$5',
    minHeight: 44,
  },
  
  // Nouveau : bouton fab
  fab: {
    width: 64,
    height: 64,
    borderRadius: '$round',
    backgroundColor: '$primary',
    position: 'absolute',
    bottom: 80,
    right: 20,
    shadowColor: '$primary',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
}

size: {
  xs: { height: 32, fontSize: '$2', paddingHorizontal: '$3' },
  sm: { height: 40, fontSize: '$3', paddingHorizontal: '$4' },
  md: { height: 48, fontSize: '$4', paddingHorizontal: '$5' },
  lg: { height: 56, fontSize: '$5', paddingHorizontal: '$6' },
  xl: { height: 64, fontSize: '$6', paddingHorizontal: '$7' },
}
```

##### 🏷️ Badge (Nouveau Composant)

```tsx
// types/components.ts
type BadgeProps = {
  variant: 'status' | 'count' | 'label' | 'chip';
  status?: 'active' | 'waiting' | 'eliminated' | 'paid';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// Usage
<Badge variant="status" status="active">En jeu</Badge>
<Badge variant="count">+5</Badge>
<Badge variant="chip" color="$chip.red">5€</Badge>
```

##### 👤 Avatar (Nouveau Composant)

```tsx
type AvatarProps = {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'eliminated';
  showBorder?: boolean;
}

// Fonctionnalités :
- Fallback initiales (ex: "MC" pour Marc Connors)
- Couleur de fond générée from hash(name)
- Indicateur de statut (point vert/rouge)
- Support image remote
```

### 3.3. Composants Métier Poker

#### Nouveaux Composants Essentiels

```
components/poker/
├── ChipStack.tsx       🆕 Visualisation stack (jetons empilés)
├── BlindLevel.tsx      🆕 Affichage niveau blind actuel
├── Timer.tsx           🆕 Compte à rebours niveau
├── PotDisplay.tsx      🆕 Pot total animé
├── PlayerGrid.tsx      🆕 Grille joueurs avec stacks
├── PayoutTable.tsx     🆕 Tableau des payouts
├── HandRanking.tsx     ✅ (existant, à améliorer)
└── QRCodeShare.tsx     🆕 Partage QR code partie
```

##### 💰 ChipStack Component

```tsx
// Visualise un stack de jetons en chips empilés
type ChipStackProps = {
  amount: number;
  maxChips?: number; // Limite affichage (ex: 5 chips max)
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Rendu visuel :
┌─────┐
│ 💰  │ ← Top chip (couleur selon montant)
├─────┤
│ 💰  │ ← Middle chips
├─────┤
│ 💰  │ ← Base
└─────┘
  250€  ← Label montant
```

##### ⏱️ Timer Component

```tsx
type TimerProps = {
  seconds: number;
  isRunning: boolean;
  onComplete?: () => void;
  variant?: 'circular' | 'linear' | 'numeric';
  warningAt?: number; // Devient orange à X secondes
  dangerAt?: number;  // Devient rouge à X secondes
}

// Variantes :
- Circular : Anneau progressif (comme Pomodoro)
- Linear : Barre horizontale
- Numeric : Simplement "05:32" avec couleurs
```

##### 🎯 BlindLevel Component

```tsx
type BlindLevelProps = {
  small: number;
  big: number;
  ante?: number;
  level: number;
  nextLevel?: { small: number; big: number };
}

// Rendu :
┌─────────────────────┐
│  NIVEAU 3           │
│  ━━━━━━━━━━━━━━━━  │
│                     │
│  SB: 50   BB: 100   │
│  Ante: 10           │
│                     │
│  ▼ Prochain: 100/200│
└─────────────────────┘
```

---

## 4. ÉCRANS CLÉS SPÉCIFIÉS

### 4.1. 🏠 Home Screen (Dashboard)

#### Objectif
Point d'entrée principal : vision globale des parties actives, invitations, actions rapides.

#### Hiérarchie Visuelle

```
┌────────────────────────────────────┐
│ 👋 Salut Marc                     ⚙│ ← Header minimal
├────────────────────────────────────┤
│                                    │
│  🔴 LIVE (2)                       │ ← Section parties actives
│  ┌──────────────────┐              │
│  │ 🎰 Soirée Poker  │ ─┐           │
│  │ Pot: 450€ • 6/8  │  │← Carousel │
│  └──────────────────┘  │           │
│  ┌──────────────────┐  │           │
│  │ 🏆 Tournoi Club  │ ─┘           │
│  └──────────────────┘              │
│                                    │
│  📬 INVITATIONS (1)                │
│  ┌────────────────────────────┐   │
│  │ Thomas t'invite              │  │
│  │ Buy-in: 20€ • 5 joueurs     │  │
│  │ [Rejoindre] [Refuser]       │  │
│  └────────────────────────────┘   │
│                                    │
│  ⚡ ACTIONS RAPIDES                │
│  ┌─────────┐ ┌─────────┐          │
│  │ 🔍 Join │ │ 👥 Clubs│          │
│  └─────────┘ └─────────┘          │
│                                    │
│                     [FAB +] ←─────│ Floating Action Button
└────────────────────────────────────┘
```

#### Composants Utilisés
- `HomeHeader` : Nom utilisateur + icône settings
- `LiveGameCarousel` : Cartes parties en cours (swipeable)
- `InvitationCard` : Carte invitation avec actions
- `QuickActionGrid` : Grille 2x2 actions rapides
- `FAB` : Bouton création partie

#### Comportement
- **Pull to refresh** : Actualise les parties
- **Tap carte live** : Ouvre la partie
- **Swipe invitation** : Accepter (→) / Refuser (←)
- **Long press FAB** : Affiche templates rapides

---

### 4.2. ➕ Create Game (Modal Bottom Sheet)

#### Objectif
Créer une partie en < 30 secondes avec templates, ou personnaliser si besoin.

#### Structure (Progressive Disclosure)

```
┌────────────────────────────────────┐
│ ───                              ×  │ ← Swipe indicator + close
│                                    │
│  Nouvelle Partie                   │
│                                    │
│  📋 TEMPLATES                      │
│  ┌──────────────────┐              │
│  │ 🎲 Entre Amis    │ ─┐           │
│  │ 10€ • 15min • 3h │  │           │
│  └──────────────────┘  │           │
│  ┌──────────────────┐  │← Templates│
│  │ 🏆 Club Standard │  │           │
│  │ 20€ • 20min • 4h │ ─┘           │
│  └──────────────────┘              │
│                                    │
│  ⚙️ Personnalisé                   │
│                                    │
│  Buy-in                            │
│  [5€] [10€] [20€] [50€] [...]     │
│                                    │
│  ▼ Configuration avancée           │ ← Accordéon (collapsed)
│                                    │
│  ──────────────────────────────── │
│  │            [Créer]            │ │
│  ──────────────────────────────── │
└────────────────────────────────────┘
```

#### Améliorations vs Existant
- **Templates** : "Entre amis", "Club Standard", "Tournoi rapide"
- **Buy-in visuel** : Chips colorés au lieu de texte
- **Config avancée** : Masquée par défaut (accordéon)
- **Validation temps réel** : Erreurs inline
- **Preview** : Résumé avant création

---

### 4.3. 🎮 Game Screen (Partie en Cours)

#### Objectif
Gérer une partie : suivre pot, stacks, timer, actions joueurs.

#### Layout Optimisé

```
┌────────────────────────────────────┐
│ ← Soirée Poker             ⋮ 📤  │ ← Header : Nom + Menu + Share
├────────────────────────────────────┤
│                                    │
│  💰 POT : 450€                     │ ← Pot Display (gros, animé)
│                                    │
├────────────────────────────────────┤
│                                    │
│  ⏱ Niveau 3       ⏸ 12:34        │ ← Timer + Niveau
│  SB: 50 / BB: 100 / Ante: 10      │
│                                    │
├────────────────────────────────────┤
│                                    │
│  JOUEURS (6)                  All In│ ← Filters rapides
│                                    │
│  ┌────────────────────────────┐   │
│  │ 👤 Marc      💰 2,500€    ✓│   │ ← PlayerCard actif
│  │    Dealer • 2 Buy-ins      │   │
│  └────────────────────────────┘   │
│                                    │
│  ┌────────────────────────────┐   │
│  │ 👤 Sarah     💰 1,800€    ✓│   │
│  │    3 Buy-ins               │   │
│  └────────────────────────────┘   │
│                                    │
│  ┌────────────────────────────┐   │
│  │ 👤 Thomas    💰    0€     ✕│   │ ← Éliminé (grisé)
│  │    Rank: 6 • 22:15         │   │
│  └────────────────────────────┘   │
│                                    │
│  [+ Ajouter Joueur]                │
│                                    │
├────────────────────────────────────┤
│  [⏩ Niveau Suivant] [🏁 Terminer] │ ← Footer actions principales
└────────────────────────────────────┘
```

#### Actions Joueur (Swipe / Long Press)

```
Swipe LEFT sur PlayerCard → [Éliminer]
Swipe RIGHT sur PlayerCard → [Rebuy]
Long Press → Menu contextuel :
  ├── Rebuy
  ├── Éliminer
  ├── Modifier Stack
  └── Notes
```

#### Composants Utilisés
- `GameHeader` (refactorisé)
- `PotDisplay` : Gros chiffre animé
- `BlindLevel` + `Timer` : Composants séparés
- `PlayerCard` : Simplifié, gestes tactiles
- `QuickActionsBar` : Sticky footer

---

### 4.4. 📊 Stats Screen

#### Objectif
Vue d'ensemble performances + classement + comparaisons.

#### Structure Tabs

```
┌────────────────────────────────────┐
│  [Mes Stats] [Leaderboard]         │ ← Tabs switcher
├────────────────────────────────────┤
│                                    │
│  VUE D'ENSEMBLE                    │
│  ┌────────────────────────────┐   │
│  │  Parties: 42  │ ROI: +15%  │   │
│  │  ITM: 38%     │ Gains: 850€│   │
│  └────────────────────────────┘   │
│                                    │
│  📈 ÉVOLUTION                      │
│  ┌────────────────────────────┐   │
│  │     Graph Profit            │   │
│  │      /\  /\                 │   │
│  │     /  \/  \__              │   │
│  └────────────────────────────┘   │
│                                    │
│  🏆 MEILLEURES PERF                │
│  ┌────────────────────────────┐   │
│  │ 🥇 Plus gros gain: 250€    │   │
│  │ 🔥 Série victoires: 5      │   │
│  └────────────────────────────┘   │
│                                    │
│  📊 DISTRIBUTION                   │
│  ┌────────────────────────────┐   │
│  │  Buy-in moyen: 18€         │   │
│  │  Durée moyenne: 3h12       │   │
│  └────────────────────────────┘   │
│                                    │
└────────────────────────────────────┘
```

#### Tab Leaderboard

```
┌────────────────────────────────────┐
│  [Mes Stats] [Leaderboard]         │
├────────────────────────────────────┤
│                                    │
│  🏅 TOP JOUEURS                    │
│  Filtres: [7j] [30j] [Tout]        │
│                                    │
│  1. 👤 Marc       +850€  42 games  │ ← Vous (highlight)
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  2. 👤 Sarah      +720€  38 games  │
│  3. 👤 Thomas     +650€  51 games  │
│  4. 👤 Julie      +520€  29 games  │
│  ...                               │
│                                    │
│  [Voir mon classement détaillé]    │
│                                    │
└────────────────────────────────────┘
```

---

### 4.5. 👥 Tables Screen (ex-Groups)

#### Objectif
Gérer les parties : en cours, programmées, historique.

#### Structure Filtres + Liste

```
┌────────────────────────────────────┐
│  Mes Parties                      +│ ← Header + Create
├────────────────────────────────────┤
│                                    │
│  [🔴 Live] [📅 À venir] [✅ Passées]│ ← Filters tabs
│                                    │
│  AUJOURD'HUI                       │
│  ┌────────────────────────────┐   │
│  │ 🎰 Soirée Poker     LIVE   │   │
│  │ Pot: 450€ • 6/8 joueurs    │   │
│  │ 🕐 Démarré il y a 1h32     │   │
│  └────────────────────────────┘   │
│                                    │
│  DEMAIN                            │
│  ┌────────────────────────────┐   │
│  │ 🏆 Tournoi Club             │   │
│  │ 20€ • 12 inscrits          │   │
│  │ 🕐 Demain 19h00            │   │
│  └────────────────────────────┘   │
│                                    │
│  HIER                              │
│  ┌────────────────────────────┐   │
│  │ 🎲 Quick Game      TERMINÉ │   │
│  │ 1. Marc • 2. Sarah • 3...  │   │
│  │ Durée: 2h45 • Pot: 200€    │   │
│  └────────────────────────────┘   │
│                                    │
└────────────────────────────────────┘
```

#### GameCard States

```tsx
// 3 états visuels distincts
type GameCardState = 'live' | 'scheduled' | 'finished';

LIVE :
- Border glow gold animé
- Badge "LIVE" pulsant
- Tap → Rejoint partie

SCHEDULED :
- Style glass standard
- Countdown "Dans 23h"
- Tap → Détails + Modifier

FINISHED :
- Opacity 0.7, grisé
- Classement top 3
- Tap → Résumé détaillé
```

---

## 5. RECOMMANDATIONS DE REFACTORING

### 5.1. Structure de Dossiers

#### Avant (Problèmes)
```
components/
├── create-game/          ← Mélange logique/UI
├── game/                 ← Trop de responsabilités
├── primitives/           ✅ OK mais incomplet
├── ui/                   ⚠️ Redondance avec primitives
└── home/                 ← Spécifique à 1 écran
```

#### Après (Recommandé)
```
components/
├── primitives/           ← UI pure (Button, Input, Card, etc.)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── index.ts
│
├── poker/                ← Composants métier réutilisables
│   ├── ChipStack.tsx
│   ├── BlindLevel.tsx
│   ├── Timer.tsx
│   ├── PotDisplay.tsx
│   ├── PlayerCard.tsx
│   ├── PayoutTable.tsx
│   └── QRCodeShare.tsx
│
├── features/             ← Composants par feature (colocation)
│   ├── game/
│   │   ├── GameHeader.tsx
│   │   ├── PlayerGrid.tsx
│   │   ├── QuickActionsBar.tsx
│   │   └── GamePodium.tsx
│   │
│   ├── create/
│   │   ├── TemplateSelector.tsx
│   │   ├── ConfigForm.tsx
│   │   └── GamePreview.tsx
│   │
│   ├── home/
│   │   ├── LiveGameCarousel.tsx
│   │   ├── InvitationCard.tsx
│   │   └── QuickActionGrid.tsx
│   │
│   └── stats/
│       ├── OverviewCard.tsx
│       ├── ProfitChart.tsx
│       └── LeaderboardList.tsx
│
└── layouts/              ← Layouts réutilisables
    ├── PokerBackground.tsx
    ├── PageContainer.tsx
    └── BottomSheet.tsx
```

### 5.2. Fichiers à Supprimer / Refactorer

#### ❌ À Supprimer
```
components/ui/GlassCard.old.tsx
components/ui/PokerButton.old.tsx
components/ui/DealerButton.old.tsx
components/ui/PokerBackground.old.tsx
components/game/GameHeader.old.tsx
components/game/PlayerCard.old.tsx
app/(main)/game/[id].old.tsx
tamagui.config.old.ts
```

#### 🔄 À Refactorer (Unifier)

##### GlassCard → Card (primitives)
**Problème** : 2 versions (old/new) avec styles différents

**Solution** :
```tsx
// components/primitives/Card.tsx
export const Card = styled(View, {
  name: 'Card',
  backgroundColor: '$glass3',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$5',
  padding: '$4',
  
  variants: {
    variant: {
      glass: {
        backgroundColor: '$glass3',
        backdropFilter: 'blur(12px)', // Webkit only
      },
      solid: {
        backgroundColor: '$surface2',
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
      },
    },
    elevation: {
      none: {},
      sm: { shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
      md: { shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
      lg: { shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
    },
  },
  
  defaultVariants: {
    variant: 'glass',
    elevation: 'sm',
  },
})
```

##### PlayerCard : Simplifier

**Problème** : Trop d'actions, surcharge visuelle

**Solution** :
```tsx
// components/poker/PlayerCard.tsx
type PlayerCardProps = {
  player: Player;
  onSwipeLeft?: () => void;    // Eliminate
  onSwipeRight?: () => void;   // Rebuy
  onLongPress?: () => void;    // Menu
  showActions?: boolean;
  compact?: boolean;
}

// Rendu minimaliste :
┌────────────────────────────┐
│ 👤 Marc        💰 2,500€  ✓│
│    Dealer • 2 Buy-ins      │
└────────────────────────────┘

// Actions par gestes, pas boutons visibles
// Menu contextuel sur long press si besoin
```

##### create-game : Composants Réutilisables

**Problème** : ConfigSection, OptionButton, PayoutCard trop spécifiques

**Solution** :
```tsx
// Fusionner dans TemplateSelector + ConfigForm génériques
components/features/create/
├── TemplateSelector.tsx    ← Grille templates
├── ConfigForm.tsx          ← Form avec tous les champs
│   └── useConfigForm.ts    ← Logic séparée
└── GamePreview.tsx         ← Résumé avant création
```

### 5.3. Navigation : Migration vers New Structure

#### Avant
```
app/(main)/(tabs)/
├── home.tsx
├── groups.tsx
├── play.tsx             ← À supprimer (redondant)
├── leaderboard.tsx      ← À fusionner dans stats.tsx
└── profile.tsx
```

#### Après
```
app/(main)/(tabs)/
├── home.tsx             ← Dashboard
├── tables.tsx           🆕 (ex-groups)
├── stats.tsx            🆕 (stats + leaderboard)
└── profile.tsx

app/(main)/
├── create-game.tsx      → Modal BottomSheet
├── lobby.tsx
└── game/[id].tsx
```

### 5.4. Hooks : Extraire Logique

#### Nouveaux Hooks Recommandés

```typescript
hooks/
├── useGameLogic.ts      ✅ (existant)
├── useGameTimers.ts     ✅ (existant)
├── usePlayerActions.ts  🆕 (rebuy, eliminate, etc.)
├── useGameTemplates.ts  🆕 (templates prédéfinis)
├── useInvitations.ts    🆕 (logique invitations)
├── useStats.ts          🆕 (calculs stats joueur)
└── useSwipeGestures.ts  🆕 (gestes PlayerCard)
```

##### Exemple : usePlayerActions

```typescript
// hooks/usePlayerActions.ts
export const usePlayerActions = (gameId: string) => {
  const addRebuy = async (playerId: string) => {
    // Logique rebuy
    await updatePlayerBuyins(gameId, playerId, +1);
    showToast('success', 'Rebuy enregistré');
  };
  
  const eliminate = async (playerId: string) => {
    // Confirm dialog
    const confirmed = await showConfirm('Éliminer ce joueur ?');
    if (!confirmed) return;
    
    await updatePlayerStatus(gameId, playerId, 'ELIMINATED');
    calculatePayouts(gameId);
    showToast('info', 'Joueur éliminé');
  };
  
  return { addRebuy, eliminate };
};
```

---

## 6. EXEMPLES D'IMPLÉMENTATION

### 6.1. Composant : Badge

```tsx
// components/primitives/Badge.tsx
import { styled, View, Text } from 'tamagui';

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
      },
      count: {
        minWidth: 24,
        height: 24,
        borderRadius: '$round',
        justifyContent: 'center',
        paddingHorizontal: '$2',
      },
      chip: {
        borderWidth: 2,
        borderColor: '$white',
      },
    },
    
    status: {
      active: {
        backgroundColor: '$successBg',
        borderColor: '$success',
        borderWidth: 1,
      },
      waiting: {
        backgroundColor: '$warningBg',
        borderColor: '$warning',
        borderWidth: 1,
      },
      eliminated: {
        backgroundColor: '$dangerBg',
        borderColor: '$danger',
        borderWidth: 1,
      },
      paid: {
        backgroundColor: '$purpleBg',
        borderColor: '$purple500',
        borderWidth: 1,
      },
    },
    
    size: {
      sm: { height: 20, fontSize: '$1' },
      md: { height: 24, fontSize: '$2' },
      lg: { height: 28, fontSize: '$3' },
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
});

// Usage
export const Badge = ({ children, ...props }: BadgeProps) => (
  <BadgeContainer {...props}>
    <BadgeText>{children}</BadgeText>
  </BadgeContainer>
);
```

---

### 6.2. Composant : ChipStack

```tsx
// components/poker/ChipStack.tsx
import React from 'react';
import { YStack, XStack, Text, View } from 'tamagui';

type ChipStackProps = {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  maxChips?: number;
};

const CHIP_COLORS = [
  { threshold: 0, color: '$chip.white', label: '1€' },
  { threshold: 5, color: '$chip.red', label: '5€' },
  { threshold: 10, color: '$chip.blue', label: '10€' },
  { threshold: 25, color: '$chip.green', label: '25€' },
  { threshold: 100, color: '$chip.black', label: '100€' },
  { threshold: 500, color: '$chip.purple', label: '500€' },
  { threshold: 1000, color: '$chip.orange', label: '1k€' },
];

const getChipColor = (amount: number) => {
  for (let i = CHIP_COLORS.length - 1; i >= 0; i--) {
    if (amount >= CHIP_COLORS[i].threshold) {
      return CHIP_COLORS[i].color;
    }
  }
  return CHIP_COLORS[0].color;
};

export const ChipStack: React.FC<ChipStackProps> = ({
  amount,
  size = 'md',
  animated = false,
  maxChips = 5,
}) => {
  const chipColor = getChipColor(amount);
  const chipSize = size === 'sm' ? 32 : size === 'md' ? 40 : 48;
  const numChips = Math.min(maxChips, Math.max(1, Math.floor(amount / 10)));

  return (
    <YStack alignItems="center" gap="$1">
      {/* Stack visuel */}
      <View position="relative" height={chipSize + (numChips - 1) * 4}>
        {Array.from({ length: numChips }).map((_, i) => (
          <View
            key={i}
            position="absolute"
            top={i * 4}
            width={chipSize}
            height={chipSize}
            borderRadius="$round"
            backgroundColor={chipColor}
            borderWidth={2}
            borderColor="$white"
            shadowColor="$black"
            shadowOpacity={0.2}
            shadowRadius={4}
            elevation={numChips - i}
            animation={animated ? 'quick' : undefined}
          />
        ))}
      </View>

      {/* Montant */}
      <Text
        fontSize={size === 'sm' ? '$2' : size === 'md' ? '$3' : '$4'}
        fontWeight="700"
        color="$colorPrimary"
      >
        {amount.toLocaleString('fr-FR')}€
      </Text>
    </YStack>
  );
};
```

---

### 6.3. Écran : Home (Dashboard)

```tsx
// app/(main)/(tabs)/home.tsx
import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { YStack, XStack, H3, Text, Theme } from 'tamagui';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

import { PokerBackground } from '@/components/layouts/PokerBackground';
import { LiveGameCarousel } from '@/components/features/home/LiveGameCarousel';
import { InvitationCard } from '@/components/features/home/InvitationCard';
import { QuickActionGrid } from '@/components/features/home/QuickActionGrid';
import { FAB } from '@/components/primitives/Button';
import { useActiveGames } from '@/hooks/useActiveGames';
import { useInvitations } from '@/hooks/useInvitations';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { activeGames, loading, refresh } = useActiveGames();
  const { invitations } = useInvitations(user?.id);

  const handleCreateGame = () => {
    router.push('/(main)/create-game');
  };

  return (
    <Theme name="dark">
      <PokerBackground>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
        >
          <YStack padding="$4" paddingTop="$10" gap="$6" paddingBottom="$20">
            
            {/* Header */}
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <Text color="$colorMuted" fontSize="$3">
                  Bienvenue,
                </Text>
                <H3 color="$colorPrimary" fontWeight="900">
                  {user?.firstName || 'Joueur'}
                </H3>
              </YStack>
            </XStack>

            {/* Parties en cours */}
            {activeGames.length > 0 && (
              <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text
                    color="$colorSecondary"
                    fontSize="$3"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    🔴 LIVE ({activeGames.length})
                  </Text>
                </XStack>
                <LiveGameCarousel games={activeGames} />
              </YStack>
            )}

            {/* Invitations */}
            {invitations.length > 0 && (
              <YStack gap="$3">
                <Text
                  color="$colorSecondary"
                  fontSize="$3"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing={1}
                >
                  📬 INVITATIONS ({invitations.length})
                </Text>
                {invitations.map((invite) => (
                  <InvitationCard key={invite.id} invitation={invite} />
                ))}
              </YStack>
            )}

            {/* Actions rapides */}
            <YStack gap="$3">
              <Text
                color="$colorSecondary"
                fontSize="$3"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing={1}
              >
                ⚡ ACCÈS RAPIDE
              </Text>
              <QuickActionGrid />
            </YStack>

          </YStack>
        </ScrollView>

        {/* FAB Create */}
        <FAB
          icon="Plus"
          onPress={handleCreateGame}
          position="absolute"
          bottom={90}
          right={20}
        />
      </PokerBackground>
    </Theme>
  );
}
```

---

### 6.4. Modal : Create Game (Bottom Sheet)

```tsx
// app/(main)/create-game.tsx
import React, { useState } from 'react';
import { Sheet, YStack, XStack, H2, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';

import { TemplateSelector } from '@/components/features/create/TemplateSelector';
import { ConfigForm } from '@/components/features/create/ConfigForm';
import { useGameTemplates } from '@/hooks/useGameTemplates';
import { useGameLogic } from '@/hooks/useGameLogic';

export default function CreateGameModal() {
  const router = useRouter();
  const { templates } = useGameTemplates();
  const { createGame } = useGameLogic();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [config, setConfig] = useState({
    buyIn: 10,
    blindDuration: 15,
    lateReg: 60,
    payoutModel: '50_30_20',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setConfig(template.config);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    const gameId = await createGame(config);
    setCreating(false);
    
    if (gameId) {
      router.replace(`/(main)/game/${gameId}`);
    }
  };

  return (
    <Sheet
      modal
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      snapPoints={[85, 50]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Frame padding="$4" paddingTop="$6">
        <Sheet.Handle />
        
        <YStack gap="$5">
          {/* Header */}
          <YStack alignItems="center" gap="$2">
            <H2 color="$colorPrimary" fontWeight="900">
              Nouvelle Partie
            </H2>
            <Text color="$colorMuted" fontSize="$3">
              Choisissez un template ou personnalisez
            </Text>
          </YStack>

          {/* Templates */}
          <YStack gap="$3">
            <Text
              color="$colorSecondary"
              fontSize="$3"
              fontWeight="bold"
              textTransform="uppercase"
            >
              📋 TEMPLATES
            </Text>
            <TemplateSelector
              templates={templates}
              selected={selectedTemplate}
              onSelect={handleSelectTemplate}
            />
          </YStack>

          {/* Configuration */}
          <ConfigForm
            config={config}
            onChange={setConfig}
            showAdvanced={showAdvanced}
            onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
          />

          {/* Actions */}
          <XStack gap="$3">
            <Button
              flex={1}
              variant="ghost"
              onPress={() => router.back()}
            >
              Annuler
            </Button>
            <Button
              flex={2}
              variant="primary"
              onPress={handleCreate}
              disabled={creating}
            >
              {creating ? 'Création...' : 'Créer'}
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
```

---

## 7. ROADMAP D'IMPLÉMENTATION

### Phase 1 : Fondations (Semaine 1)
- [ ] Nettoyer fichiers .old
- [ ] Créer structure dossiers finale
- [ ] Implémenter composants primitives manquants (Badge, Avatar, Input)
- [ ] Unifier Card component

### Phase 2 : Composants Poker (Semaine 2)
- [ ] ChipStack
- [ ] BlindLevel
- [ ] Timer
- [ ] PotDisplay
- [ ] PlayerCard refactorisé

### Phase 3 : Navigation (Semaine 3)
- [ ] Migrer tabs (4 tabs + FAB)
- [ ] Créer Home dashboard
- [ ] Refactorer Tables (ex-Groups)
- [ ] Créer Stats screen

### Phase 4 : Flows Majeurs (Semaine 4)
- [ ] Create Game modal (templates)
- [ ] Game Screen refactorisé
- [ ] Lobby amélioré
- [ ] Invitations system

### Phase 5 : Polish & Tests (Semaine 5)
- [ ] Animations & transitions
- [ ] Gestes tactiles (swipe, long press)
- [ ] Tests utilisateurs
- [ ] Optimisations performances

---

## 8. MÉTRIQUES DE SUCCÈS

### UX Metrics
- **Time to create game** : < 30 secondes (vs 1-2 min actuellement)
- **Actions per game** : -30% de taps pour actions courantes
- **Navigation clarity** : Test 5-second rule (utilisateurs comprennent structure en 5s)

### UI Metrics
- **Design consistency** : 100% composants utilisent design system
- **Performance** : 60 FPS constant, animations fluides
- **Accessibility** : Contrastes WCAG AA minimum

### Business Metrics
- **Engagement** : +40% parties créées/semaine
- **Retention** : +25% utilisateurs actifs J7
- **Satisfaction** : NPS > 50

---

## 🎯 CONCLUSION

Cette refonte transforme Poker Night d'une **app fonctionnelle en un outil professionnel et plaisant**. Les axes clés :

1. **Simplification** : Moins de taps, flows intuitifs, templates
2. **Cohérence** : Design system strict, composants réutilisables
3. **Modernité** : Glass effects, animations, gestes tactiles
4. **Performance** : Architecture optimisée, code maintenable

**Prochaine étape** : Valider avec users tests et commencer Phase 1.
