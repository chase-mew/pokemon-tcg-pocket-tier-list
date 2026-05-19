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
 * Wilson score interval lower bound for a binomial proportion. Used to give
 * small-sample card stats less weight: a card that appears in 100% of a
 * 1-deck archetype should not look as confidently good as one that appears
 * in 100% of a 200-deck archetype.
 *
 * Returns the lower bound at the given confidence level (default z=1.96 ≈
 * 95%). Returns 0 if n <= 0.
 */
const wilsonLowerBound = (p: number, n: number, z = 1.96): number => {
  if (n <= 0) return 0;
  const safeP = Math.max(0, Math.min(1, p));
  const denom = 1 + (z * z) / n;
  const center = safeP + (z * z) / (2 * n);
  const margin = z * Math.sqrt((safeP * (1 - safeP)) / n + (z * z) / (4 * n * n));
  return Math.max(0, (center - margin) / denom);
};

/**
 * Calculates the score for a single card based on its win rate, popularity, and type.
 *
 * Both the per-card win rate (over the card's appearances) and the per-card
 * popularity (over the archetype's qualified games) are passed through a
 * Wilson lower bound so that small samples within a tiny archetype don't
 * artificially saturate at 1.0.
 */
const calculateSingleCardScore = (
  cardName: string,
  { winCount, totalGames }: CardData,
  totalMatchingGames: number
): { score: number; popularity: number } => {
  const rawWinRate = totalGames > 0 ? winCount / totalGames : 0;
  const rawPopularity =
    totalMatchingGames > 0 ? totalGames / totalMatchingGames : 0;

  // Sample-size-aware versions: small samples shrink toward zero.
  const winRate = wilsonLowerBound(rawWinRate, totalGames);
  const popularity = wilsonLowerBound(rawPopularity, totalMatchingGames);

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
