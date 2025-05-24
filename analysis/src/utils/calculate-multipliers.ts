import { EXPANSION_RELEASE_DATE, POST_EXPANSION_PERCENT } from "../settings";
import { Deck } from "./types";

/**
 * Calculates the number of decks before and after the expansion date
 * @param decks Array of deck data
 * @returns Object containing counts of decks before and after expansion
 */
const getDeckCounts = (decks: Deck[]): { before: number; after: number } => {
  const expansionDate = new Date(EXPANSION_RELEASE_DATE);
  return decks.reduce(
    (acc, deck) => {
      const deckDate = new Date(deck.date);
      if (deckDate < expansionDate) {
        acc.before++;
      } else {
        acc.after++;
      }
      return acc;
    },
    { before: 0, after: 0 }
  );
};

/**
 * Calculates multipliers to balance deck distribution before and after expansion
 * @param decks Array of deck data
 * @returns Object containing multipliers for before and after expansion periods
 * @throws Error if no decks are provided
 */
export const calculateMultipliers = (
  decks: Deck[]
): { beforeExpansionMul: number; afterExpansionMul: number } => {
  if (!decks?.length) {
    throw new Error("No decks provided for multiplier calculation");
  }

  const totalDeckCount = decks.length;
  const { before: deckCountBeforeExpansion, after: deckCountAfterExpansion } =
    getDeckCounts(decks);

  const targetDeckCountAfterExpansion = totalDeckCount * POST_EXPANSION_PERCENT;
  const targetDeckCountBeforeExpansion =
    totalDeckCount * (1 - POST_EXPANSION_PERCENT);

  return {
    beforeExpansionMul:
      deckCountBeforeExpansion === 0
        ? Infinity
        : targetDeckCountBeforeExpansion / deckCountBeforeExpansion,
    afterExpansionMul:
      deckCountAfterExpansion === 0
        ? Infinity
        : targetDeckCountAfterExpansion / deckCountAfterExpansion,
  };
};
