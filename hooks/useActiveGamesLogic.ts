import { db } from '@/services/firebase';
import log from '@/services/logger';
import { Game } from '@/types/Game';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

export const useActiveGames = () => {
    const { user, isSignedIn } = useAuthContext();
    const [activeGames, setActiveGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSignedIn || !user?.id) {
            setActiveGames([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'games'),
            where('participantIds', 'array-contains', user.id),
            where('status', '==', 'PLAYING'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const games = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Game));
                setActiveGames(games);
                setLoading(false);
            },
            (err) => {
                log.error('useActiveGames snapshot error:', err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [isSignedIn, user?.id]);

    const deleteActiveGame = async (gameId: string) => {
        try {
            await deleteDoc(doc(db, 'games', gameId));
        } catch (error) {
            log.error("Error deleting game: ", error);
        }
    };

    return { activeGames, deleteActiveGame, loading };
}