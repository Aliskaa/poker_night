import { useEffect, useState } from "react";
import { Game } from "@/types/Game";

const DEFAULT_BLIND_TIMER = 20; // 20 minutes en secondes

interface UseGameTimersReturn {
    // Timer des blindes (pour le bottom sheet)
    timerSeconds: number;
    setTimerSeconds: (seconds: number) => void;
    isTimerRunning: boolean;
    setIsTimerRunning: (running: boolean) => void;
    toggleTimer: () => void;
    resetTimer: () => void;

    // Timer de late registration
    lateRegSeconds: number | null;
}

/**
 * Hook personnalisé pour gérer les timers du jeu
 * - Timer des blindes (configurable, manuel)
 * - Timer de late registration (automatique basé sur la création du jeu)
 */
export const useGameTimers = (game: Game | null): UseGameTimersReturn => {

    const timeBlindDurartion = (game?.config?.defaultTimeBlindDuration ?? DEFAULT_BLIND_TIMER) * 60;
    // === TIMER 1 : Blindes (Manuel) ===
    const [timerSeconds, setTimerSeconds] = useState(
        timeBlindDurartion
    );
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // === TIMER 2 : Late Registration (Automatique) ===
    const [lateRegSeconds, setLateRegSeconds] = useState<number | null>(null);

    // ---------------------------------------------------------------------------
    // CHRONO 1 : Timer des Blindes (Bottom Sheet)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds((prev) => {
                    if (prev <= 1) {
                        setIsTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerRunning, timerSeconds]);


    // ---------------------------------------------------------------------------
    // CHRONO 2 : Compte à rebours du Late Registration (En-tête)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        // Si pas de game ou late reg illimité (0), on réinitialise
        if (!game || game.config.lateRegLimit === 0) {
            setLateRegSeconds(null);
            return;
        }

        // Calcul de la date de départ robuste (Firestore Timestamp → Date JS)
        let startTime = Date.now();

        if (game.createdAt) {
            // Firestore Timestamp avec méthode toDate()
            if (typeof (game.createdAt as any).toDate === 'function') {
                startTime = (game.createdAt as any).toDate().getTime();
            }
            // Firestore Timestamp avec propriété seconds
            else if ((game.createdAt as any).seconds) {
                startTime = (game.createdAt as any).seconds * 1000;
            }
            // Date JavaScript standard
            else if (game.createdAt instanceof Date) {
                startTime = game.createdAt.getTime();
            }
        }

        // Calcul de l'heure de fin de late reg (en millisecondes)
        const endTime = startTime + (game.config.lateRegLimit * 60 * 1000);

        // Mise à jour toutes les secondes
        const interval = setInterval(() => {
            const now = Date.now();
            const diffInSeconds = Math.max(0, Math.floor((endTime - now) / 1000));

            setLateRegSeconds(diffInSeconds);

            // Si le temps est écoulé, on arrête l'intervalle
            if (diffInSeconds <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        // Calcul initial immédiat (pour éviter 1 seconde de délai)
        const now = Date.now();
        const initialDiff = Math.max(0, Math.floor((endTime - now) / 1000));
        setLateRegSeconds(initialDiff);

        return () => clearInterval(interval);
    }, [game?.createdAt, game?.config.lateRegLimit, game?.id]);

    // ---------------------------------------------------------------------------
    // ACTIONS / HELPERS
    // ---------------------------------------------------------------------------
    const toggleTimer = () => {
        setIsTimerRunning((prev) => !prev);
    };

    const resetTimer = () => {
        setIsTimerRunning(false);
        setTimerSeconds(timeBlindDurartion);
    };

    return {
        // Timer des blindes
        timerSeconds,
        setTimerSeconds,
        isTimerRunning,
        setIsTimerRunning,
        toggleTimer,
        resetTimer,

        // Timer de late reg
        lateRegSeconds,
    };
}