# 🚀 Guide de Déploiement - Poker Night

## 📋 Prérequis

- Firebase CLI installé (`npm install -g firebase-tools`)
- Accès au projet Firebase
- Authentification Firebase configurée

## 🔐 Déploiement des Security Rules

### 1. Déployer les règles Firestore

```bash
firebase deploy --only firestore:rules
```

### 2. Vérifier les règles dans la console Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionner votre projet
3. Aller dans **Firestore Database** > **Règles**
4. Vérifier que les règles sont bien déployées

## ⚡ Optimisations Implémentées

### Backend / Firebase

✅ **Security Rules strictes**
- Authentification obligatoire
- Validation des propriétaires
- Contrôle des permissions par collection
- Protection contre les injections

✅ **Transactions atomiques**
- `runTransaction` pour les opérations critiques
- Évite les race conditions
- Garantit la cohérence des données

✅ **Retry Logic avec Exponential Backoff**
- Retry automatique sur erreurs réseau (max 3 fois)
- Délai croissant entre tentatives (1s, 2s, 4s)
- Pas de retry sur erreurs de validation/permissions

### Frontend / Performance

✅ **Hooks optimisés**
- `useCallback` sur toutes les fonctions
- `useMemo` pour les calculs coûteux
- Évite les re-renders inutiles

✅ **Gestion d'erreur centralisée**
- `ErrorHandler` pour traitement unifié
- Messages utilisateur clairs
- Logging structuré

✅ **Pagination**
- Leaderboard chargé par pages de 20
- `loadMoreLeaderboard()` pour charger plus
- Évite de charger tous les utilisateurs d'un coup

✅ **Debouncing & Throttling**
- Debounce 500ms sur ajout d'invités
- Throttle 1s sur élimination/recave
- Empêche les doubles clics

✅ **IDs sécurisés**
- `generateSecureId()` pour les guests
- Format : `guest_1738454321_abc123def456`
- Évite les collisions

✅ **Types stricts**
- Suppression de tous les `any`
- `Timestamp | FieldValue` pour Firebase
- Type safety complet

### UX

✅ **Toast au lieu d'alert()**
- Messages non-bloquants
- Style cohérent avec l'app
- Meilleure UX mobile

✅ **Loading states**
- Indicateurs visuels pendant les opérations
- Désactivation des boutons pendant traitement
- Feedback visuel clair

✅ **Race conditions corrigées**
- `useRef` pour éviter doubles appels de `joinGame`
- Vérifications de doublons dans transactions
- État synchronisé avec Firestore

## 🧪 Tests à effectuer après déploiement

### Tests Security Rules

```bash
# Tester les règles localement
firebase emulators:start --only firestore
```

### Scénarios de test

1. **Création de partie**
   - ✅ Utilisateur authentifié peut créer
   - ❌ Utilisateur non-auth ne peut pas créer
   - ❌ Cannot set hostId different from auth.uid

2. **Mise à jour de partie**
   - ✅ Hôte peut mettre à jour
   - ✅ Joueur peut ajouter rebuy/guest
   - ❌ Non-membre ne peut pas modifier
   - ❌ Cannot decrease totalPot (sauf FINISHED)

3. **Groupes**
   - ✅ Membre peut lire
   - ❌ Non-membre ne peut pas lire
   - ✅ Owner peut modifier/supprimer
   - ❌ Membre normal ne peut pas supprimer

4. **Users**
   - ✅ Tout auth peut lire
   - ✅ User peut modifier son propre profil
   - ❌ User ne peut pas modifier le profil d'un autre

## 📊 Monitoring

### Métriques à surveiller

1. **Firestore**
   - Nombre de lectures/écritures
   - Erreurs de permissions
   - Latence des requêtes

2. **Performance**
   - Temps de chargement des pages
   - Taille des documents
   - Nombre de listeners actifs

3. **Erreurs**
   - Logs dans ErrorHandler
   - Échecs de transactions
   - Erreurs de validation

## 🔄 Rollback

Si problème après déploiement :

```bash
# Récupérer la version précédente
git log -- firestore.rules

# Restaurer l'ancienne version
git checkout <commit-hash> -- firestore.rules

# Redéployer
firebase deploy --only firestore:rules
```

## 📝 Notes importantes

- Les règles sont déployées immédiatement (pas de cache)
- Tester d'abord sur un projet de développement
- Sauvegarder les anciennes règles avant modification
- Documenter tous les changements de permissions

## 🐛 Debugging

### Erreur "permission-denied"

1. Vérifier l'authentification de l'utilisateur
2. Vérifier les helper functions dans les rules
3. Tester avec Firebase Emulator
4. Vérifier les logs dans Firebase Console

### Problème de performance

1. Vérifier le nombre de listeners actifs
2. Optimiser les queries (index composites)
3. Implémenter la pagination partout
4. Utiliser `limit()` dans les queries

## 🎯 Prochaines améliorations

- [ ] Indexes composites pour queries complexes
- [ ] Cache client avec React Query
- [ ] Offline persistence Firestore
- [ ] Cloud Functions pour logique serveur
- [ ] Analytics et crash reporting
- [ ] Tests unitaires/intégration
