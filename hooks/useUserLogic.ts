import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, doc, onSnapshot, query, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
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

const LEADERBOARD_PAGE_SIZE = 20;

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
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);

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
    // 2. ÉCOUTEUR : Le Classement Général (Paginé)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        setLoading(true);

        // Query avec tri et limite
        const q = query(
            collection(db, 'users'),
            orderBy('statistics.netProfit', 'desc'),
            limit(LEADERBOARD_PAGE_SIZE)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: LeaderboardUser[] = [];
            let currentRank = 1;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.statistics) {
                    usersData.push({
                        id: docSnap.id,
                        name: data.displayName || data.firstName || data.username || "Joueur",
                        avatarUrl: data.imageUrl || data.avatarUrl,
                        netProfit: data.statistics.netProfit || 0,
                        gamesPlayed: data.statistics.gamesPlayed || 0,
                        rank: currentRank++,
                    });
                }
            });

            setLeaderboard(usersData);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === LEADERBOARD_PAGE_SIZE);
            setLoading(false);
        }, (error) => {
            log.error("Erreur Leaderboard:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Charger plus de résultats
    const loadMoreLeaderboard = useCallback(async () => {
        if (!lastDoc || !hasMore) return;

        setLoading(true);

        const q = query(
            collection(db, 'users'),
            orderBy('statistics.netProfit', 'desc'),
            startAfter(lastDoc),
            limit(LEADERBOARD_PAGE_SIZE)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: LeaderboardUser[] = [];
            let currentRank = leaderboard.length + 1;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.statistics) {
                    usersData.push({
                        id: docSnap.id,
                        name: data.displayName || data.firstName || data.username || "Joueur",
                        avatarUrl: data.imageUrl || data.avatarUrl,
                        netProfit: data.statistics.netProfit || 0,
                        gamesPlayed: data.statistics.gamesPlayed || 0,
                        rank: currentRank++,
                    });
                }
            });

            setLeaderboard(prev => [...prev, ...usersData]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === LEADERBOARD_PAGE_SIZE);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [lastDoc, hasMore, leaderboard.length]);

    return {
        currentUserStats,
        leaderboard,
        loading,
        loadMoreLeaderboard,
        hasMore,
    };
};