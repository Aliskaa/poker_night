import { AddGuestToGroupSchema, CreateGroupSchema, JoinGroupSchema } from '@/lib/validations/group';
import log from '@/services/logger';
import { Group } from '@/types/Groups';
import { Guest } from '@/types/Player';
import { User } from '@/types/User';
import { useUser } from '@/providers/AuthProvider';
import { addDoc, collection, deleteDoc, doc, documentId, getDocs, onSnapshot, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { db } from '../services/firebase';
import { useToast } from './useToast';
import { ErrorHandler, generateSecureId } from '@/utils/errorHandler';
import { ZodError } from 'zod';

export const useGroupLogic = (groupId?: string) => {
  const { user } = useUser();
  const { success: successToast, error: errorToast } = useToast();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [memberDetails, setMemberDetails] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ---------------------------------------------------------------------------
  // 1. ÉCOUTEUR : Tous les groupes de l'utilisateur (si pas de groupId fourni)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!user || groupId) return;

    setLoading(true);
    const q = query(collection(db, 'groups'), where('members', 'array-contains', user.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, groupId]);

  // ---------------------------------------------------------------------------
  // 2. ÉCOUTEUR : Un groupe spécifique (si groupId fourni) + Ses membres
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!groupId) return;

    setLoading(true);
    const groupRef = doc(db, 'groups', groupId);

    const unsubscribe = onSnapshot(groupRef, async (docSnap) => {
      if (docSnap.exists()) {
        const groupData = { id: docSnap.id, ...docSnap.data() } as Group;
        setCurrentGroup(groupData);

        // Récupération des détails (avatars/noms) des membres depuis la collection "users"
        if (groupData.members.length > 0) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where(documentId(), 'in', groupData.members));
          const usersSnap = await getDocs(q);
          setMemberDetails(usersSnap.docs.map(u => ({ id: u.id, ...u.data() } as User)));
        }
      } else {
        setCurrentGroup(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  // Créer un nouveau Club
  const createGroup = useCallback(async (name: string) => {
    if (!user || !name) return null;

    return ErrorHandler.tryAsync(
      async () => {
        const validatedData = CreateGroupSchema.parse({ name });
        const inviteCode = "POK-" + Math.random().toString(36).substring(2, 6).toUpperCase();

        const docRef = await addDoc(collection(db, 'groups'), {
          name: validatedData.name,
          ownerId: user.id,
          inviteCode,
          members: [user.id],
          guests: [],
          createdAt: serverTimestamp(),
        });

        successToast("Groupe créé avec succès !");
        return docRef.id;
      },
      'createGroup',
      (error) => errorToast(error.message)
    );
  }, [user, successToast, errorToast]);

  // Rejoindre un Club via Code
  const joinGroup = useCallback(async (code: string) => {
    if (!user || !code) return { success: false, message: "Code manquant" };

    const result = await ErrorHandler.tryAsync(
      async () => {
        const validatedData = JoinGroupSchema.parse({ inviteCode: code });
        const q = query(collection(db, 'groups'), where('inviteCode', '==', validatedData.inviteCode.toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('Code introuvable');
        }

        const groupDoc = querySnapshot.docs[0];
        
        await runTransaction(db, async (transaction) => {
          const groupSnap = await transaction.get(groupDoc.ref);
          if (!groupSnap.exists()) {
            throw new Error('Group not found');
          }

          const groupData = groupSnap.data() as Group;
          if (groupData.members.includes(user.id)) {
            throw new Error('Vous êtes déjà membre');
          }

          transaction.update(groupDoc.ref, { 
            members: [...groupData.members, user.id] 
          });
        });

        successToast("Vous avez rejoint le groupe !");
        return { success: true, groupId: groupDoc.id };
      },
      'joinGroup',
      (error) => errorToast(error.message)
    );

    return result || { success: false, message: "Erreur serveur" };
  }, [user, successToast, errorToast]);

  // Ajouter un invité local (Shadow Profile) au club actuel
  const addGuestToGroup = async (guestName: string) => {
    if (!groupId || !currentGroup) return;

    try {
      // ✅ VALIDATION
      const validatedData = AddGuestToGroupSchema.parse({ guestName });

      const newGuest: Guest = {
        id: `guest_${Date.now()}`,
        name: validatedData.guestName,
        gamesPlayed: 0,
        netProfit: 0,
      };

      const groupRef = doc(db, 'groups', groupId);
      
      // ✅ UTILISATION DE TRANSACTION
      await runTransaction(db, async (transaction) => {
        const groupSnap = await transaction.get(groupRef);
        if (!groupSnap.exists()) {
          throw new Error('Group not found');
        }

        const groupData = groupSnap.data() as Group;
        transaction.update(groupRef, { 
          guests: [...groupData.guests, newGuest] 
        });
      });

      successToast("Invité ajouté avec succès !");
    } catch (error) {
      if (error instanceof ZodError) {
        errorToast(`Erreur: ${error.issues[0].message}`);
      } else {
        log.error("Erreur ajout invité:", error);
        errorToast("Erreur lors de l'ajout de l'invité");
      }
    }
  };

  const deleteGroup = async () => {
    if (!groupId || !currentGroup || !user) return;

    if (currentGroup.ownerId !== user.id) {
      errorToast("Seul le propriétaire peut supprimer le groupe.");
      return;
    }

    try {
      const groupRef = doc(db, 'groups', groupId);
      await deleteDoc(groupRef);
      successToast("Groupe supprimé avec succès !");
      return true;
    } catch (error) {
      log.error("Erreur suppression groupe:", error);
      return false;
    }
  }

  return {
    userGroups,
    currentGroup,
    memberDetails,
    loading,
    createGroup,
    joinGroup,
    addGuestToGroup,
    deleteGroup,
  };
};