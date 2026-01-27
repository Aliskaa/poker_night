# 🎓 Exemple de Migration Pas-à-Pas

## Objectif
Migrer le composant **QuickAction.tsx** des valeurs en dur vers les tokens Tamagui.

**Durée estimée :** 10 minutes  
**Difficulté :** ⭐ Facile

---

## 📝 Avant - Code Actuel

```tsx
// components/home/QuickAction.tsx
import React from "react";
import { Button, Text, YStack } from "tamagui";

export function QuickAction({ icon, label, subLabel, onPress }: any) {
    return (
        <Button
            flex={1}
            backgroundColor="rgba(255, 255, 255, 0.05)"    // ❌ Valeur en dur
            borderColor="rgba(255, 255, 255, 0.1)"         // ❌ Valeur en dur
            borderWidth={1}
            borderRadius="$4"
            padding="$4"
            onPress={onPress}
            pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}  // ❌ Valeur en dur
        >
            <YStack backgroundColor="rgba(0,0,0,0.3)" padding="$2" borderRadius="$3">  // ❌ Valeur en dur
                {React.cloneElement(icon, { color: '#fbbf24' })}  // ❌ Valeur en dur
            </YStack>
            <YStack>
                <Text color="white" fontWeight="bold" fontSize="$5">{label}</Text>  // ❌ "white" en dur
                <Text color="rgba(255,255,255,0.5)" fontSize="$2">{subLabel}</Text>  // ❌ Valeur en dur
            </YStack>
        </Button>
    );
}
```

### ❌ Problèmes identifiés :
1. **6 couleurs RGBA** différentes en dur
2. **2 couleurs hex/mots-clés** en dur
3. Impossible de thématiser facilement
4. Code verbeux et peu lisible

---

## ✅ Après - Code Migré

```tsx
// components/home/QuickAction.tsx
import React from "react";
import { Button, Text, YStack } from "tamagui";

export function QuickAction({ icon, label, subLabel, onPress }: any) {
    return (
        <Button
            flex={1}
            backgroundColor="$glass"                       // ✅ Token
            borderColor="$borderColor"                     // ✅ Token
            borderWidth={1}
            borderRadius="$4"
            padding="$4"
            onPress={onPress}
            pressStyle={{ backgroundColor: '$glassHover' }}  // ✅ Token
        >
            <YStack backgroundColor="$overlayMedium" padding="$2" borderRadius="$3">  // ✅ Token
                {React.cloneElement(icon, { color: '$primary' })}  // ✅ Token
            </YStack>
            <YStack>
                <Text color="$color" fontWeight="bold" fontSize="$5">{label}</Text>  // ✅ Token
                <Text color="$colorDim" fontSize="$2">{subLabel}</Text>  // ✅ Token
            </YStack>
        </Button>
    );
}
```

### ✅ Améliorations :
1. **Toutes les couleurs** sont maintenant des tokens
2. Code **plus lisible** et sémantique
3. **Thématisable** automatiquement
4. **Maintenable** : 1 seul endroit pour changer

---

## 🔄 Migration Étape par Étape

### Étape 1 : Identifier les valeurs à remplacer

Ouvrez le fichier et **surlignez mentalement** chaque valeur en dur :

```tsx
backgroundColor="rgba(255, 255, 255, 0.05)"  ← RGBA
borderColor="rgba(255, 255, 255, 0.1)"       ← RGBA  
backgroundColor: 'rgba(255, 255, 255, 0.1)'  ← RGBA (dans pressStyle)
backgroundColor="rgba(0,0,0,0.3)"            ← RGBA
color: '#fbbf24'                             ← HEX
color="white"                                ← MOT-CLÉ
color="rgba(255,255,255,0.5)"                ← RGBA
```

**Total :** 7 valeurs à remplacer

---

### Étape 2 : Consulter le mapping

Ouvrez **tamagui.config.improved.ts** et trouvez les tokens correspondants :

| Valeur en dur | Token | Raison |
|---------------|-------|--------|
| `rgba(255,255,255,0.05)` | `$glass` | Fond verre léger |
| `rgba(255,255,255,0.1)` | `$borderColor` / `$glassHover` | Bordure/Hover |
| `rgba(0,0,0,0.3)` | `$overlayMedium` | Overlay moyen |
| `#fbbf24` | `$primary` | Couleur principale (or) |
| `white` | `$color` | Couleur de texte principale |
| `rgba(255,255,255,0.5)` | `$colorDim` | Texte secondaire atténué |

---

### Étape 3 : Remplacer ligne par ligne

#### 3.1 Background du bouton

**Avant :**
```tsx
backgroundColor="rgba(255, 255, 255, 0.05)"
```

**Après :**
```tsx
backgroundColor="$glass"
```

**Vérification :** Dans tamagui.config.ts :
```typescript
glassLight: 'rgba(255,255,255,0.05)',
```
✅ C'est bon !

---

#### 3.2 Bordure du bouton

**Avant :**
```tsx
borderColor="rgba(255, 255, 255, 0.1)"
```

**Après :**
```tsx
borderColor="$borderColor"
```

**Vérification :** Dans le thème dark :
```typescript
borderColor: myTokens.color.glassBorder,  // qui vaut rgba(255,255,255,0.1)
```
✅ C'est bon !

---

#### 3.3 PressStyle

**Avant :**
```tsx
pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
```

**Après :**
```tsx
pressStyle={{ backgroundColor: '$glassHover' }}
```

**Vérification :** Dans tamagui.config.ts :
```typescript
glassHover: 'rgba(255,255,255,0.1)',
```
✅ C'est bon !

---

#### 3.4 Background de l'icône

**Avant :**
```tsx
backgroundColor="rgba(0,0,0,0.3)"
```

**Après :**
```tsx
backgroundColor="$overlayMedium"
```

**Vérification :**
```typescript
overlayMedium: 'rgba(0,0,0,0.3)',
```
✅ C'est bon !

---

#### 3.5 Couleur de l'icône

**Avant :**
```tsx
{React.cloneElement(icon, { color: '#fbbf24' })}
```

**Après :**
```tsx
{React.cloneElement(icon, { color: '$primary' })}
```

**Vérification :** Dans le thème dark :
```typescript
primary: myTokens.color.potGold,  // qui vaut #fbbf24
```
✅ C'est bon !

---

#### 3.6 Couleur du label

**Avant :**
```tsx
<Text color="white" fontWeight="bold" fontSize="$5">{label}</Text>
```

**Après :**
```tsx
<Text color="$color" fontWeight="bold" fontSize="$5">{label}</Text>
```

**Vérification :** Dans le thème dark :
```typescript
color: myTokens.color.textPure,  // qui vaut #ffffff (white)
```
✅ C'est bon !

---

#### 3.7 Couleur du sous-label

**Avant :**
```tsx
<Text color="rgba(255,255,255,0.5)" fontSize="$2">{subLabel}</Text>
```

**Après :**
```tsx
<Text color="$colorDim" fontSize="$2">{subLabel}</Text>
```

**Vérification :**
```typescript
textDim: 'rgba(255,255,255,0.5)',
```
✅ C'est bon !

---

### Étape 4 : Sauvegarder et tester

1. **Sauvegarder le fichier** (Ctrl+S / Cmd+S)
2. **Ouvrir l'app** dans le navigateur/simulateur
3. **Naviguer vers l'écran Home**
4. **Vérifier visuellement** les QuickAction cards

**Questions à se poser :**
- ✅ Les couleurs sont-elles identiques ?
- ✅ Le hover fonctionne-t-il ?
- ✅ L'icône est-elle dorée ?
- ✅ Le texte est-il lisible ?

Si tout est OK → **Migration réussie !** 🎉

---

### Étape 5 : Test du changement de thème (Bonus)

Maintenant, **testez la puissance des tokens** :

1. Ouvrez `tamagui.config.ts`
2. Modifiez temporairement :
   ```typescript
   glassLight: 'rgba(255,255,255,0.15)',  // Au lieu de 0.05
   ```
3. Rechargez l'app
4. **Observez** : TOUS les fonds glass ont changé partout !

**Impressionnant, non ?** 🤯

---

## 📊 Comparaison Visuelle

### Avant Migration
```
Background: rgba(255, 255, 255, 0.05) ← Qu'est-ce que c'est ? 🤔
Border: rgba(255, 255, 255, 0.1)      ← Encore une couleur mystère
Hover: rgba(255, 255, 255, 0.1)       ← C'est la même que border ?
Overlay: rgba(0,0,0,0.3)              ← Noir ou gris ?
Icon: #fbbf24                         ← Quelle couleur en hex ?
Text: white                           ← OK celle-là est claire
Subtext: rgba(255,255,255,0.5)        ← Encore du RGBA...
```

**Problèmes :**
- 😵 Difficile à lire
- 🤷 Sémantique peu claire
- 🐛 Risque d'incohérence
- ⏱️ Lent à modifier

---

### Après Migration
```
Background: $glass          ← Clair : fond verre
Border: $borderColor        ← Évident : bordure standard
Hover: $glassHover          ← Logique : état hover du verre
Overlay: $overlayMedium     ← Descriptif : overlay moyen
Icon: $primary              ← Sémantique : couleur principale
Text: $color                ← Standard : couleur de texte
Subtext: $colorDim          ← Clair : texte atténué
```

**Avantages :**
- 😊 Facile à lire
- 🎯 Sémantique claire
- ✅ Cohérence garantie
- ⚡ Rapide à modifier

---

## 🎯 Prochaine Migration

Maintenant que vous maîtrisez le process, migrez un autre composant !

**Suggestions par ordre de difficulté :**

### ⭐ Facile (10-15 min)
1. `components/home/HomeHeader.tsx` (10 occurrences)
2. `components/ui/GlassCard.tsx` (12 occurrences)
3. `components/create-game/ConfigSection.tsx` (3 occurrences)

### ⭐⭐ Moyen (20-30 min)
4. `components/game/PlayerCard.tsx` (20 occurrences)
5. `components/poker/HandRow.tsx` (14 occurrences)
6. `components/game/GameHeader.tsx` (20 occurrences)

### ⭐⭐⭐ Avancé (1h)
7. `app/(main)/(tabs)/profile.tsx` (40 occurrences)
8. `app/(main)/game/[id].tsx` (26 occurrences)
9. `app/(main)/(tabs)/groups.tsx` (19 occurrences)

---

## 🛠️ Outils Utiles

### VS Code : Rechercher/Remplacer avec Regex

Pour remplacer toutes les occurrences de `rgba(255,255,255,0.05)` :

1. Ouvrir la recherche : `Ctrl+H` / `Cmd+H`
2. Activer le mode Regex : `.*`
3. Chercher : `rgba\(255,255,255,0\.05\)`
4. Remplacer par : `$glass`
5. **Attention :** Vérifier chaque occurrence avant de valider !

---

### Tableau de Correspondance Rapide

Gardez cette table sous les yeux pendant la migration :

| RGBA/Hex | Token | Usage |
|----------|-------|-------|
| `rgba(255,255,255,0.05)` | `$glass` | Fond verre léger |
| `rgba(255,255,255,0.1)` | `$borderColor` ou `$glassHover` | Bordure ou hover |
| `rgba(255,255,255,0.5)` | `$colorDim` | Label secondaire |
| `rgba(255,255,255,0.6)` | `$colorMuted` | Texte muted |
| `rgba(255,255,255,0.7)` | `$textSecondary` | Texte secondaire |
| `rgba(0,0,0,0.3)` | `$overlayMedium` | Overlay moyen |
| `rgba(0,0,0,0.8)` | `$overlayBlack` | Footer sombre |
| `#fbbf24` | `$primary` | Or principal |
| `#064e3b` | `$background` | Fond vert poker |
| `white` | `$color` | Texte principal |

---

## ✅ Checklist Post-Migration

Après chaque composant migré :

- [ ] Le fichier compile sans erreur
- [ ] Le rendu visuel est identique
- [ ] Les interactions (hover, press) fonctionnent
- [ ] Aucune valeur RGBA/hex en dur ne reste
- [ ] Le code est plus lisible
- [ ] Commit Git avec message clair : `refactor: migrate QuickAction to tamagui tokens`

---

## 🎓 Leçons Apprises

### Ce qu'il faut retenir :
1. **Les tokens = source unique de vérité**
2. **Toujours vérifier dans tamagui.config.ts**
3. **Tester visuellement après chaque migration**
4. **Commiter régulièrement**
5. **Documenter les changements non évidents**

### Erreurs à éviter :
❌ Migrer tout d'un coup sans tester
❌ Utiliser le mauvais token (ex: `$glass` au lieu de `$glassHover`)
❌ Oublier de redémarrer le serveur après modification de tamagui.config.ts
❌ Ne pas vérifier visuellement

---

**Félicitations ! Vous savez maintenant migrer un composant vers les tokens Tamagui ! 🎉**

**Temps nécessaire pour QuickAction :** ~10 minutes  
**Composants restants à migrer :** 45+  
**Temps total estimé si vous faites 5 composants/jour :** 2 semaines

**Courage, le jeu en vaut la chandelle ! 💪**
