# 🧪 GUIDE DE TEST P0 - SÉCURITÉ & STABILITÉ

## ✅ COMPILATION RÉUSSIE

```bash
npx tsc --noEmit
# ✅ Aucune erreur TypeScript
```

---

## 📋 CHECKLIST DE TEST

### 1. ✅ Installation & Build
- [x] Zod installé (`npx expo install zod`)
- [x] TypeScript compile sans erreur
- [ ] Application démarre sans crash

### 2. 🔥 Firebase Firestore Rules

#### Test A : Vérifier les règles déployées
1. Ouvrir [Firebase Console](https://console.firebase.google.com)
2. Sélectionner votre projet
3. Menu → **Firestore Database** → Onglet **Règles**
4. Vérifier que les règles sont présentes et publiées

#### Test B : Simulateur de règles
1. Dans Firebase Console → Firestore → **Règles**
2. Cliquer sur **Simulateur**
3. Tester ces scénarios :

**Scénario 1 : Lecture utilisateur authentifié**
```
Type : get
Collection : users
Document ID : test-user-123
Auth UID : test-user-123
```
✅ Attendu : **Autorisé**

**Scénario 2 : Écriture utilisateur non propriétaire**
```
Type : update
Collection : users
Document ID : user-abc
Auth UID : user-xyz (différent)
```
❌ Attendu : **Refusé**

### 3. ⏱️ Timestamps Firebase

#### Test C : Création d'une partie
1. Se connecter à l'application
2. Créer une nouvelle partie
3. Ouvrir **Firebase Console** → **Firestore**
4. Chercher la partie créée dans la collection `games`
5. Vérifier les champs :
   - `createdAt` : Type **timestamp** (pas number ou string)
   - `blindLevelStartedAt` : Type **timestamp**
   - `isPaused` : **false**
   - `currentBlindLevel` : **0**

✅ **Succès** : Tous les timestamps sont de type Firestore Timestamp

#### Test D : Création d'un groupe
1. Créer un nouveau groupe/club
2. Firebase Console → collection `groups`
3. Vérifier :
   - `createdAt` : Type **timestamp**

### 4. 🔐 Transactions Atomiques

#### Test E : Rebuy
1. Créer une partie avec plusieurs joueurs
2. Effectuer un rebuy pour un joueur
3. **Attendu** :
   - `totalPot` augmente du montant exact
   - `player.buyInCount` augmente de 1
   - `player.totalInvested` augmente du montant
   - ✅ **Tout ou rien** : si une erreur survient, rien ne change

#### Test F : Élimination
1. Éliminer un joueur
2. Vérifier dans Firestore :
   - `player.status` : **"ELIMINATED"**
   - `player.finalRank` : Nombre correct (5ème sur 6 = rank 5)
   - `player.eliminatedAt` : Type **timestamp**

#### Test G : Ajout invité
1. Ajouter un invité à une partie
2. Vérifier :
   - `totalPot` augmente
   - `players` array contient le nouveau joueur
   - Transaction atomique (tout ou rien)

### 5. ✅ Validation Zod

#### Test H : Buy-in invalide
1. **Dans le code**, modifier temporairement pour tester :
```typescript
// Dans create-game.tsx, essayer de créer avec :
const config = {
  defaultBuyIn: -10, // ❌ Négatif
  defaultTimeBlindDuration: 15,
  lateRegLimit: 60,
  payoutModel: '50_30_20'
}
```
2. Créer une partie
3. **Attendu** : Message d'erreur "Le buy-in doit être au minimum de 1€"

#### Test I : Nom de groupe vide
1. Essayer de créer un groupe avec un nom de 1 caractère
2. **Attendu** : Erreur "Le nom du groupe doit contenir au moins 2 caractères"

#### Test J : Code d'invitation invalide
1. Essayer de rejoindre un groupe avec un code vide
2. **Attendu** : Erreur de validation

### 6. 🎮 Gestion des Blinds

#### Test K : Pause/Reprise
1. Créer une partie
2. Vérifier dans Firestore : `isPaused: false`
3. **Si vous avez ajouté les boutons UI** : Cliquer "Pause"
4. Vérifier Firestore :
   - `isPaused: true`
   - `pausedAt` : timestamp présent
5. Cliquer "Resume"
6. Vérifier :
   - `isPaused: false`
   - `pausedAt: null`

#### Test L : Niveau suivant
1. Cliquer "Next Level"
2. Vérifier Firestore :
   - `currentBlindLevel` : augmente de 1
   - `blindLevelStartedAt` : nouveau timestamp

### 7. 🔄 Temps Réel (onSnapshot)

#### Test M : Synchronisation multi-appareils
1. Ouvrir l'app sur 2 appareils (ou 2 navigateurs en mode web)
2. Sur appareil 1 : Faire un rebuy
3. Sur appareil 2 : Vérifier que le pot se met à jour automatiquement
4. **Attendu** : Mise à jour en temps réel sans refresh

### 8. 📊 Statistiques Utilisateur

#### Test N : Fin de partie et stats
1. Créer une partie avec 3 joueurs
2. Éliminer 2 joueurs
3. Terminer la partie
4. Vérifier dans Firestore → collection `users` :
   - `statistics.gamesPlayed` : +1 pour tous
   - `statistics.wins` : +1 pour le gagnant uniquement
   - `statistics.totalInvested` : montants corrects
   - `statistics.totalWinnings` : payouts corrects
   - `statistics.netProfit` : winnings - invested

---

## 🐛 TESTS DE RÉSISTANCE

### Test O : Perte de connexion
1. Créer une partie
2. **Couper la connexion Internet**
3. Essayer un rebuy
4. **Attendu** : Message d'erreur clair (pas de crash)

### Test P : Données invalides
1. Via Firebase Console, modifier manuellement :
   - `totalPot` à une valeur négative
   - `createdAt` en string "invalid"
2. Ouvrir l'app
3. **Attendu** : Pas de crash, utilitaires `timestampHelpers` gèrent la conversion

### Test Q : Concurrence
1. Sur 2 appareils simultanément
2. Faire un rebuy pour le même joueur en même temps
3. **Attendu** : Grâce aux transactions, un seul rebuy devrait passer (ou les 2 si intentions différentes)

---

## 📈 MÉTRIQUES DE SUCCÈS

| Test | Description | Status | Notes |
|------|-------------|--------|-------|
| A | Règles déployées | ⏳ | |
| B | Simulateur règles | ⏳ | |
| C | Timestamps partie | ⏳ | |
| D | Timestamps groupe | ⏳ | |
| E | Rebuy atomique | ⏳ | |
| F | Élimination | ⏳ | |
| G | Ajout invité | ⏳ | |
| H | Validation buy-in | ⏳ | |
| I | Validation groupe | ⏳ | |
| J | Validation code | ⏳ | |
| K | Pause/Reprise | ⏳ | |
| L | Next Level | ⏳ | |
| M | Temps réel | ⏳ | |
| N | Stats fin partie | ⏳ | |
| O | Perte connexion | ⏳ | |
| P | Données invalides | ⏳ | |
| Q | Concurrence | ⏳ | |

---

## 🚨 ERREURS CONNUES À SURVEILLER

### Console Browser/Metro
- ❌ **Erreur Firestore** : "Permission denied"
  - → Vérifier que les règles sont bien déployées
  
- ❌ **Erreur Zod** : "Validation error: ..."
  - → C'est normal si vous testez des données invalides
  
- ❌ **Erreur Transaction** : "Transaction failed"
  - → Vérifier la connexion Internet
  - → Vérifier que le document existe

### Firebase Console
- ⚠️ **Ancien format timestamps** : Si des parties créées avant P0 ont des `Date` au lieu de `Timestamp`
  - → Normal, les utilitaires `timestampHelpers` gèrent la conversion
  - → Optionnel : Script de migration pour nettoyer

---

## ✅ CRITÈRES DE VALIDATION P0

Pour considérer P0 comme **réussi**, vous devez avoir :

1. ✅ **0 erreur TypeScript** (`npx tsc --noEmit`)
2. ✅ **Règles Firestore déployées** et testées dans le simulateur
3. ✅ **Au moins 5 tests manuels réussis** (C, E, F, G, N)
4. ✅ **Aucun crash** lors de la création/modification de partie
5. ✅ **Timestamps corrects** dans Firebase Console (type Timestamp)

---

## 📞 SUPPORT

Si un test échoue :
1. Vérifier les logs dans la console Metro/Browser
2. Vérifier Firebase Console → Firestore → Règles
3. Vérifier que Zod est bien installé
4. Relancer l'app avec `npx expo start --clear`

**Une fois tous les tests verts, P0 est validé** ✅ et on peut passer au P1 !
