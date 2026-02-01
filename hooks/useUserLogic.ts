import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, doc, onSnapshot, query, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useUser } from '@/providers/AuthProvider';
import log from '@/services/logger';
import { User, UserStatistics } from '@/types/User';

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

    const [userData, setUserData] = useState<User | null>(null);

    // ---------------------------------------------------------------------------
    // 0. Charge les données de l'utilisateur connecté
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!user?.id) {
            setUserData(null);
            return;
        }

        const userRef = doc(db, 'users', user.id);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData({ id: docSnap.id, ...docSnap.data() } as User);
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, [user?.id]);


    // ---------------------------------------------------------------------------
    // 1. ÉCOUTEUR : Mes statistiques personnelles depuis user-game-stats
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!user?.id) return;

        const statsRef = doc(db, 'user-game-stats', user.id);
        const unsubscribe = onSnapshot(statsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCurrentUserStats({
                    netProfit: data.totalWinnings - data.totalBuyins,
                    gamesPlayed: data.gamesPlayed || 0,
                    bestRank: data.bestFinish || 9999,
                    wins: data.firstPlaceFinishes || 0,
                    totalInvested: data.totalBuyins || 0,
                    totalWinnings: data.totalWinnings || 0,
                });
            }
        });

        return () => unsubscribe();
    }, [user?.id]);

    // ---------------------------------------------------------------------------
    // 2. ÉCOUTEUR : Le Classement Général depuis user-game-stats
    // ---------------------------------------------------------------------------
    useEffect(() => {
        setLoading(true);

        // Query avec tri par profit net (winnings - buyins)
        const q = query(
            collection(db, 'user-game-stats'),
            orderBy('totalWinnings', 'desc'),
            limit(LEADERBOARD_PAGE_SIZE)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: LeaderboardUser[] = [];
            let currentRank = 1;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                // Stats depuis user-game-stats (source de vérité)
                const netProfit = (data.totalWinnings || 0) - (data.totalBuyins || 0);
                const gamesPlayed = data.gamesPlayed || 0;

                usersData.push({
                    id: docSnap.id,
                    name: data.displayName || docSnap.id,
                    avatarUrl: data.photoURL,
                    netProfit,
                    gamesPlayed,
                    rank: currentRank++,
                });
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
            collection(db, 'user-game-stats'),
            orderBy('totalWinnings', 'desc'),
            startAfter(lastDoc),
            limit(LEADERBOARD_PAGE_SIZE)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData: LeaderboardUser[] = [];
            let currentRank = leaderboard.length + 1;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const netProfit = (data.totalWinnings || 0) - (data.totalBuyins || 0);
                const gamesPlayed = data.gamesPlayed || 0;

                usersData.push({
                    id: docSnap.id,
                    name: data.displayName || docSnap.id,
                    avatarUrl: data.photoURL,
                    netProfit,
                    gamesPlayed,
                    rank: currentRank++,
                });
            });

            setLeaderboard(prev => [...prev, ...usersData]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === LEADERBOARD_PAGE_SIZE);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [lastDoc, hasMore, leaderboard.length]);

    return {
        user: userData,
        currentUserStats,
        leaderboard,
        loading,
        loadMoreLeaderboard,
        hasMore,
    };
};