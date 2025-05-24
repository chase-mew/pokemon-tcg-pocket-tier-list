import {
  OLD_MULTIPLIER,
  NEW_MULTIPLIER,
  EXPANSION_RELEASE_DATE,
} from "../settings";
import { Deck } from "../types";

const getRecencyMultiplier = (game: Deck, newestDate: Date) => {
  const deckDate = new Date(game.date);
  const timePassed = deckDate.getTime() - EXPANSION_RELEASE_DATE.getTime();
  const totalTime = newestDate.getTime() - EXPANSION_RELEASE_DATE.getTime();
  const datePercentage = timePassed / totalTime;
  return datePercentage * (NEW_MULTIPLIER - OLD_MULTIPLIER) + OLD_MULTIPLIER;
};

const getMultiplier = (
  game: Deck,
  newestDate: Date,
  beforeExpansionMul: number,
  afterExpansionMul: number
) => {
  const deckDate = new Date(game.date);
  const isAfterExpansion = deckDate > EXPANSION_RELEASE_DATE;
  if (!isAfterExpansion) return beforeExpansionMul;
  return getRecencyMultiplier(game, newestDate) * afterExpansionMul;
};

export default getMultiplier;
