import {
  WINRATE_IMPORTANCE,
  POPULARITY_IMPORTANCE,
  RED_CARD_MULTIPLIER,
} from "../settings";

interface CardData {
  winCount: number;
  totalGames: number;
  score?: number;
}

interface CardScore extends Omit<CardData, "score"> {
  score: number;
  popularity: number;
}

/**
 * Calculates the score for a single card based on its win rate, popularity, and type
 */
const calculateSingleCardScore = (
  cardName: string,
  { winCount, totalGames }: CardData,
  totalMatchingGames: number
): { score: number; popularity: number } => {
  const winRate = winCount / totalGames;
  const popularity = totalGames / totalMatchingGames;
  const isRedCard = cardName.toLowerCase().includes("red card");
  const isMars = cardName.toLowerCase().includes("mars ");
  const multiplier = isRedCard || isMars ? RED_CARD_MULTIPLIER : 1;

  return {
    score:
      (winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE) *
      multiplier,
    popularity,
  };
};

/**
 * Calculates scores for all cards based on their win rates and popularity
 * @param cards - Record of card data containing win counts and total games
 * @param matchingGames - Total number of games to calculate popularity against
 * @returns Record of cards with calculated scores
 */
export const calculateCardScores = (
  cards: Record<string, CardData>,
  matchingGames: number
): Record<string, CardScore> => {
  if (matchingGames <= 0) {
    throw new Error("Total matching games must be greater than 0");
  }

  return Object.entries(cards).reduce<Record<string, CardScore>>(
    (result, [cardName, cardData]) => {
      result[cardName] = {
        ...cardData,
        ...calculateSingleCardScore(cardName, cardData, matchingGames),
      };
      return result;
    },
    {}
  );
};
