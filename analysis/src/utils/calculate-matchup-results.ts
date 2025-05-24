import { Deck, MatchupResult } from "./types";

export const calculateMatchupResults = (
  decks: Deck[],
  deckName: string
): Record<string, MatchupResult> => {
  const matchupResults: Record<string, MatchupResult> = {};
  const matchingDecks = decks.filter((deck) => deck.name === deckName);

  for (const deck of matchingDecks) {
    for (const opponent of deck.wins) {
      if (!matchupResults[opponent]) {
        matchupResults[opponent] = { wins: 0, losses: 0 };
      }
      matchupResults[opponent].wins += 1;
    }
    for (const opponent of deck.losses) {
      if (!matchupResults[opponent]) {
        matchupResults[opponent] = { wins: 0, losses: 0 };
      }
      matchupResults[opponent].losses += 1;
    }
  }

  return matchupResults;
};
