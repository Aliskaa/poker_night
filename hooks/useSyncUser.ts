import { db } from "@/services/firebase";
import log from "@/services/logger";
import { useUser } from "@clerk/clerk-expo"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";

export const useSyncUser = () => {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const syncUserToFirestore = async () => {
            if (!isLoaded || !user) return;

            const userRef = doc(db, 'users', user.id);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                try {

                    const fullName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null;
                    const displayName = fullName || user.username || 'Joueur';

                    const newUser = {
                        displayName: displayName,
                        avatarUrl: user.imageUrl || '',
                        createdAt: Date.now(), // Tu utilises des 'number' dans ton type
                        lastLoginAt: Date.now(),
                        groupIds: [], // Vide au départ
                        statistics: {
                            gamesPlayed: 0,
                            wins: 0,
                            totalInvested: 0,
                            totalWinnings: 0,
                            netProfit: 0,
                            bestRank: 999, // 999 = Pas encore de classement
                        }
                    };

                    await setDoc(userRef, newUser);
                    log.info("✅ Nouvel utilisateur créé dans Firestore :", user.id);
                } catch (error) {
                    log.error("❌ Erreur lors de la création de l'utilisateur :", error);
                }
            } else {
                try {
                    await updateDoc(userRef, {
                        lastLoginAt: Date.now(),
                        avatarUrl: user.imageUrl || userSnap.data().avatarUrl,
                    });
                } catch (error) {
                    log.error("❌ Erreur lors de la mise à jour de l'utilisateur :", error);
                }
            }
        };

        syncUserToFirestore();
    }, [isLoaded, user]);
}
