import { useState, useCallback, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { UserGameStats } from '@/types/UserGameStats';
import { getUserStats } from '@/utils/userStatsManager';
import log from '@/services/logger';

/**
 * Hook pour récupérer et écouter les stats d'un utilisateur
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

    /**
     * Recharge les stats depuis Firestore
     */
    const refresh = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        const freshStats = await getUserStats(userId);
        setStats(freshStats);
        setLoading(false);
    }, [userId]);

    return {
        stats,
        loading,
        refresh,
    };
};
