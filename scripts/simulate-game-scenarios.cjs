#!/usr/bin/env node
/**
 * Simulation de parties Poker Night (Firestore + triggers Cloud Functions)
 *
 * Prérequis :
 *   1) npm install (racine) — firebase-admin est en devDependency
 *   2) Identifiants admin (obligatoire — sinon erreur « default credentials ») :
 *        npm run simulate:poker -- ensure-users --service-account .\\chemin\\sa.json --uids ...
 *      ou variables :
 *        set GOOGLE_APPLICATION_CREDENTIALS=C:\\chemin\\serviceAccount.json
 *      ou : gcloud auth application-default login
 *
 * UIDs : ce sont les mêmes que Firebase Auth (Console → Authentication). Au moins 4
 * comptes distincts pour un scénario podium réaliste.
 *
 * Usage :
 *   npm run simulate:poker -- ensure-users --uids <hôte,e,j,e>
 *   npm run simulate:poker -- playing --uids <hôte,j1,j2,j3>
 *   npm run simulate:poker -- finish --game <gameId>
 *   npm run simulate:poker -- finish-last
 *   npm run simulate:poker -- full --uids <hôte,j1,j2,j3>
 *   npm run simulate:poker -- clean
 *
 * Après `finish`, vérifie les logs Functions (syncStats) puis l’app : profil, classement,
 * historique (après archivage ~1h ou ajustement manuel côté serveur).
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const DEMO_SOURCE = 'simulate-script';
const LAST_ID_FILE = path.join(__dirname, '.last-sim-game-id');

const DEFAULT_CONFIG = {
  defaultBuyIn: 20,
  payoutModel: '50_30_20',
  defaultTimeBlindDuration: 600,
  lateRegLimit: 60,
};

function loadProjectId(argv) {
  const i = argv.indexOf('--project');
  if (i !== -1 && argv[i + 1]) return argv[i + 1];
  if (process.env.GCLOUD_PROJECT) return process.env.GCLOUD_PROJECT;
  if (process.env.GOOGLE_CLOUD_PROJECT) return process.env.GOOGLE_CLOUD_PROJECT;
  const rc = path.join(__dirname, '..', '.firebaserc');
  const raw = JSON.parse(fs.readFileSync(rc, 'utf8'));
  return raw.projects?.default || null;
}

function parseUids(argv) {
  const i = argv.indexOf('--uids');
  if (i !== -1 && argv[i + 1]) {
    return argv[i + 1].split(',').map((s) => s.trim()).filter(Boolean);
  }
  const env = process.env.POKER_SIM_UIDS;
  if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
  return null;
}

/** Chemin absolu vers le JSON compte de service (--service-account ou env). */
function resolveServiceAccountPath(argv) {
  const i = argv.indexOf('--service-account');
  if (i !== -1 && argv[i + 1]) {
    return path.resolve(process.cwd(), argv[i + 1]);
  }
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.POKER_SIM_SERVICE_ACCOUNT;
  if (fromEnv) return path.resolve(process.cwd(), fromEnv.trim());
  return null;
}

function initAdmin(projectId, argv) {
  if (!projectId) {
    console.error('Impossible de déterminer projectId (.firebaserc ou --project).');
    process.exit(1);
  }
  if (!admin.apps.length) {
    const saPath = resolveServiceAccountPath(argv);
    if (saPath) {
      if (!fs.existsSync(saPath)) {
        console.error('Fichier compte de service introuvable :', saPath);
        process.exit(1);
      }
      const raw = fs.readFileSync(saPath, 'utf8');
      const json = JSON.parse(raw);
      admin.initializeApp({
        credential: admin.credential.cert(json),
        projectId: json.project_id || projectId,
      });
    } else {
      admin.initializeApp({ projectId });
    }
  }
  return admin.firestore();
}

async function deleteGameAndPlayers(db, gameId) {
  const gameRef = db.collection('games').doc(gameId);
  const snap = await gameRef.collection('players').get();
  const dels = snap.docs.map((d) => d.ref.delete());
  await Promise.all(dels);
  await gameRef.delete();
  console.log('Supprimé jeu', gameId);
}

async function cmdClean(db) {
  const q = await db.collection('games').where('demoSource', '==', DEMO_SOURCE).get();
  if (q.empty) {
    console.log('Aucune partie démo à nettoyer.');
    return;
  }
  for (const docSnap of q.docs) {
    await deleteGameAndPlayers(db, docSnap.id);
  }
  if (fs.existsSync(LAST_ID_FILE)) fs.unlinkSync(LAST_ID_FILE);
  console.log('Nettoyage terminé.', q.size, 'partie(s).');
}

function writeLastId(id) {
  fs.writeFileSync(LAST_ID_FILE, id, 'utf8');
}

function readLastId() {
  if (!fs.existsSync(LAST_ID_FILE)) return null;
  return fs.readFileSync(LAST_ID_FILE, 'utf8').trim();
}

async function cmdEnsureUsers(db, uids) {
  if (!uids || uids.length < 1) {
    console.error('Fournir --uids ou POKER_SIM_UIDS');
    process.exit(1);
  }
  const batch = db.batch();
  const FieldValue = admin.firestore.FieldValue;
  for (let i = 0; i < uids.length; i++) {
    const uid = uids[i];
    const ref = db.collection('users').doc(uid);
    batch.set(
      ref,
      {
        displayName: `Sim ${uid.slice(0, 6)}`,
        email: `sim+${i}@poker-night.local`,
        createdAt: FieldValue.serverTimestamp(),
        lastLoginAt: FieldValue.serverTimestamp(),
        groupIds: [],
        statistics: {
          gamesPlayed: 0,
          wins: 0,
          totalInvested: 0,
          totalWinnings: 0,
          netProfit: 0,
          bestRank: 9999,
        },
        demoSource: DEMO_SOURCE,
      },
      { merge: true }
    );
  }
  await batch.commit();
  console.log('Profils utilisateur assurés (merge) :', uids.length);
}

/**
 * Partie PLAYING : 1 actif (futur 1er), places 2–3 éliminés, un 4e éliminé sans prime.
 */
async function cmdPlaying(db, uids) {
  if (!uids || uids.length < 4) {
    console.error('Il faut au moins 4 UIDs (hôte + 3 joueurs). Ex. --uids host,a,b,c');
    process.exit(1);
  }
  const hostId = uids[0];
  const gameRef = db.collection('games').doc();
  const FieldValue = admin.firestore.FieldValue;
  const totalPot = 400;
  const now = admin.firestore.Timestamp.now();

  const batch = db.batch();

  batch.set(gameRef, {
    hostId,
    participantIds: uids,
    groupId: null,
    status: 'PLAYING',
    config: DEFAULT_CONFIG,
    totalPot,
    createdAt: FieldValue.serverTimestamp(),
    startedAt: now,
    currentBlindLevel: 2,
    blindLevelStartedAt: FieldValue.serverTimestamp(),
    isPaused: false,
    demoSource: DEMO_SOURCE,
    metadata: {
      lastActivity: FieldValue.serverTimestamp(),
      playerCount: uids.length,
      activePlayers: 1,
    },
  });

  const playersSetup = [
    { uid: uids[0], isActive: true, finalRank: null, name: 'Sim — Leader (actif)' },
    { uid: uids[1], isActive: false, finalRank: 2, name: 'Sim — 2e' },
    { uid: uids[2], isActive: false, finalRank: 3, name: 'Sim — 3e' },
    { uid: uids[3], isActive: false, finalRank: 4, name: 'Sim — 4e (hors podium)' },
  ];

  for (const p of playersSetup) {
    const pref = gameRef.collection('players').doc(p.uid);
    batch.set(pref, {
      userId: p.uid,
      name: p.name,
      buyInAmount: DEFAULT_CONFIG.defaultBuyIn,
      totalInvested: DEFAULT_CONFIG.defaultBuyIn,
      rebuyCount: 0,
      winnings: 0,
      isActive: p.isActive,
      position: playersSetup.indexOf(p),
      finalRank: p.finalRank,
      joinedAt: now,
    });
  }

  await batch.commit();
  writeLastId(gameRef.id);
  console.log('\nPartie PLAYING créée.');
  console.log('  gameId   :', gameRef.id);
  console.log('  deep link:', `/(main)/game/${gameRef.id}`);
  console.log('  hôte     :', hostId, '(doit ouvrir la partie avec ce compte pour les actions hôte)\n');
}

/** Met à jour joueurs + FINISHED comme hooks/useGameLogic endGame */
async function cmdFinish(db, gameId) {
  if (!gameId) {
    console.error('Fournir --game <id> ou utiliser finish-last');
    process.exit(1);
  }
  const gameRef = db.collection('games').doc(gameId);
  const gameSnap = await gameRef.get();
  if (!gameSnap.exists) {
    console.error('Partie introuvable:', gameId);
    process.exit(1);
  }
  const game = gameSnap.data();
  const playersSnap = await gameRef.collection('players').get();
  const players = playersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const totalPot = game.totalPot || 0;
  const payout1 = Math.round(totalPot * 0.5);
  const payout2 = Math.round(totalPot * 0.3);
  const payout3 = totalPot - payout1 - payout2;

  const batch = db.batch();
  batch.update(gameRef, {
    status: 'FINISHED',
    finishedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  for (const player of players) {
    const pref = gameRef.collection('players').doc(player.id);
    let finalPayout = 0;
    let finalRank = player.finalRank;

    if (player.isActive) {
      finalRank = 1;
      finalPayout = payout1;
    } else if (player.finalRank === 2) {
      finalPayout = payout2;
    } else if (player.finalRank === 3) {
      finalPayout = payout3;
    }

    batch.update(pref, {
      winnings: finalPayout,
      finalRank,
      isActive: false,
    });
  }

  await batch.commit();
  console.log('Partie terminée (FINISHED + payouts). Attendre ~s pour syncStats Cloud Function.');
  console.log('  Vérif : users.statistics, user-game-stats, champ serverStatsAppliedAt sur la partie.');
}

async function cmdFinishLast(db) {
  const id = readLastId();
  if (!id) {
    console.error('Pas de dernière partie (fichier scripts/.last-sim-game-id manquant). Lance `playing` d’abord.');
    process.exit(1);
  }
  await cmdFinish(db, id);
}

async function cmdFull(db, uids) {
  await cmdPlaying(db, uids);
  const id = readLastId();
  await cmdFinish(db, id);
}

function printHelp() {
  console.log(`
Poker Night — simulation Firestore

Commandes :
  ensure-users   Crée / fusionne des docs users (stats à zéro) pour les --uids
  playing        Crée une partie PLAYING démo (4 joueurs)
  finish         --game <id>  Applique la même logique que endGame (client)
  finish-last    Termine la dernière partie créée par ce script
  full           playing + finish enchaînés
  clean          Supprime toutes les parties marquées demoSource="${DEMO_SOURCE}"

Options :
  --service-account <fichier.json>  Clé compte de service Firebase (recommandé sous Windows)
  --uids a,b,c,d   Obligatoire pour ensure-users, playing, full (sauf env POKER_SIM_UIDS)
  --game <id>      Pour finish
  --project <id>   Surcharge le projet Firebase

Variables :
  POKER_SIM_UIDS   Liste d’UIDs séparés par des virgules
  GOOGLE_APPLICATION_CREDENTIALS ou POKER_SIM_SERVICE_ACCOUNT  Chemin vers le JSON
`);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const cmd = argv[0];
  const projectIdHint = loadProjectId(argv);
  const db = initAdmin(projectIdHint, argv);
  const uids = parseUids(argv);
  const projectId = admin.app().options.projectId || projectIdHint;

  console.log('Project:', projectId);

  switch (cmd) {
    case 'clean':
      await cmdClean(db);
      break;
    case 'ensure-users':
      await cmdEnsureUsers(db, uids);
      break;
    case 'playing':
      await cmdPlaying(db, uids);
      break;
    case 'finish':
      const gi = argv.indexOf('--game');
      const gameId = gi !== -1 ? argv[gi + 1] : null;
      await cmdFinish(db, gameId);
      break;
    case 'finish-last':
      await cmdFinishLast(db);
      break;
    case 'full':
      await cmdFull(db, uids);
      break;
    default:
      console.error('Commande inconnue:', cmd);
      printHelp();
      process.exit(1);
  }

  process.exit(0);
}

main().catch((e) => {
  const msg = String(e && e.message ? e.message : e);
  if (/default credentials|Could not load|ENOTFOUND metadata|authentication/i.test(msg)) {
    console.error(`
[Firebase Admin] Identifiants absents ou invalides.

1) Télécharge un JSON « Compte de service » (Console Firebase → ⚙ → Comptes de service).

2) Puis sous Windows (cmd) :
   set GOOGLE_APPLICATION_CREDENTIALS=C:\\chemin\\vers\\ton-projet-firebase-adminsdk.json

   Ou en une ligne sans variable d’environnement :
   npm run simulate:poker -- ensure-users --service-account C:\\chemin\\vers\\ton.json --uids uid1,uid2,...

3) Les UIDs doivent être les vrais identifiants Firebase Auth (chaînes longues), pas des libellés type « J1 ».

4) Alternative : gcloud auth application-default login
`);
  }
  console.error(e);
  process.exit(1);
});
