import React from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card, H2, Separator, Text, Theme, XStack, YStack } from 'tamagui';
import { ChevronLeft, Club, Diamond, Heart, Spade, Trophy } from '@tamagui/lucide-icons';

// --- TYPE & DATA ---
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

const HAND_RANKINGS = [
    { rank: 1, name: "Quinte Flush Royale", desc: "10, Valet, Dame, Roi, As de la même couleur.", cards: [{ v: '10', s: 'hearts' }, { v: 'J', s: 'hearts' }, { v: 'Q', s: 'hearts' }, { v: 'K', s: 'hearts' }, { v: 'A', s: 'hearts' }] },
    { rank: 2, name: "Quinte Flush", desc: "5 cartes qui se suivent de la même couleur.", cards: [{ v: '8', s: 'spades' }, { v: '9', s: 'spades' }, { v: '10', s: 'spades' }, { v: 'J', s: 'spades' }, { v: 'Q', s: 'spades' }] },
    { rank: 3, name: "Carré", desc: "4 cartes de même valeur.", cards: [{ v: 'K', s: 'clubs' }, { v: 'K', s: 'diamonds' }, { v: 'K', s: 'hearts' }, { v: 'K', s: 'spades' }, { v: '4', s: 'clubs' }] },
    { rank: 4, name: "Full", desc: "Un Brelan (3) + Une Paire (2).", cards: [{ v: '10', s: 'hearts' }, { v: '10', s: 'spades' }, { v: '10', s: 'diamonds' }, { v: '5', s: 'clubs' }, { v: '5', s: 'hearts' }] },
    { rank: 5, name: "Couleur (Flush)", desc: "5 cartes de la même couleur (sans suite).", cards: [{ v: '2', s: 'diamonds' }, { v: '5', s: 'diamonds' }, { v: '9', s: 'diamonds' }, { v: 'J', s: 'diamonds' }, { v: 'A', s: 'diamonds' }] },
    { rank: 6, name: "Quinte (Suite)", desc: "5 cartes qui se suivent (couleurs mixtes).", cards: [{ v: '6', s: 'clubs' }, { v: '7', s: 'hearts' }, { v: '8', s: 'diamonds' }, { v: '9', s: 'spades' }, { v: '10', s: 'clubs' }] },
    { rank: 7, name: "Brelan", desc: "3 cartes de même valeur.", cards: [{ v: 'Q', s: 'clubs' }, { v: 'Q', s: 'hearts' }, { v: 'Q', s: 'spades' }, { v: '2', s: 'diamonds' }, { v: '5', s: 'clubs' }] },
    { rank: 8, name: "Double Paire", desc: "Deux paires différentes.", cards: [{ v: 'J', s: 'clubs' }, { v: 'J', s: 'hearts' }, { v: '8', s: 'spades' }, { v: '8', s: 'diamonds' }, { v: 'A', s: 'spades' }] },
    { rank: 9, name: "Paire", desc: "2 cartes de même valeur.", cards: [{ v: 'A', s: 'hearts' }, { v: 'A', s: 'clubs' }, { v: '8', s: 'diamonds' }, { v: '4', s: 'spades' }, { v: '2', s: 'hearts' }] },
    { rank: 10, name: "Hauteur", desc: "Aucune combinaison. La plus haute gagne.", cards: [{ v: 'A', s: 'spades' }, { v: 'J', s: 'diamonds' }, { v: '8', s: 'clubs' }, { v: '5', s: 'hearts' }, { v: '2', s: 'spades' }] },
];

export default function HandRankingScreen() {
    const router = useRouter();

    return (
        <Theme name="dark">
            <YStack flex={1} backgroundColor="$background" paddingTop="$10">

                {/* HEADER */}
                <YStack paddingHorizontal="$4" marginBottom="$4">
                    <YStack alignItems="center">
                        <Trophy size={40} color="$potGold" />
                        <Text color="$colorMuted" textAlign="center" marginTop="$3">De la plus forte à la plus faible</Text>
                    </YStack>
                </YStack>

                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    <YStack padding="$4" gap="$4">
                        {HAND_RANKINGS.map((hand) => (
                            <HandRow key={hand.rank} hand={hand} />
                        ))}
                    </YStack>
                </ScrollView>
            </YStack>
        </Theme>
    );
}

// --- SOUS-COMPOSANT : LIGNE DU CLASSEMENT ---
function HandRow({ hand }: { hand: any }) {
    const isTop3 = hand.rank <= 3;

    return (
        <Card bordered backgroundColor="$backgroundStrong" borderColor={isTop3 ? "$potGold" : "$borderColor"} borderWidth={isTop3 ? 1 : 1}>
            <Card.Header padded gap="$3">
                {/* Titre et Rang */}
                <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" gap="$3">
                        <YStack
                            width={28} height={28} borderRadius={14}
                            backgroundColor={isTop3 ? "$potGold" : "$borderColor"}
                            justifyContent="center" alignItems="center"
                        >
                            <Text color={isTop3 ? "$nightBase" : "$colorMuted"} fontWeight="900" fontSize="$3">#{hand.rank}</Text>
                        </YStack>
                        <Text color={isTop3 ? "$potGold" : "$color"} fontWeight="bold" fontSize="$5">{hand.name}</Text>
                    </XStack>
                </XStack>

                {/* Description */}
                <Text color="$colorMuted" fontSize="$3">{hand.desc}</Text>

                {/* VISUALISATION DES CARTES (SVG) */}
                <XStack gap="$2" marginTop="$2" justifyContent="flex-start">
                    {hand.cards.map((card: any, idx: number) => (
                        <MiniCard key={idx} value={card.v} suit={card.s} />
                    ))}
                </XStack>
            </Card.Header>
        </Card>
    );
}

// --- SOUS-COMPOSANT : LA CARTE SVG ---
function MiniCard({ value, suit }: { value: string, suit: Suit }) {
    const isRed = suit === 'hearts' || suit === 'diamonds';

    const getIcon = (s: Suit, size: number) => {
        switch (s) {
            case 'hearts': return <Heart size={size} color="$danger" fill="currentColor" />;
            case 'diamonds': return <Diamond size={size} color="$danger" fill="currentColor" />;
            case 'clubs': return <Club size={size} color="#1c1917" fill="currentColor" />; // Noir/Gris très foncé
            case 'spades': return <Spade size={size} color="#1c1917" fill="currentColor" />;
            default: return null;
        }
    };

    return (
        <YStack
            width={36}
            height={50}
            backgroundColor="#f5f5f5" // Fond carte blanc cassé
            borderRadius="$2"
            alignItems="center"
            justifyContent="center"
            borderColor="#e5e5e5"
            borderWidth={1}
        >
            <Text color={isRed ? "$danger" : "#1c1917"} fontWeight="900" fontSize="$4" lineHeight={16}>
                {value}
            </Text>
            <YStack marginTop={2}>
                {getIcon(suit, 14)}
            </YStack>
        </YStack>
    );
}