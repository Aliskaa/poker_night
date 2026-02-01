import { db } from "@/services/firebase";
import log from "@/services/logger";
import { useUser } from "@/providers/AuthProvider";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";
import { useToast } from "./useToast";

export const useSyncUser = () => {
    const { user, isLoaded } = useUser();
    const { info, error: errorToast } = useToast();

    useEffect(() => {
        const syncUserToFirestore = async () => {
            if (!isLoaded || !user?.id) return;

            const userRef = doc(db, 'users', user.id);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                try {
                    const displayName = user.fullName || user.email?.split('@')[0] || 'Joueur';

                    const newUser = {
                        displayName: displayName,
                        avatarURL: user.imageUrl || '',
                        email: user.email || '',
                        createdAt: serverTimestamp(),
                        lastLoginAt: serverTimestamp(),
                        groupIds: [],
                    };

                    await setDoc(userRef, newUser);
                    log.info("✅ Nouvel utilisateur créé dans Firestore :", user.id);
                    info("Bienvenue, " + displayName + " !");
                } catch (error) {
                    log.error("❌ Erreur lors de la création de l'utilisateur :", error);
                    errorToast("Erreur lors de la création de votre profil.");
                }
            } else {
                try {
                    await updateDoc(userRef, {
                        lastLoginAt: serverTimestamp(),
                        avatarURL: user.imageUrl || userSnap.data().avatarURL,
                    });
                    info("Bon retour, " + (userSnap.data().displayName || 'Joueur') + " !");
                } catch (error) {
                    log.error("❌ Erreur lors de la mise à jour de l'utilisateur :", error);
                    errorToast("Erreur lors de la mise à jour de votre profil.");
                }
            }
        };

        syncUserToFirestore();
    }, [isLoaded, user?.id]);
}
