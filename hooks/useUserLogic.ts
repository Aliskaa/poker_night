import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useUser } from '@clerk/clerk-expo';
import log from '@/services/logger';
import { UserStatistics } from '@/types/User';

export type LeaderboardUser = {
    id: string;
    name: string;
    avatarUrl?: string;
    netProfit: number;
    gamesPlayed: number;
    rank: number;
};

export const useUserLogic = () => {
    const { user } = useUser();
    const [currentUserStats, setCurrentUserStats] = useState<UserStatistics>({
        netProfit: 0,
        gamesPlayed: 0,
        bestRank: 9999,
        wins: 0,
        totalInvested: 0,
        totalWinnings: 0,
    });
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    // ---------------------------------------------------------------------------
    // 1. ÉCOUTEUR : Mes statistiques personnelles (Bankroll)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.id);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().statistics) {
                setCurrentUserStats(docSnap.data().statistics as UserStatistics);
            }
        });

        return () => unsubscribe();
    }, [user]);

    // ---------------------------------------------------------------------------
    // 2. ÉCOUTEUR : Le Classement Général (En Temps Réel)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        setLoading(true);

        // On écoute toute la collection "users"
        const q = query(collection(db, 'users'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: any[] = [];

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.statistics) {
                    usersData.push({
                        id: docSnap.id,
                        name: data.firstName || data.username || "Joueur",
                        avatarUrl: data.imageUrl || data.avatarUrl,
                        netProfit: data.statistics.netProfit || 0,
                        gamesPlayed: data.statistics.gamesPlayed || 0,
                    });
                }
            });

            // Tri par le plus gros profit
            const sortedUsers = usersData.sort((a, b) => b.netProfit - a.netProfit);
            // Attribution des rangs
            const rankedUsers = sortedUsers.map((u, index) => ({ ...u, rank: index + 1 }));

            setLeaderboard(rankedUsers);
            setLoading(false);
        }, (error) => {
            log.error("Erreur Leaderboard:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return {
        currentUserStats,
        leaderboard,
        loading
    };
};