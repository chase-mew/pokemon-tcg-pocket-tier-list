import { Card, Deck } from "./types";
import cardToString from "./card-to-string";
import {
  WINRATE_IMPORTANCE,
  POPULARITY_IMPORTANCE,
  CARDS_IN_DECK,
} from "../settings";

interface CardStats {
  winCount: number;
  totalGames: number;
  score?: number;
}

/**
 * Calculates the total score for all cards in a deck based on their individual scores and counts
 * @param cards - Array of cards in the deck
 * @param cardStats - Record of card statistics including scores
 * @returns The total weighted card score
 */
const calculateCardScore = (
  cards: Card[],
  cardStats: Record<string, CardStats>
): number => {
  return (
    cards.reduce((totalScore, card) => {
      const cardKey = cardToString(card);
      const cardScore = cardStats[cardKey]?.score || 0;
      return totalScore + cardScore * card.count;
    }, 0) / CARDS_IN_DECK
  );
};

export interface DeckScore {
  score: number;
  popularity: number;
  strength: number;
}

/**
 * Calculates a deck's overall score based on card performance and popularity
 * @param deck - The deck to score
 * @param cardStats - Statistics for all cards including win rates and scores
 * @param matchingGames - Number of games played with this deck
 * @param totalGames - Total number of games in the dataset
 * @returns The deck's overall score
 */
export const calculateDeckScore = (
  deck: Deck,
  cardStats: Record<string, CardStats>,
  matchingGames: number,
  totalGames: number
): DeckScore => {
  if (totalGames <= 0) {
    throw new Error("Total games must be greater than 0");
  }

  const popularity = matchingGames / totalGames;
  const cardScore = calculateCardScore(deck.cards, cardStats);

  return {
    score: cardScore * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE,
    popularity,
    strength: cardScore,
  };
};
