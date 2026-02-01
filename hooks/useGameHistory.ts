import { useState, useCallback } from 'react';
import { collection, query, where, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { GameHistorySummary } from '@/types/GameHistory';
import log from '@/services/logger';

const HISTORY_PAGE_SIZE = 20;

export const useGameHistory = (userId?: string, groupId?: string) => {
    const [history, setHistory] = useState<GameHistorySummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);

    /**
     * Charge l'historique des parties
     */
    const loadHistory = useCallback(async () => {
        setLoading(true);

        try {
            let q = query(collection(db, 'game-history'));

            // Filtres
            if (groupId) {
                q = query(q, where('groupId', '==', groupId));
            }

            // Tri par date décroissante
            q = query(q, orderBy('finishedAt', 'desc'), limit(HISTORY_PAGE_SIZE));

            const snapshot = await getDocs(q);
            const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GameHistorySummary));

            setHistory(games);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === HISTORY_PAGE_SIZE);

        } catch (error) {
            log.error('Error loading game history:', error);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    /**
     * Charge plus de résultats
     */
    const loadMore = useCallback(async () => {
        if (!lastDoc || !hasMore || loading) return;

        setLoading(true);

        try {
            let q = query(collection(db, 'game-history'));

            if (groupId) {
                q = query(q, where('groupId', '==', groupId));
            }

            q = query(
                q,
                orderBy('finishedAt', 'desc'),
                startAfter(lastDoc),
                limit(HISTORY_PAGE_SIZE)
            );

            const snapshot = await getDocs(q);
            const newGames = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GameHistorySummary));

            setHistory(prev => [...prev, ...newGames]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === HISTORY_PAGE_SIZE);

        } catch (error) {
            log.error('Error loading more history:', error);
        } finally {
            setLoading(false);
        }
    }, [lastDoc, hasMore, loading, groupId]);

    /**
     * Historique d'un joueur spécifique
     */
    const loadPlayerHistory = useCallback(async (playerId: string) => {
        setLoading(true);

        try {
            const q = query(
                collection(db, 'game-history'),
                where('players', 'array-contains', playerId),
                orderBy('finishedAt', 'desc'),
                limit(HISTORY_PAGE_SIZE)
            );

            const snapshot = await getDocs(q);
            const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GameHistorySummary));

            setHistory(games);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === HISTORY_PAGE_SIZE);

        } catch (error) {
            log.error('Error loading player history:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        history,
        loading,
        hasMore,
        loadHistory,
        loadMore,
        loadPlayerHistory,
    };
};
