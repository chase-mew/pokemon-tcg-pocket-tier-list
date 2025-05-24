import { EXPANSION_RELEASE_DATE, POST_EXPANSION_PERCENT } from "../settings";
import { Deck } from "./types";

export const calculateMultipliers = (
  decks: Deck[]
): { beforeExpansionMul: number; afterExpansionMul: number } => {
  const totalDeckCount = decks.length;
  const deckCountBeforeExpansion = decks.filter(
    (deck) => new Date(deck.date) < EXPANSION_RELEASE_DATE
  ).length;
  const deckCountAfterExpansion = decks.filter(
    (deck) => new Date(deck.date) >= EXPANSION_RELEASE_DATE
  ).length;
  const targetDeckCountAfterExpansion = totalDeckCount * POST_EXPANSION_PERCENT;
  const targetDeckCountBeforeExpansion =
    totalDeckCount * (1 - POST_EXPANSION_PERCENT);

  return {
    beforeExpansionMul:
      targetDeckCountBeforeExpansion / deckCountBeforeExpansion,
    afterExpansionMul: targetDeckCountAfterExpansion / deckCountAfterExpansion,
  };
};
