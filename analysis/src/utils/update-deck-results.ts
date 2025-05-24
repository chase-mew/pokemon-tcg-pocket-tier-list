import { Deck } from "./types";

export const updateDeckResults = (
  decks: Deck[],
  idToName: Record<string, string>
): Deck[] => {
  return decks.map((deck) => ({
    ...deck,
    wins: deck.wins.map((win) => idToName[win]).filter((name) => name),
    losses: deck.losses.map((loss) => idToName[loss]).filter((name) => name),
  }));
};
