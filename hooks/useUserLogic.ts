import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, doc, onSnapshot, query, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useUser } from '@/providers/AuthProvider';
import log from '@/services/logger';
import { User, UserStatistics } from '@/types/User';

const EMPTY_STATS: UserStatistics = {
    netProfit: 0,
    gamesPlayed: 0,
    bestRank: 9999,
    wins: 0,
    totalInvested: 0,
    totalWinnings: 0,
};

function normalizeFromUserDoc(stats: Partial<UserStatistics> | undefined): UserStatistics | null {
    if (!stats) return null;
    return {
        netProfit: stats.netProfit ?? 0,
        gamesPlayed: stats.gamesPlayed ?? 0,
        bestRank: stats.bestRank ?? 9999,
        wins: stats.wins ?? 0,
        totalInvested: stats.totalInvested ?? 0,
        totalWinnings: stats.totalWinnings ?? 0,
    };
}

/** Agrégats Cloud Function / user-game-stats (schéma variable) → UserStatistics */
function mapAggregateDoc(data: Record<string, unknown>): UserStatistics {
    const totalBuyins = Number(data.totalBuyIns ?? data.totalBuyins ?? 0);
    const totalWinnings = Number(data.totalCashOuts ?? data.totalWinnings ?? 0);
    const gamesPlayed = Number(data.gamesPlayed ?? data.totalGames ?? 0);
    const wins = Number(data.firstPlaceFinishes ?? data.totalWins ?? 0);
    const net =
        typeof data.totalNetProfit === 'number'
            ? data.totalNetProfit
            : totalWinnings - totalBuyins;
    return {
        netProfit: net,
        gamesPlayed,
        bestRank: typeof data.bestFinish === 'number' ? data.bestFinish : 9999,
        wins,
        totalInvested: totalBuyins,
        totalWinnings,
    };
}

export type LeaderboardUser = {
    id: string;
    name: string;
    avatarUrl?: string;
    netProfit: number;
    gamesPlayed: number;
    totalBuyins: number;
    wins: number;
    rank: number;
};

const LEADERBOARD_PAGE_SIZE = 20;

export const useUserLogic = () => {
    const { user } = useUser();
    /** Stats issues de user-game-stats (optionnel) */
    const [aggregateStats, setAggregateStats] = useState<UserStatistics | null>(null);
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
    // 1. ÉCOUTEUR : user-game-stats (schéma Cloud Functions / phase 3)
    // Ne remplace pas seul l'affichage : endGame met à jour users.statistics en priorité.
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!user?.id) return;

        const statsRef = doc(db, 'user-game-stats', user.id);
        const unsubscribe = onSnapshot(statsRef, (docSnap) => {
            if (!docSnap.exists()) {
                setAggregateStats(null);
                return;
            }
            setAggregateStats(mapAggregateDoc(docSnap.data() as Record<string, unknown>));
        });

        return () => unsubscribe();
    }, [user?.id]);

    const currentUserStats = useMemo((): UserStatistics => {
        const fromUserDoc = normalizeFromUserDoc(userData?.statistics);
        const hasUserDocActivity =
            !!fromUserDoc &&
            (fromUserDoc.gamesPlayed > 0 ||
                fromUserDoc.totalInvested > 0 ||
                fromUserDoc.totalWinnings > 0 ||
                fromUserDoc.netProfit !== 0);

        if (hasUserDocActivity) return fromUserDoc;
        if (aggregateStats) return aggregateStats;
        return fromUserDoc ?? EMPTY_STATS;
    }, [userData?.statistics, aggregateStats]);

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
                const totalBuyins = data.totalBuyIns || data.totalBuyins || 0;
                const netProfit = (data.totalWinnings || 0) - totalBuyins;
                const gamesPlayed = data.gamesPlayed || 0;

                usersData.push({
                    id: docSnap.id,
                    name: data.displayName || docSnap.id,
                    avatarUrl: data.photoURL,
                    netProfit,
                    gamesPlayed,
                    totalBuyins,
                    wins: data.totalWins || 0,
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
                const totalBuyins = data.totalBuyIns || data.totalBuyins || 0;
                const netProfit = (data.totalWinnings || 0) - totalBuyins;
                const gamesPlayed = data.gamesPlayed || 0;

                usersData.push({
                    id: docSnap.id,
                    name: data.displayName || docSnap.id,
                    avatarUrl: data.photoURL,
                    netProfit,
                    gamesPlayed,
                    totalBuyins,
                    wins: data.totalWins || 0,
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