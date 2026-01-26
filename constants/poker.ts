// constants/poker.ts

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type PokerHand = {
    rank: number;
    name: string;
    desc: string;
    cards: { v: string; s: Suit }[];
};

export const HAND_RANKINGS: PokerHand[] = [
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