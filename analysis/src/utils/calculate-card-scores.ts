import {
  WINRATE_IMPORTANCE,
  POPULARITY_IMPORTANCE,
  RED_CARD_MULTIPLIER,
} from "../settings";

export const calculateCardScores = (
  cards: Record<
    string,
    { winCount: number; totalGames: number; score?: number }
  >,
  matchingGames: number
): Record<string, { winCount: number; totalGames: number; score: number }> => {
  const result: Record<
    string,
    { winCount: number; totalGames: number; score: number }
  > = {};

  for (const card in cards) {
    const cardData = cards[card];
    const winRate = cardData.winCount / cardData.totalGames;
    const popularity = cardData.totalGames / matchingGames;
    const isRedCard = card.toLowerCase().includes("red card");
    const multiplier = isRedCard ? RED_CARD_MULTIPLIER : 1;
    result[card] = {
      ...cardData,
      score:
        (winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE) *
        multiplier,
    };
  }

  return result;
};
