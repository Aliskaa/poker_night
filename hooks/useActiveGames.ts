import { db } from '@/services/firebase';
import { Game } from '@/types/Game';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useActiveGames = () => {
    const [activeGames, setActiveGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔒 V2 : La requête cible les parties en cours.
        // Plus tard, on ajoutera un filtre : where('groupId', 'in', myGroupIds)
        const q = query(
            collection(db, 'games'),
            where('status', '==', 'PLAYING'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
            setActiveGames(games);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { activeGames, loading };
};