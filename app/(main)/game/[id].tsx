import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { YStack, Spinner, Theme } from 'tamagui';
import { AlertTriangle, Trophy } from '@tamagui/lucide-icons';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useUser } from '@clerk/clerk-expo';
import { useGameTimers } from '@/hooks/useGameTimers';

// ── PRIMITIVES ──
import { Container, Section, Heading, Caption } from '@/components/primitives/Layout';
import { Button } from '@/components/primitives/Button';
import { Divider } from '@/components/primitives/Cards';

// ── COMPOSANTS POKER ──
import { PotDisplay } from '@/components/poker/PotDisplay';
import { Timer } from '@/components/poker/Timer';

// ── COMPOSANTS UI ──
import { PokerBackground } from '@/components/layouts/PokerBackground';
import { GameHeader } from '@/components/features/game/GameHeader';
import { PlayerCard } from '@/components/features/game/PlayerCard';
import { AddGuestFooter } from '@/components/features/game/AddGuestFooter';
import { HelpBottomSheet } from '@/components/features/game/HelpBottomSheet';
import { GamePodium } from '@/components/features/game/GamePodium';

// ═══════════════════════════════════════════════════════════════════
// 🎮 GAME SCREEN - Écran de partie refactorisé
// ═══════════════════════════════════════════════════════════════════

export default function GameScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { 
        game, 
        loading, 
        addRebuy, 
        eliminatePlayer, 
        addGuestPlayer, 
        endGame, 
        joinGame, 
        isLateRegOpen 
    } = useGameLogic(id);
    const { user } = useUser();
    
    // Gestion des timers
    const { 
        timerSeconds, 
        isTimerRunning, 
        toggleTimer,
        resetTimer,
        lateRegSeconds 
    } = useGameTimers(game);

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Auto-join à l'ouverture
    useEffect(() => { 
        if (game && user) joinGame(); 
    }, [game?.id, user?.id]);

    // ── ACTIONS ──
    const onShareTable = async () => {
        const url = Linking.createURL(`/(main)/game/${id}`, { 
            scheme: 'pokernight' 
        });
        try {
            await Share.share({ 
                message: `♠️ Viens jouer au Poker ! La table est ouverte.\n\nBuy-in: ${game?.config.defaultBuyIn}€\n\nClique ici pour rejoindre : ${url}` 
            });
        } catch (error) { 
            console.error("Erreur partage :", error); 
        }
    };

    // ── ÉTATS DE CHARGEMENT & ERREURS ──
    if (loading) {
        return (
            <YStack 
                flex={1} 
                justifyContent="center" 
                alignItems="center" 
                backgroundColor="$background"
            >
                <Spinner size="large" color="$primary" />
            </YStack>
        );
    }

    if (!game) {
        return (
            <YStack 
                flex={1} 
                justifyContent="center" 
                alignItems="center" 
                backgroundColor="$background"
                gap="$4"
            >
                <AlertTriangle size={48} color="$danger" />
                <Heading size="md" color="$danger">
                    Partie introuvable
                </Heading>
                <Button 
                    variant="glass" 
                    onPress={() => router.back()}
                >
                    Retour
                </Button>
            </YStack>
        );
    }

    // ── PARTIE TERMINÉE ──
    if (game.status === 'FINISHED') {
        return (
            <GamePodium 
                game={game} 
                onClose={() => router.replace('/(main)/(tabs)/groups')} 
            />
        );
    }

    // ── LOGIQUE PARTIE ──
    const activePlayers = game.players.filter(p => p.status === 'ACTIVE');
    const isHeadsUpFinished = activePlayers.length <= 1 && game.players.length > 1;
    const sortedPlayers = [...game.players].sort((a, b) => {
        // Actifs en premier
        if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
        if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
        // Puis par rang final
        if (a.finalRank && b.finalRank) return a.finalRank - b.finalRank;
        return 0;
    });

    // ── RENDU ──
    return (
        <Theme name="dark">
            <PokerBackground>
                <Container paddingTop="$10" paddingHorizontal="$0">
                    
                    {/* Header */}
                    <GameHeader
                        totalPot={game.totalPot}
                        defaultBuyIn={game.config.defaultBuyIn}
                        lateRegLimit={game.config.lateRegLimit}
                        lateRegSeconds={lateRegSeconds}
                        onHelpPress={() => setIsHelpOpen(true)}
                        onSharePress={onShareTable}
                        onBackPress={() => router.push('/(main)/(tabs)/groups')}
                    />

                    {/* Pot Display */}
                    <YStack paddingHorizontal="$4" paddingVertical="$3">
                        <PotDisplay 
                            amount={game.totalPot} 
                            size="xl"
                        />
                    </YStack>

                    {/* Timer (si late reg actif) */}
                    {isLateRegOpen && lateRegSeconds !== null && lateRegSeconds > 0 && (
                        <YStack paddingHorizontal="$4" paddingBottom="$3">
                            <Timer 
                                seconds={lateRegSeconds}
                                isRunning={true}
                                variant="linear"
                                size="md"
                                warningAt={300}
                                dangerAt={60}
                            />
                        </YStack>
                    )}

                    <Divider spacing="lg" />

                    {/* Liste des joueurs */}
                    <ScrollView style={{ flex: 1 }}>
                        <Section paddingHorizontal="$4" gap="$3">
                            
                            {/* Bouton terminer (si heads-up fini) */}
                            {isHeadsUpFinished && (
                                <Button 
                                    variant="primary" 
                                    size="lg"
                                    icon={<Trophy size={20} color="$night900" />}
                                    onPress={endGame}
                                >
                                    Terminer la partie
                                </Button>
                            )}

                            {/* Label */}
                            <Caption 
                                textTransform="uppercase" 
                                letterSpacing={1}
                            >
                                Joueurs ({game.players.length})
                            </Caption>

                            {/* Cartes joueurs */}
                            {sortedPlayers.map((player) => (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    defaultBuyIn={game.config.defaultBuyIn}
                                    isLateRegOpen={isLateRegOpen}
                                    onRebuy={() => addRebuy(player.id, game.config.defaultBuyIn)}
                                    onEliminate={() => eliminatePlayer(player.id)}
                                />
                            ))}
                        </Section>
                    </ScrollView>

                    {/* Footer pour ajouter un invité */}
                    <AddGuestFooter
                        isLateRegOpen={isLateRegOpen}
                        onAddGuest={(name) => addGuestPlayer(name, game.config.defaultBuyIn)}
                    />

                    {/* Bottom Sheet aide/timers */}
                    <HelpBottomSheet
                        isOpen={isHelpOpen}
                        onOpenChange={setIsHelpOpen}
                        timerSeconds={timerSeconds}
                        isTimerRunning={isTimerRunning}
                        onToggleTimer={toggleTimer}
                        onResetTimer={resetTimer}
                    />

                </Container>
            </PokerBackground>
        </Theme>
    );
}
