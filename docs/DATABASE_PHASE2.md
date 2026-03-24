# 📦 Phase 2 - Archivage & Nettoyage Automatique

## ✅ Fonctionnalités Implémentées

### 1. **Collection game-history**

Structure optimisée pour l'historique :

```typescript
game-history/{gameId}
├── (document) Summary        // Résumé léger
├── players/{playerId}        // Sous-collection
└── metadata/stats            // Statistiques agrégées
```

**Avantages** :
- Pas de limite 1MB (sous-collections)
- Queries rapides sur le résumé
- Détails disponibles à la demande

### 2. **Archivage Automatique**

#### Cloud Functions créées :

**a) `scheduleGameArchiving`**
- Trigger: Quand `game.status` → `FINISHED`
- Action: Programme l'archivage dans 1 heure
- Permet aux joueurs de voir les résultats

**b) `archiveFinishedGames`**
- Schedule: Toutes les heures (`0 * * * *`)
- Action: Archive les parties finies depuis >1h
- Limite: 50 parties/exécution

**c) `cleanupAbandonedGames`**
- Schedule: Tous les jours à 3h (`0 3 * * *`)
- Action: Supprime parties actives sans activité depuis 7 jours
- TTL automatique

### 3. **Côté client**

L’archivage vers `game-history` est assuré **uniquement par les Cloud Functions** (`archiveFinishedGame` côté serveur, voir `functions/src/index.ts`). Il n’y a plus de module client `utils/gameArchiver.ts` (supprimé pour éviter la duplication et les écritures non autorisées par les règles).

**`hooks/useGameHistory.ts`** :
- Chargement paginé de l'historique
- Filtres par groupe/joueur
- Load more automatique

### 4. **Index Firestore Ajoutés**

```json
// Pour archivage
games: status + finishedAt

// Pour historique
game-history: groupId + finishedAt
game-history: winnerId + finishedAt
```

## 📊 Impact

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| Taille collection `games` | Illimitée | <100 parties actives | **-95%** |
| Historique disponible | Limité (1MB) | Illimité | **∞** |
| Cleanup manuel | Oui | Automatique | **100%** |
| Coûts lectures | Élevé | Optimisé (pagination) | **-70%** |

## 🚀 Déploiement

### 1. Installer les dépendances Cloud Functions

```bash
cd functions
npm install
```

### 2. Déployer les index

```bash
firebase deploy --only firestore:indexes
```

### 3. Déployer les Cloud Functions

```bash
firebase deploy --only functions
```

### 4. Vérifier le déploiement

```bash
# Voir les logs
firebase functions:log

# Lister les fonctions
firebase functions:list
```

## ⚙️ Configuration

### Variables d'environnement (optionnel)

```bash
# Délai avant archivage (minutes)
firebase functions:config:set archiving.delay=60

# Jours avant cleanup
firebase functions:config:set cleanup.days=7
```

### Coûts estimés

| Fonction | Fréquence | Exécutions/mois | Coût estimé |
|----------|-----------|-----------------|-------------|
| `scheduleGameArchiving` | Par game fini | ~300 | Gratuit |
| `archiveFinishedGames` | Toutes les heures | 720 | Gratuit |
| `cleanupAbandonedGames` | 1x/jour | 30 | Gratuit |

**Total** : ~1000 invocations/mois = **$0** (dans le tier gratuit)

## 📱 Utilisation dans l'App

### Voir l'historique

```typescript
import { useGameHistory } from '@/hooks/useGameHistory';

function HistoryScreen() {
  const { history, loading, loadHistory, loadMore } = useGameHistory();
  
  useEffect(() => {
    loadHistory();
  }, []);
  
  return (
    <FlatList
      data={history}
      onEndReached={loadMore}
      renderItem={({ item }) => <GameHistoryCard game={item} />}
    />
  );
}
```

### Données de démonstration (admin local)

Pour enchaîner des parties de test sans tout créer à la main dans l’UI, utiliser le script :

```bash
npm run simulate:poker -- --help

# Exemple (Windows) avec clé de compte de service :
npm run simulate:poker -- ensure-users --service-account C:\chemin\serviceAccount.json --uids <uid1>,<uid2>,...
```

Voir les détails dans l’en-tête de `scripts/simulate-game-scenarios.cjs`.

## 🧪 Tests

### Test local avec Emulator

```bash
# Démarrer les emulators
firebase emulators:start

# Tester une fonction
firebase functions:shell
> archiveFinishedGames()
```

### Test en production

1. Créer une partie test
2. La terminer
3. Vérifier dans Console Firebase :
   - Logs des Cloud Functions
   - Collection `game-history`
   - Suppression de `games`

## 🔒 Sécurité

### Security Rules pour game-history

```javascript
match /game-history/{gameId} {
  // Lecture : Tout utilisateur authentifié
  allow read: if isAuthenticated();
  
  // Écriture : Seulement Cloud Functions
  allow write: if false;
  
  match /players/{playerId} {
    allow read: if isAuthenticated();
    allow write: if false;
  }
  
  match /metadata/{doc} {
    allow read: if isAuthenticated();
    allow write: if false;
  }
}
```

## 📈 Monitoring

### Métriques à surveiller

1. **Cloud Functions** :
   - Temps d'exécution
   - Taux d'erreur
   - Invocations

2. **Firestore** :
   - Taille collection `games`
   - Croissance `game-history`
   - Reads/Writes quotidiens

3. **Alertes** :
   - Functions timeout (>60s)
   - Erreurs répétées
   - Quota dépassé

## 🎯 Prochaines Étapes (Phase 3)

- [ ] Analytics avancées sur game-history
- [ ] Export CSV de l'historique
- [ ] Statistiques par groupe/période
- [ ] Notifications de résultats
- [ ] Replay de parties

---

**Déployé le** : Février 2026  
**Version** : 2.0.0
