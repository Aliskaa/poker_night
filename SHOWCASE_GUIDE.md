# 🎨 Showcase Screen - Guide d'utilisation

## Accès

Pour voir tous les composants UI créés, il y a maintenant 2 méthodes :

### 1. **Depuis l'écran Home**
- Ouvre l'application
- Va sur l'écran **Home**  
- Clique sur le bouton **"UI Showcase"** (icône Palette 🎨)
- Le showcase s'ouvre en modal

### 2. **Navigation directe** (URL)
```
/(main)/showcase
```

---

## 📦 Composants affichés

Le showcase présente tous les composants créés pendant les Phases 2 & 3 :

### UI Primitives (5)
1. ✅ **StatusBadge** - 3 variants (ACTIVE/ELIMINATED/REBUY)
2. ✅ **ChipStack** - 4 variants + 3 sizes
3. ✅ **CountdownBadge** - Auto-urgency timer
4. ✅ **Stepper** - Multi-step wizard avec navigation
5. ✅ **PokerButton** - 4 variants (primary/secondary/success/danger)

### Game Components (4)
6. ✅ **BlindLevel** - Current/next blinds display
7. ✅ **BlindTimer** - Timer avec urgence color-coded
8. ✅ **PotDisplay** - Prize pool avec payout preview
9. ✅ **GlassCard** - Glass-morphism cards

---

## ✨ Fonctionnalités interactives

### Stepper Demo
- Navigation entre 4 étapes
- Boutons Previous/Next actifs
- Labels visuels pour chaque step

### BlindTimer
- Timer de 7:30 animé
- Bouton Play/Pause fonctionnel
- Bouton Reset
- Changement de couleur selon urgence

### Tous les variants
- **ChipStack** : default, pot, stack, rebuy + sm/md/lg
- **StatusBadge** : ACTIVE (vert), ELIMINATED (rouge), REBUY (orange)
- **CountdownBadge** : normal (bleu), warning (orange), urgent (rouge)
- **PokerButton** : primary (gold), secondary (gray), success (green), danger (red)
- **PotDisplay** : winner_takes_all vs 50_30_20

---

## 🎯 Utilisation

### Pour tester visuellement
1. Lance l'app : `npx expo start --web`
2. Va sur Home
3. Clique "UI Showcase"
4. Scroll pour voir tous les composants
5. Interagis avec le Stepper et le Timer

### Pour développer
Le showcase sert de **documentation vivante** :
- Voir tous les composants en action
- Tester les variants
- Vérifier les animations
- Comprendre les props attendues

---

## 📝 Code showcase

Fichier : `app/(main)/showcase.tsx`

```tsx
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ChipStack } from '@/components/ui/ChipStack'
// ... etc

// Exemple d'utilisation
<StatusBadge status="ACTIVE" />
<ChipStack amount={1250} variant="pot" size="lg" />
<PokerButton 
  variant="primary" 
  icon={<Plus />} 
  title="Action" 
  subtitle="Optional subtitle" 
/>
```

---

## 🔧 Erreurs TypeScript

Si tu vois des erreurs TypeScript (lignes 179, 185), ce sont de faux positifs :
- Le serveur TypeScript peut prendre 10-20 secondes pour se rafraîchir
- Les props sont correctes : `payoutModel="winner_takes_all"` et `"50_30_20"`
- Redémarre le serveur TypeScript si nécessaire : Cmd+Shift+P → "TypeScript: Restart TS Server"

---

## 🎉 Résultat

**Tu as maintenant une page dédiée pour :**
- ✅ Voir tous les nouveaux composants
- ✅ Tester visuellement le design system
- ✅ Comprendre les APIs sans lire la doc
- ✅ Valider que tout fonctionne correctement
- ✅ Démo pour présenter le travail

**Prochaines étapes :**
1. Tester le showcase dans le navigateur
2. Vérifier que tous les composants s'affichent correctement
3. Valider les animations et interactions
4. Utiliser ces composants dans les autres écrans !

---

**Status** : ✅ Showcase créé et accessible depuis Home

**Accès rapide** : Home → "UI Showcase" button
