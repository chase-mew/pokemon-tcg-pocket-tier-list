import { Card, Deck } from "./types";
import cardToString from "./card-to-string";
import {
  WINRATE_IMPORTANCE,
  POPULARITY_IMPORTANCE,
  CARDS_IN_DECK,
} from "../settings";

export const calculateDeckScore = (
  deck: Deck,
  cards: Record<
    string,
    { winCount: number; totalGames: number; score?: number }
  >,
  matchingGames: number,
  allGames: number
): number => {
  const popularity = matchingGames / allGames;
  const deckScore =
    deck.cards.reduce(
      (acc: number, card: Card) =>
        acc + (cards[cardToString(card)]?.score || 0) * card.count,
      0
    ) / CARDS_IN_DECK;
  return deckScore * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
};
