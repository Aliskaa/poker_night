import { useState, useEffect } from 'react';
import { collection, doc, query, where, onSnapshot, addDoc, updateDoc, arrayUnion, getDocs, serverTimestamp, documentId, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useUser } from '@clerk/clerk-expo';
import log from '@/services/logger';
import { Group } from '@/types/Groups';
import { Guest } from '@/types/Player';
import { useToast } from './useToast';

export const useGroupLogic = (groupId?: string) => {
  const { user } = useUser();
  const { success: successToast, error: errorToast } = useToast();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [memberDetails, setMemberDetails] = useState<any[]>([]);
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
          setMemberDetails(usersSnap.docs.map(u => ({ id: u.id, ...u.data() })));
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
  const createGroup = async (name: string) => {
    if (!user || !name) return null;
    const inviteCode = "POK-" + Math.random().toString(36).substring(2, 6).toUpperCase();

    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        name,
        ownerId: user.id,
        inviteCode,
        members: [user.id],
        guests: [],
        createdAt: serverTimestamp(),
      });

      successToast("Groupe créé avec succès !");

      return docRef.id;
    } catch (error) {
      log.error("Erreur création groupe:", error);
      return null;
    }
  };

  // Rejoindre un Club via Code
  const joinGroup = async (code: string) => {
    if (!user || !code) return { success: false, message: "Code manquant" };

    try {
      const q = query(collection(db, 'groups'), where('inviteCode', '==', code.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return { success: false, message: "Code introuvable" };

      const groupDoc = querySnapshot.docs[0];
      await updateDoc(groupDoc.ref, { members: arrayUnion(user.id) });
      return { success: true, groupId: groupDoc.id };
    } catch (error) {
      log.error("Erreur pour rejoindre:", error);
      return { success: false, message: "Erreur serveur" };
    }
  };

  // Ajouter un invité local (Shadow Profile) au club actuel
  const addGuestToGroup = async (guestName: string) => {
    if (!groupId || !currentGroup) return;

    const newGuest: Guest = {
      id: `guest_${Date.now()}`,
      name: guestName,
      gamesPlayed: 0,
      netProfit: 0,
    };

    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, { guests: arrayUnion(newGuest) });
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