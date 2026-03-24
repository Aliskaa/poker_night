import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { UserGameStats } from '@/types/UserGameStats';
import log from '@/services/logger';

/**
 * Statistiques agrégées (user-game-stats), alimentées par la Cloud Function à la fin de partie.
 */
export const useUserStats = (userId: string | undefined) => {
    const [stats, setStats] = useState<UserGameStats | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) {
            setStats(null);
            return;
        }

        setLoading(true);
        const statsRef = doc(db, 'user-game-stats', userId);

        const unsubscribe = onSnapshot(
            statsRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setStats({ userId, ...snapshot.data() } as UserGameStats);
                } else {
                    setStats(null);
                }
                setLoading(false);
            },
            (error) => {
                log.error('Error listening to user stats:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const refresh = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const statsRef = doc(db, 'user-game-stats', userId);
            const statsSnap = await getDoc(statsRef);
            if (statsSnap.exists()) {
                setStats({ userId, ...statsSnap.data() } as UserGameStats);
            } else {
                setStats(null);
            }
        } catch (e) {
            log.error('Error fetching user stats:', e);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    return {
        stats,
        loading,
        refresh,
    };
};
