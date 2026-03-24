import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    QueryDocumentSnapshot,
    DocumentData,
} from 'firebase/firestore';
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

/** Avatar stocké `avatarURL` (sync Clerk) ou `avatarUrl` */
function userAvatar(data: Record<string, unknown>): string | undefined {
    const a = data.avatarURL ?? data.avatarUrl;
    return typeof a === 'string' ? a : undefined;
}

export const useUserLogic = () => {
    const { user } = useUser();
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const [userData, setUserData] = useState<User | null>(null);

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

    const currentUserStats = useMemo((): UserStatistics => {
        const fromUserDoc = normalizeFromUserDoc(userData?.statistics);
        return fromUserDoc ?? EMPTY_STATS;
    }, [userData?.statistics]);

    /** Classement : collection users, stats mises à jour par la Cloud Function à FINISHED (hybride A + B). */
    useEffect(() => {
        setLoading(true);

        const q = query(
            collection(db, 'users'),
            orderBy('statistics.netProfit', 'desc'),
            limit(LEADERBOARD_PAGE_SIZE)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const usersData: LeaderboardUser[] = [];
                let currentRank = 1;

                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as Record<string, unknown>;
                    const stats = (data.statistics as Record<string, unknown> | undefined) ?? {};
                    const gamesPlayed = Number(stats.gamesPlayed ?? 0);
                    const wins = Number(stats.wins ?? 0);
                    const totalBuyins = Number(stats.totalInvested ?? 0);
                    const netProfit = Number(stats.netProfit ?? 0);

                    if (gamesPlayed < 1) {
                        return;
                    }

                    usersData.push({
                        id: docSnap.id,
                        name: (data.displayName as string) || docSnap.id,
                        avatarUrl: userAvatar(data),
                        netProfit,
                        gamesPlayed,
                        totalBuyins,
                        wins,
                        rank: currentRank++,
                    });
                });

                setLeaderboard(usersData);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
                setHasMore(snapshot.docs.length === LEADERBOARD_PAGE_SIZE);
                setLoading(false);
            },
            (error) => {
                log.error('Erreur Leaderboard:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const loadMoreLeaderboard = useCallback(async () => {
        if (!lastDoc || !hasMore) return;

        setLoading(true);
        const q = query(
            collection(db, 'users'),
            orderBy('statistics.netProfit', 'desc'),
            startAfter(lastDoc),
            limit(LEADERBOARD_PAGE_SIZE)
        );

        try {
            const snapshot = await getDocs(q);
            const usersData: LeaderboardUser[] = [];
            let currentRank = leaderboard.length + 1;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Record<string, unknown>;
                const stats = (data.statistics as Record<string, unknown> | undefined) ?? {};
                const gamesPlayed = Number(stats.gamesPlayed ?? 0);
                const wins = Number(stats.wins ?? 0);
                const totalBuyins = Number(stats.totalInvested ?? 0);
                const netProfit = Number(stats.netProfit ?? 0);

                if (gamesPlayed < 1) {
                    return;
                }

                usersData.push({
                    id: docSnap.id,
                    name: (data.displayName as string) || docSnap.id,
                    avatarUrl: userAvatar(data),
                    netProfit,
                    gamesPlayed,
                    totalBuyins,
                    wins,
                    rank: currentRank++,
                });
            });

            setLeaderboard((prev) => [...prev, ...usersData]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === LEADERBOARD_PAGE_SIZE);
        } catch (e) {
            log.error('loadMoreLeaderboard', e);
        } finally {
            setLoading(false);
        }
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
